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
   * Por defecto es false.
   */
  @Input() public darkMode = false;
  /**
   * Indica si las pestañas pueden ser arrastradas.
   * Por defecto es true.
   */
  @Input() public isDraggable = true;
  /**
   * Indica sí las pestañas se cierran sin notificar al oprimir el botón de cerrar,
   * O si se notifica al componente padre para que este decida si cerrar o no la pestaña.
   * Por defecto es false.
   */
  @Input() public hasCloseableEmit = false;

  /**
   * Indica si mostrar el botón de agregar pestaña.
   * Por defecto es true.
   */
  @Input() public showAddTabButton = true;

  /**
   * Indica si el 'responsive' de las pestañas es con scroll y flechas laterales.
   * Por defecto es false.
   */
  @Input() public isScrollable = false;

  /**
   * Indica si al ser scrollable, cuantas unidades se desplaza al oprimir las flechas laterales
   * Por defecto es 200.
   */
  @Input() public scrollUnit: number = 200;

  /**
   * Indica si mostrar el indicador de pestaña activa. (barra horizontal)
   * Por defecto es false.
   */
  @Input() public tabIndicator: boolean = false;

  /**
   * Indica la posición del indicador de pestaña activa. (barra horizontal)
   * Por defecto es 'top'.
   * Valores posibles: 'top' | 'bottom'
   */
  @Input() public tabIndicatorPosition: 'top' | 'bottom' = 'top';

  /**
   * Indica si permitir cerrar la pestaña con doble clic.
   * Por defecto es false.
   */
  @Input() public closeWithDoubleClick: boolean = false;

  /**
   * Indica si permitir editar el nombre de la pestaña.
   * Por defecto es true.
   */
  @Input() public isNameEditable: boolean = true;
  
  /**
   * Evento que se dispara cuando se cambia el nombre de una pestaña.
   */
  @Output() private tabNameChangedEvent = new EventEmitter<TabComponent>();

  /**
   * Evento que se dispara cuando se oprime el botón de cerrar pestaña.
   */
  @Output() private closeTabButtonEvent = new EventEmitter<TabComponent>();
  /**
   * Evento que se dispara cuando se selecciona una pestaña.
   */
  @Output() private tabSelectedEvent = new EventEmitter<TabComponent>();

  /**
   * Evento que se dispara cuando se oprime el botón de agregar pestaña.
   */
  @Output() private addTabButtonEvent = new EventEmitter<boolean>();

  /**
   * Evento que se dispara cuando se intenta cerrar una pestaña con doble clic.
   */
  @Output() private closeTabWithDoubleClickEvent =
    new EventEmitter<TabComponent>();

  @Output() private resetTabIndexEvent = new EventEmitter<TabComponent[]>();

  /**
   * Referencia al contenedor de pestañas dinamicas
   */
  @ViewChild(DynamicTabsDirective) private dynamicTabPlaceholder: any;

  /**
   * Referencia al contenedor que cuenta con la directiva ScrollableDirective
   * para el scroll horizontal de las pestañas con flechas laterales.
   */
  @ViewChild('scrollable') private appScrollable: ScrollableDirective;

  /**
   * Temporizador para el doble clic.
   */
  private doubleClickTimer: any;

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {}

  // contentChildren are set
  ngAfterContentInit() {
    this.resetTabIndex();
    // get all active tabs
    let activeTabs = this.tabs?.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs?.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  private scrollView(): void {
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

        const scrollPosition =
          selectedItemLeft + selectedItemWidth - containerWidth;
        // Realiza el desplazamiento de forma suave
        //this.renderer.setProperty(container, 'scrollLeft', scrollPosition);
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
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

    instance.tabTitle = title || 'New Tab';
    instance.editName = instance.tabTitle;
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;
    instance.isFirst = false;
    instance.isLast = true;

    const tabs = this.tabs.toArray();

    tabs.push(instance);
    this.tabs.reset(tabs);
    this.resetTabIndex();
    // set it active
    this.selectTab(this.tabs.last);
    if (this.isScrollable) {
      this.cdr.detectChanges();
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
  public selectTab(tab: TabComponent): void {
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
        // Determina la dirección del movimiento (Tab adelante o Tab atrás)
        const shiftKey = event.shiftKey;
        const direction = shiftKey ? -1 : 1;
        // Calcula el nuevo índice de la pestaña
        const tabLength = this.tabs.length;
        let newTabIndex = activeTab.index + direction;
        if (newTabIndex < 0) {
          newTabIndex = this.tabs.length - 1;
        } else if (newTabIndex >= tabLength) {
          newTabIndex = 0;
        }
        setTimeout(() => {
          // Cambia el enfoque a la nueva pestaña
          this.selectTab(this.tabs.toArray()[newTabIndex]);
        });
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
  private resetTabIndex(emitData: boolean = false) {
    if (this.tabs?.length) {
      this.tabs?.forEach((tab, index) => (tab.index = index));
      // set isFirst and isLast for all tabs
      this.tabs?.forEach((tab) => {
        tab.isFirst = false;
        tab.isLast = false;
      });
      this.tabs.first.isFirst = true;
      this.tabs.last.isLast = true;
      if (emitData) {
        this.resetTabIndexEvent.emit(this.tabs.toArray());
      }
    }
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

  protected handleTabDoubleClick(tab: TabComponent) {
    if (this.doubleClickTimer) {
      // El usuario hizo doble clic
      this.closeTabWithDoubleClickEvent.emit(tab);
      clearTimeout(this.doubleClickTimer);
      this.doubleClickTimer = null;
    } else {
      // posible doble clic
      this.doubleClickTimer = setTimeout(() => {
        clearTimeout(this.doubleClickTimer);
        this.doubleClickTimer = null;
      }, 300); // tiempo de espera
      this.selectTab(tab);
    }
  }

  protected startEditingTabName(tab: TabComponent): void {
    this.tabs.forEach((t) => (t.isNameEditing = false));
    tab.isNameEditing = true;
    tab.editName = tab.tabTitle;
    setTimeout(() => {
      const inputElement =
        this.elementRef.nativeElement.querySelector('#tabTitleInput');
      if (inputElement) {
        inputElement.select();
      }
    });
  }

  protected stopEditingTabName(tab: TabComponent, inputElement: HTMLInputElement): void {
    tab.isNameEditing = false;
    this.tabs.forEach((t) => (t.isNameEditing = false));
    if (tab.editName) {
      tab.tabTitle = tab.editName;
    } else {
      tab.editName = tab.tabTitle;
    }
    inputElement.setSelectionRange(0, 0);
    this.tabNameChangedEvent.emit(tab);
  }

  /**
   * Se dispara cuando se selecciona una pestaña.
   * @param tab - Pestaña seleccionada.
   */
  protected selectTabMode(tab: TabComponent) {
    if (this.closeWithDoubleClick) {
      this.handleTabDoubleClick(tab);
    } else {
      this.selectTab(tab);
    }
  }
}
