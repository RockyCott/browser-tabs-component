import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TabComponent } from './components/tab/tab.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DynamicTabsDirective } from './directives/dynamic-tabs.directive';
import { ScrollableContainerDirective } from './directives/scrollable-container.directive';
import { ActivatedRoute } from '@angular/router';
import { Subject, of, startWith, switchMap, takeUntil } from 'rxjs';
import { TabConfig } from './models/tab-config';
/**
 * Basic tabset example
 *
 * ```html
 * <app-tabs-full>
 *  <app-tab tabTitle="Simple Tab #1">
 *    Tab content 1
 *  </app-tab>
 *  <app-tab tabTitle="Simple Tab #2">
 *    Tab content 2
 *  </app-tab>
 * </app-tabs-full>
 * ```
 *
 * ### Installation
 *
 * Import `TabsFullModule` to your feature module.
 * ```ts
 * @NgModule({
 *   imports: [
 *     // ...
 *     TabsFullModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * `icon` should be used to add an icon to the tab. Icon can also be combined with title.
 *
 * It is also possible to disable a tab using `disabled` property
 *
 * By default, the tab contents instantiated straightaway. To make tab contents load lazy,
 * declare the body of a tab in a template with `tabContent` directive <ng-template tabTitle>.
 *
 * You can provide a template as a tab title via `<ng-template tabTitle>`:
 */
@Component({
  selector: 'app-tabs-full',
  templateUrl: './tabs-full.component.html',
  styleUrls: ['./tabs-full.component.scss'],
})
export class TabsFullComponent implements AfterContentInit, OnDestroy {
  /**
   * Lista de pestañas.
   */
  @ContentChildren(TabComponent)
  protected tabs: QueryList<TabComponent>;

  /**
   * Indica si el modo oscuro está activado.
   * @type {boolean}
   * @default false
   */
  @Input()
  public darkMode: boolean = false;

  /**
   * Indica si las pestañas pueden ser arrastradas.
   *@type {boolean}
   * @default true
   */
  @Input()
  public isDraggable: boolean = true;

  /**
   * Indica sí las pestañas se cierran sin notificar al oprimir el botón de cerrar,
   * O si se notifica al componente padre para que este decida si cerrar o no la pestaña.
   * @type {boolean}
   * @default false
   */
  @Input()
  public hasCloseableEmit: boolean = false;

  /**
   * Indica si mostrar el botón de agregar pestaña.
   * @type {boolean}
   * @default true
   */
  @Input()
  public showAddTabButton: boolean = true;

  /**
   * When enabled displays buttons at each side of the tab headers to scroll the tab list.
   * @type {boolean}
   * @default true
   */
  @Input()
  public isScrollable: boolean = true;

  /**
   * Indica si al ser scrollable, cuantas unidades se desplaza al oprimir las flechas laterales
   * @type {number}
   * @default 200
   */
  @Input()
  public scrollUnit: number = 200;

  /**
   * Indica si mostrar el indicador de pestaña activa. (barra horizontal)
   * Por defecto es false.
   * @type {boolean}
   * @default false
   */
  @Input()
  public tabIndicator: boolean = false;

  /**
   * @description
   * Color del indicator para la tab activa
   * @type {string}
   * @default 'var(--main-color)''
   */
  @Input()
  public tabIndicatorColor: string = 'var(--main-color';

  /**
   * Indica la posición del indicador de pestaña activa. (barra horizontal)
   * @type {'top' | 'bottom'}
   * @default 'top'
   */
  @Input()
  public tabIndicatorPosition: 'top' | 'bottom' = 'top';

  /**
   * Indica si permitir cerrar la pestaña con doble clic.
   * @type {boolean}
   * @default false
   */
  @Input()
  public closeWithDoubleClick: boolean = false;

  /**
   * Indica si permitir editar el nombre de la pestaña.
   * @type {boolean}
   * @default true
   */
  @Input()
  public isNameEditable: boolean = true;

  /**
   * Indica si todas las pestañas pueden ser cerradas.
   * Por defecto es false.
   * Si es true, se muestra el botón de cerrar en las pestañas
   * que tengan el atributo closeable en true.
   * @type {boolean}
   * @default false
   */
  @Input()
  public allCloseable: boolean = false;

  /**
   * Indica si el componente de tabs cuentan
   * con la funcionalidad de ser arrastradas o no
   */
  @Input() public dragDropDisabled: boolean = false;

  /**
   * Take full width of a parent
   * @param {boolean} val
   */
  @Input()
  set fullWidth(val: boolean) {
    this.fullWidthValue = Boolean(val);
  }

  /**
   * Evento que se dispara cuando se cambia el nombre de una pestaña.
   * @type {EventEmitter<TabComponent>}
   */
  @Output()
  protected tabNameChanged: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  /**
   * Evento que se dispara cuando se oprime el botón de cerrar pestaña.
   * @type {EventEmitter<TabComponent>}
   */
  @Output()
  protected closeTabButton: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();
  /**
   * Evento que se dispara cuando se selecciona una pestaña.
   * @type {EventEmitter<TabComponent>}
   */
  @Output()
  protected tabSelected: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  /**
   * Evento que se dispara cuando se oprime el botón de agregar pestaña.
   * @type {EventEmitter<boolean>}
   */
  @Output()
  protected addTabButtonClick: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  /**
   * Evento que se dispara cuando se intenta cerrar una pestaña con doble clic.
   * @type {EventEmitter<TabComponent>}
   */
  @Output()
  protected closeTabWithDoubleClick: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  /**
   * Evento que se dispara cuando se hace clic en el icono de error de una pestaña.
   * @type {EventEmitter<TabComponent>}
   */
  @Output()
  protected iconClick: EventEmitter<TabComponent> =
    new EventEmitter<TabComponent>();

  /**
   * Referencia al contenedor de pestañas dinamicas.
   * Se utiliza para crear componentes dinamicamente.
   * @see DynamicTabsDirective
   */
  @ViewChild(DynamicTabsDirective)
  private dynamicTabPlaceholder: any;

  /**
   * Referencia al contenedor que cuenta con la directiva ScrollableDirective
   * para el scroll horizontal de las pestañas con flechas laterales.
   * @see ScrollableContainerDirective
   */
  @ViewChild('scrollable')
  private scrollable: ScrollableContainerDirective;

  /**
   * Temporizador para el doble clic.
   */
  private doubleClickTimer: any;

  /**
   * If specified - tabset listens to this parameter and selects corresponding tab.
   * @type {string}
   */
  @Input()
  public routeParam: string;

  @HostBinding('class.full-width')
  fullWidthValue: boolean = false;

  /**
   * Subject used to signal the destruction of the component.
   * This subject is used to unsubscribe from observables and prevent memory leaks.
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Lista de pestañas dinámicas clonadas.
   * @type {TabComponent[]}
   */
  private cloneDynamicInstance: TabComponent[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // contentChildren are set
  // ngAfterContentInit() {
  //   this.initIndexes();
  //   this.tabs?.changes?.pipe(takeUntil(this.destroy$)).subscribe(() => {
  //     this.repairTabs();
  //   });
  //   this.route?.params
  //     .pipe(
  //       map((params: any) =>
  //         this.tabs.find((tab) =>
  //           this.routeParam ? tab.route === params[this.routeParam] : tab.active
  //         )
  //       ),
  //       delay(0),
  //       map((tab: TabComponent) => tab || this.tabs.first),
  //       filter((tab: TabComponent) => !!tab),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe((tabToSelect: TabComponent) => {
  //       this.selectTab(tabToSelect);
  //       this.cdr.markForCheck();
  //     });
  // }

  ngAfterContentInit() {
    this.initIndexes();
    // Suscripción a cambios en las pestañas
    this.tabs?.changes
      ?.pipe(
        startWith(this.tabs.toArray()), // Emite el array inicial de pestañas
        switchMap((tabs) => {
          let arrayTabs = tabs instanceof QueryList ? tabs.toArray() : tabs;
          const activeTab = arrayTabs.find((tab: TabComponent) => tab.active);
          return activeTab ? of(activeTab) : of(arrayTabs[0]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((tabToSelect: TabComponent) => {
        setTimeout(() => {
          this.selectTab(tabToSelect);
          this.repairTabs();
          this.cdr.markForCheck();
        });
      });
  }

  printTabs() {
    console.log(this.tabs.toArray());
  }
  /**
   * Repairs the tabs by performing various operations such as detecting duplicate codes,
   * adjusting dynamic tabs, repairing ids, tab titles, isFirst, isLast, and positions,
   * and selecting the initial tab.
   */
  public repairTabs(): void {
    let tabs = this.tabs.toArray();

    this.detectDuplicateCodes(tabs);

    const tabsLength = tabs.length;
    if (this.cloneDynamicInstance?.length) {
      const dynamicTabLength = this.cloneDynamicInstance.length;
      const totalTabs = tabsLength + dynamicTabLength;
      let dynamicIndex = 0;
      for (const dynamicTab of this.cloneDynamicInstance) {
        dynamicTab.dynamicIndex = dynamicIndex;
        dynamicIndex++;
        const existingTab = tabs.find((tab) => tab.index === dynamicTab.index);
        if (!existingTab) {
          let index = tabs.findIndex((tab) => {
            if (tab.position == null || tab.position === undefined) {
              tab.position = totalTabs;
            }
            return tab.position > dynamicTab.position;
          });
          tabs.splice(index === -1 ? tabs.length : index, 0, dynamicTab);
        }
      }
    }
    // repair ids, tabTitles, isFirst and isLast
    tabs.forEach((tab, index: number) => {
      tab.index = index;
      tab.tabTitle = tab.tabTitle || `New Tab`;
      tab.isFirst = false;
      tab.isLast = false;
      tab.position = index;
      tab.code = tab.code || this.findNewCode().toString();
    });

    // repair isFirst and isLast
    if (tabsLength > 0) {
      tabs[0].isFirst = true;
      tabs[tabsLength - 1].isLast = true;
    }
    tabs = this.selectInitialTab(tabs);
    this.tabs.reset(tabs);
    this.cdr.detectChanges();
  }

  /**
   * Detects and throws an error if there are any tabs with duplicated codes.
   */
  private detectDuplicateCodes(tabs: TabComponent[]): void {
    const codes = tabs.map((tab) => tab.code);
    const uniqueCodes = new Set(codes);
    if (codes.length !== uniqueCodes.size) {
      const duplicatedCodes = [...uniqueCodes].filter(
        (code) => codes.indexOf(code) !== codes.lastIndexOf(code)
      );
      throw new Error(
        `There are tabs with duplicated codes: ${duplicatedCodes.join(', ')}`
      );
    }
  }

  /**
   * Selects the initial tab from the given array of tabs.
   * If there are multiple active tabs, it deactivates all of them except the first one,
   * selects the first tab, and emits an event for the selected tab.
   *
   * @param tabs - The array of tabs to select from.
   * @returns The updated array of tabs.
   */
  private selectInitialTab(tabs: TabComponent[]): TabComponent[] {
    const activeTab = tabs.filter((tab) => tab.active);
    if (activeTab?.length > 1) {
      tabs.forEach((tab) => (tab.active = false));
      tabs[0].active = true;
      this.selectTab(tabs[0]);
      this.tabSelected.emit(tabs[0]);
    }
    return tabs;
  }

  /**
   * Scrolls the tab container to make the active tab visible.
   */
  private scrollView(): void {
    const activeTab = this.tabs.find((tab) => tab.active);
    const container =
      this.elementRef?.nativeElement.querySelector(`#tabContainer`);
    if (activeTab && container) {
      const { index } = activeTab;
      const tab: HTMLElement | null =
        this.elementRef?.nativeElement.querySelector(`#tab-${index}`);
      if (tab) {
        const { clientWidth: containerWidth } = container;
        const { offsetLeft, clientWidth: selectedItemWidth } = tab;

        const scrollPosition = offsetLeft + selectedItemWidth - containerWidth;
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }

  /**
   * Creates a new dynamic tab with the specified configuration, template, and data.
   *
   * @param tabConfig - The configuration for the new tab.
   * @param template - The template to be used for rendering the tab content.
   * @param data - The data to be passed to the tab component.
   */
  public newDynamicTab(
    tabConfig: TabConfig,
    template: TemplateRef<any>,
    data: any = null
  ): void {
    // create a component instance directly
    const componentRef =
      this.dynamicTabPlaceholder?.viewContainer?.createComponent(TabComponent);

    // set the according properties on our component instance
    const instance: TabComponent = componentRef?.instance as TabComponent;
    const { ...rest } = tabConfig;
    Object.assign(instance, rest);
    instance.editName = instance.tabTitle;
    instance.dataContext = data;
    instance.isFirst = false;
    instance.isLast = true;
    instance.template = template;
    instance.isDynamicTab = true;
    instance['dynamicIndex'] =
      this.dynamicTabPlaceholder?.viewContainer?.length - 1;
    instance.position = this.tabs.length;

    const tabs = this.tabs?.toArray();

    instance.index = tabs.length;
    instance.code = instance.code || instance.index.toString();
    this.cloneDynamicInstance.push(instance);
    tabs.push(instance);
    this.tabs?.reset(tabs);
    // set it active
    this.selectTab(this.tabs.last);
    if (this.isScrollable) {
      setTimeout(() => {
        if (this.scrollable?.canScrollEnd) {
          this.scrollable.scrollToEnd();
        }
      });
    }
    this.repairTabs();
    this.cdr.detectChanges();
  }

  /**
   * Selecciona una pestaña.
   * @param tab - Pestaña a seleccionar.
   */
  public selectTab(selectedTab: TabComponent): void {
    if (!selectedTab || selectedTab.active || selectedTab.disabled) {
      return;
    }

    const activeTabs = this.tabs.filter((tab) => tab.active);
    // deactivate all tabs
    this.tabs.forEach((tab) => (tab.active = tab === selectedTab));
    setTimeout(() => {
      selectedTab.active = true;
      if (
        !this.isDraggable &&
        activeTabs?.length &&
        activeTabs[0] !== selectedTab
      ) {
        this.tabSelected.emit(selectedTab);
      }
      this.scrollView();
    });
  }

  /**
   * Cierra una pestaña dada.
   * @param tab - Pestaña a cerrar.
   * @param fromTabButton - Indica si la pestaña se cerró desde el botón de cerrar pestaña o desde el componente padre.
   */
  public closeTab(tab: TabComponent, fromTabButton: boolean = false): void {
    // Verifica si se debe emitir el evento de cerrar pestaña para que el componente padre decida si cerrar o no la pestaña.
    if (this.hasCloseableEmit && fromTabButton) {
      this.closeTabButton.emit(tab);
      return;
    }
    if (tab.active) {
      const currentIndex = this.tabs.toArray().indexOf(tab);

      tab.active = false;

      // Activa la pestaña anterior o la siguiente, si existen.
      if (this.tabs.length > 1) {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex + 1;
        this.selectTab(this.tabs.toArray()[newIndex]);
      }
    }
    if (tab?.isDynamicTab) {
      this.removeDynamicTabByIndex(tab.dynamicIndex);
    }
    this.removeStaticTab(tab);
    this.cdr.detectChanges();
  }

  /**
   * Removes a static tab from the list of tabs.
   *
   * @param tab - The tab to be removed.
   */
  private removeStaticTab(tab: TabComponent): void {
    const filterTabs = this.tabs.filter((t) => t !== tab);
    this.tabs.reset(filterTabs);
  }

  /**
   * Removes a dynamic tab by its index.
   *
   * @param index - The index of the tab to remove.
   */
  private removeDynamicTabByIndex(index: number): void {
    this.dynamicTabPlaceholder?.viewContainer?.remove(index);
    this.cloneDynamicInstance.splice(index, 1);
  }

  /**
   * Cierra la pestaña activa actual.
   */
  public closeActiveTab(): void {
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
      const activeTab = this.tabs.find((tab) => tab.active);
      if (activeTab) {
        // Determina la dirección del movimiento (Tab adelante o Tab atrás)
        const shiftKey = event.shiftKey;
        const direction = shiftKey ? -1 : 1;
        // Calcula el nuevo índice de la pestaña
        const newIndex = this.calculateNewTabIndex(activeTab.index, direction);
        setTimeout(() => {
          // Cambia el enfoque a la nueva pestaña
          this.selectTab(this.tabs.toArray()[newIndex]);
        });
      }
    }
  }

  /**
   * Calculates the new tab index based on the current index and direction.
   * If the new index is out of bounds, it wraps around to the opposite end of the tab list.
   *
   * @param currentIndex - The current index of the tab.
   * @param direction - The direction to move the tab index. Positive values move forward, negative values move backward.
   * @returns The new tab index.
   */
  private calculateNewTabIndex(
    currentIndex: number,
    direction: number
  ): number {
    const tabLength = this.tabs.length;
    let newTabIndex = currentIndex + direction;
    if (newTabIndex < 0) {
      newTabIndex = tabLength - 1;
    } else if (newTabIndex >= tabLength) {
      newTabIndex = 0;
    }
    return newTabIndex;
  }

  /**
   * Method to find a new index for a new tab.
   * @returns - Retorna el índice de la nueva pestaña.
   */
  private findNewCode(): string {
    const codes = this.tabs.map((tab) => tab.code);
    const maxCode = Math.max(...codes.map((code) => parseInt(code, 10)));
    return (maxCode + 1).toString();
  }

  /**
   * Se dispara cuando se arrastra y se suelta una pestaña.
   * @param event - Evento de arrastrar y soltar.
   */
  protected drop(event: CdkDragDrop<string[]>) {
    const tabs = this.tabs.toArray();
    moveItemInArray(tabs, event.previousIndex, event.currentIndex);
    this.tabs.reset(tabs);
    this.repairTabs();
  }

  /**
   * Reinicia los índices de las pestañas.
   */
  private initIndexes() {
    if (this.tabs?.length) {
      this.tabs?.forEach((tab, index) => {
        tab.index = index;
        tab.isFirst = false;
        tab.isLast = false;
        tab.position = index;
        tab.code = tab.code || this.findNewCode().toString();
      });
      this.tabs.first.isFirst = true;
      this.tabs.last.isLast = true;
      this.detectDuplicateCodes(this.tabs.toArray());
    }
  }

  /**
   * Se dispara cuando se arrastra y se selecciona una pestaña.
   * @param tab - Pestaña seleccionada.
   */
  protected dragSelectTab(tab: TabComponent) {
    if (tab.disabled) {
      return;
    }
    setTimeout(() => {
      this.tabSelected.emit(tab);
      this.scrollView();
    });
  }

  /**
   * Se dispara cuando se oprime el botón de agregar pestaña.
   */
  protected addTabButtonClicked(): void {
    this.addTabButtonClick.emit(true);
  }

  protected handleTabDoubleClick(tab: TabComponent) {
    if (this.doubleClickTimer) {
      // El usuario hizo doble clic
      this.closeTabWithDoubleClick.emit(tab);
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

  /**
   * Se dispara cuando se hace doble clic en el nombre de una pestaña.
   * Siempre y cuando el componente tabs tenga activado el modo de edición de nombre.
   * @param tab - Pestaña seleccionada.
   */
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

  /**
   * Se dispara cuando se hace clic fuera del nombre de una pestaña.
   * Siempre y cuando el componente tabs tenga activado el modo de edición de nombre.
   * @param tab - Pestaña seleccionada.
   * @param inputElement - Elemento input del nombre de la pestaña.
   */
  protected stopEditingTabName(
    tab: TabComponent,
    inputElement: HTMLInputElement
  ): void {
    tab.isNameEditing = false;
    this.tabs.forEach((t) => (t.isNameEditing = false));
    if (tab.editName) {
      tab.previousName = tab.tabTitle;
      tab.tabTitle = tab.editName;
    } else {
      tab.editName = tab.tabTitle;
    }
    inputElement.setSelectionRange(0, 0);
    this.tabNameChanged.emit(tab);
  }

  /**
   * Delete all tabs
   */
  public deleteAllTabs(): void {
    this.tabs.reset([]);
    this.dynamicTabPlaceholder?.viewContainer?.clear();
    this.cloneDynamicInstance = [];
    this.cdr.detectChanges();
  }

  /**
   * Method to get the tab by index
   * @param index - Índice de la pestaña a buscar
   * @returns - Retorna la pestaña que coincida con el índice dado
   */
  public tabByIndex(index: number): TabComponent | undefined {
    return this.tabs?.find((tab) => tab.index === index);
  }

  /**
   * Method to get the tab by code
   * @param code - Código de la pestaña a buscar
   * @returns - Retorna la pestaña que coincida con el código dado
   */
  public tabByCode(code: string): TabComponent | undefined {
    return this.tabs?.find((tab) => tab.code === code);
  }

  /**
   * Notifica al componente padre que se hizo clic en el icono de tipo success | info | warning | error
   * @param tab - Pestaña a la que pertenece el icono de error
   */
  public clickOnIcon(tab: TabComponent): void {
    this.iconClick?.emit(tab);
  }
}
