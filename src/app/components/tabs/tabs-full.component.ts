import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TabComponent } from './components/tab/tab.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DynamicTabsDirective } from './directives/dynamic-tabs.directive';
import { ScrollableDirective } from './directives/scrollable.directive';

@Component({
  selector: 'app-tabs-full',
  templateUrl: './tabs-full.component.html',
  styleUrls: ['./tabs-full.component.scss'],
})
export class TabsFullComponent implements AfterContentInit {
  /**
   * Lista de pestañas.
   */
  @ContentChildren(TabComponent) protected tabs!: QueryList<TabComponent>;
  /**
   * Indica si el modo oscuro está activado.
   */
  @Input() public darkMode = false;
  /**
   * Indica si las pestañas pueden ser arrastradas
   */
  @Input() public isDraggable = true;
  /**
   * Indica sí las pestañas se cierran sin notificar al oprimir el botón de cerrar,
   * O si se notifica al componente padre para que este decida si cerrar o no la pestaña.
   * Por defecto es false.
   */
  @Input() public hasCloseableEmit = false;

  @Input() public showAddTabButton = true;

  @Input() public isScrollable = false;

  @Input() public scrollUnit: number = 200;

  /**
   * Evento que se dispara cuando se oprime el botón de cerrar pestaña.
   */
  @Output() private closeTabButtonEvent = new EventEmitter<TabComponent>();
  /**
   * Evento que se dispara cuando se selecciona una pestaña.
   */
  @Output() private tabSelectedEvent = new EventEmitter<TabComponent>();

  @Output() private addTabButtonEvent = new EventEmitter<boolean>();

  @ViewChild(DynamicTabsDirective) private dynamicTabPlaceholder: any;

  @ViewChild('scrollable') private appScrollable: ScrollableDirective;

  protected isOverflow = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  // contentChildren are set
  ngAfterContentInit() {
    this.resetTabIndex();
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs?.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  scrollView() {
    const activeTab = this.tabs.find((tab) => tab.active);
    if (activeTab) {
      const tab = this.elementRef?.nativeElement.querySelector(
        `#tab-${activeTab.index}`
      );
      const container =
        this.elementRef.nativeElement.querySelector(`#tabContainer`);
      if (container && tab) {
        const containerWidth = container.clientWidth;
        const selectedItemLeft = tab.offsetLeft;
        const selectedItemWidth = tab.clientWidth;

        // Calcula la posición del scroll hacia la derecha
        const scrollPosition =
          selectedItemLeft + selectedItemWidth - containerWidth;
        // Realiza el desplazamiento hacia la derecha de forma suave
        this.renderer.setProperty(container, 'scrollLeft', scrollPosition);
      }
    }
  }

  public newTab(
    title: string,
    template: any,
    data: any,
    isCloseable = false
  ): void {
    // create a component instance directly
    const componentRef =
      this.dynamicTabPlaceholder?.viewContainer?.createComponent(TabComponent);

    // set the according properties on our component instance
    const instance: TabComponent = componentRef.instance as TabComponent;

    instance.title = title || 'New Tab';
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    //this.dynamicTabs.push(componentRef.instance as TabComponent);
    const tabs = this.tabs.toArray();
    tabs.push(componentRef.instance as TabComponent);
    this.tabs.reset(tabs);
    this.resetTabIndex();
    // set it active
    this.selectTab(this.tabs.last);
    if (this.isScrollable) {
      this.cdr.detectChanges();
      const appScrollableOverflow = this.appScrollable?.isOverflow;
      if (appScrollableOverflow !== this.isOverflow) {
        this.isOverflow = appScrollableOverflow;
      }
      setTimeout(() => {
        if (this.appScrollable?.canScrollEnd) {
          this.appScrollable.scrollToEnd();
        }
      });
    }
  }

  /**
   * Selecciona una pestaña.
   * @param tab - Pestaña a seleccionar.
   */
  selectTab(tab: TabComponent): void {
    const activeTabs = this.tabs.filter((tab) => tab.active);
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    // activate the tab the user has clicked on.
    tab.active = true;
    if (!this.isDraggable && activeTabs?.length && activeTabs[0] !== tab) {
      this.tabSelectedEvent.emit(tab);
    }
    this.scrollView();
  }

  /**
   *
   * @param tab - Pestaña a cerrar.
   * @param fromTabButton - Indica si la pestaña se cerró desde el botón de cerrar pestaña.
   */
  public closeTab(tab: TabComponent, fromTabButton: boolean = false): void {
    // Verifica si se debe emitir el evento de cerrar pestaña para que el componente padre decida si cerrar o no la pestaña.
    if (this.hasCloseableEmit && fromTabButton) {
      this.closeTabButtonEvent.emit(tab);
      return;
    }
    // Verifica si la pestaña que se va a cerrar es la pestaña activa actual.
    if (tab.active) {
      // Encuentra el índice de la pestaña actual en la lista de pestañas.
      const currentIndex = this.tabs.toArray().indexOf(tab);

      // Desactiva la pestaña actual.
      tab.active = false;

      // Activa la pestaña anterior o la siguiente, si existen.
      if (this.tabs.length > 1) {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex + 1;
        this.selectTab(this.tabs.toArray()[newIndex]);
      }
    }

    // Elimina la pestaña de la lista de pestañas.
    this.tabs.reset(this.tabs.filter((t) => t !== tab));
    this.resetTabIndex();
    if (this.isScrollable) {
      this.cdr.detectChanges();
      const appScrollableOverflow = this.appScrollable?.isOverflow;
      if (appScrollableOverflow !== this.isOverflow) {
        this.isOverflow = appScrollableOverflow;
      }
    }
  }

  /**
   * Cierra la pestaña activa actual.
   */
  public closeActiveTab() {
    const activeStaticTabs = this.tabs.filter((tab) => tab.active);
    if (activeStaticTabs?.length) {
      // close the 1st active tab (should only be one at a time)
      this.closeTab(activeStaticTabs[0]);
    }
  }

  @HostListener('keydown', ['$event'])
  protected handleTabKey(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      // Encuentra la pestaña activa actual
      const activeTab = this.tabs.find((tab) => tab.active);
      if (activeTab) {
        // Encuentra el índice de la pestaña activa
        const activeTabIndex = this.tabs.toArray().indexOf(activeTab);

        // Determina la dirección del movimiento (Tab adelante o Tab atrás)
        const shiftKey = event.shiftKey;
        const direction = shiftKey ? 1 : -1;

        // Calcula el nuevo índice de la pestaña
        let newTabIndex = (activeTabIndex + direction) % this.tabs?.length;

        if (newTabIndex < 0) {
          newTabIndex = this.tabs.length - 1;
        }

        // Cambia el enfoque a la nueva pestaña
        this.selectTab(this.tabs.toArray()[newTabIndex]);
      }
    }
  }

  /**
   * Se dispara cuando se arrastra y se suelta una pestaña.
   * @param event - Evento de arrastrar y soltar.
   */
  protected drop(event: CdkDragDrop<string[]>) {
    const tabs = this.tabs.toArray();
    moveItemInArray(tabs, event.previousIndex, event.currentIndex);
    this.tabs.reset(tabs);
    this.resetTabIndex();
  }

  /**
   * Reinicia los índices de las pestañas.
   */
  private resetTabIndex() {
    this.tabs?.forEach((tab, index) => (tab.index = index));
  }

  /**
   * Se dispara cuando se arrastra y se selecciona una pestaña.
   * @param tab - Pestaña seleccionada.
   */
  protected onDragSelectTab(tab: TabComponent) {
    this.tabSelectedEvent.emit(tab);
    setTimeout(() => {
      this.scrollView();
    });
  }

  protected addTabButton() {
    this.addTabButtonEvent.emit(true);
  }
}
