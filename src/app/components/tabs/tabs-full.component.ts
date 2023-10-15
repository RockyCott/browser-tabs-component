import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  HostListener,
  Input,
  QueryList,
  ViewChild,
} from '@angular/core';
import { TabComponent } from './components/tab/tab.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DynamicTabsDirective } from './directives/dynamic-tabs.directive';

@Component({
  selector: 'app-tabs-full',
  templateUrl: './tabs-full.component.html',
  styleUrls: ['./tabs-full.component.scss'],
})
export class TabsFullComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  @Input() darkMode = false;
  @Input() isDraggable = true;

  /*
   * Alternative approach of using an anchor directive
   * would be to simply get hold of a template variable
   * as follows
   */
  //@ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

  @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: any;

  // Angular <= v13
  //constructor(private _componentFactoryResolver: ComponentFactoryResolver) {}

  // contentChildren are set
  ngAfterContentInit() {
    // agregarle a la tab el index
    //this.tabs.forEach((tab, index) => (tab.index = index));

    this.resetTabIndex();

    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs?.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  newTab(title: string, template: any, data: any, isCloseable = false) {
    // (Angular <= v13)

    // get a component factory for our TabComponent
    // const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
    //   TabComponent
    // );

    // fetch the view container reference from our anchor directive
    //const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

    // create a component instance
    //const componentRef = viewContainerRef.createComponent(componentFactory);

    // (Angular >= v14)

    // create a component instance directly
    const componentRef =
      this.dynamicTabPlaceholder?.viewContainer?.createComponent(TabComponent);

    // set the according properties on our component instance
    const instance: TabComponent = componentRef.instance as TabComponent;

    instance.title = title;
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    //this.dynamicTabs.push(componentRef.instance as TabComponent);
    const tabs = this.tabs.toArray();
    tabs.push(componentRef.instance as TabComponent);
    this.tabs.reset(tabs);
    // set it active
    //this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
    this.selectTab(this.tabs.last);
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    // activate the tab the user has clicked on.
    tab.active = true;
  }

  closeTab(tab: TabComponent) {
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
  }

  closeActiveTab() {
    const activeStaticTabs = this.tabs.filter((tab) => tab.active);
    if (activeStaticTabs?.length) {
      // close the 1st active tab (should only be one at a time)
      this.closeTab(activeStaticTabs[0]);
    }
  }

  @HostListener('keydown', ['$event'])
  handleTabKey(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      // Evita el comportamiento predeterminado de la tecla Tab
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
        let newTabIndex = (activeTabIndex + direction) % this.tabs.length;

        if (newTabIndex < 0) {
          newTabIndex = this.tabs.length - 1;
        }

        // Cambia el enfoque a la nueva pestaña
        this.selectTab(this.tabs.toArray()[newTabIndex]);
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const tabs = this.tabs.toArray();
    moveItemInArray(tabs, event.previousIndex, event.currentIndex);
    this.tabs.reset(tabs);
    this.resetTabIndex();
  }

  resetTabIndex() {
    this.tabs.forEach((tab, index) => (tab.index = index));
  }
}
