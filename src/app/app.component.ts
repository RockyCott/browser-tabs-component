import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TabsFullComponent } from './components/tabs/tabs-full.component';
import { TabComponent } from './components/tabs/components/tab/tab.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tabs-component';
  @ViewChild(TabsFullComponent) tabsFullComponent: TabsFullComponent;
  @ViewChild('newTab') newTabTemplate: any;

  constructor(private cdr: ChangeDetectorRef){}

  /**
   * @description
   * Method que se encarga de crear una nueva pestaña
   * @param tabConfig - Configuración de la pestaña
   * @param template - Template de la pestaña
   * @param data - Data de la pestaña
   */
  protected onNewTab(
  ): void {
    const tabConfig = {
      tabTitle: 'Tab',
      isCloseable: true,
    };
    this.tabsFullComponent?.newTab(tabConfig, this.newTabTemplate, null);
    this.cdr.detectChanges();
  }

  onCloseTab(_tab: TabComponent = null) {
    // close the tab
    this.tabsFullComponent?.closeActiveTab();
  }

  onCloseTabSelected(tab: any) {
    // Puedes mostrar un cuadro de diálogo de confirmación si es necesario.
    const userConfirmed = confirm('¿Cerrar esta pestaña?');

    if (userConfirmed) {
      this.tabsFullComponent.closeTab(tab);
    }
  }

  onCloseTabSelectedWithDoubleClick(tab: any) {
    // Puedes mostrar un cuadro de diálogo de confirmación si es necesario.
    const userConfirmed = confirm(`¿Cerrar la pestaña ${tab.tabTitle}?`);

    if (userConfirmed) {
      this.tabsFullComponent.closeTab(tab);
    } else {
      this.tabsFullComponent.selectTab(tab);
    }
  }

  tabSelected(event: any) {
    console.log('tabSelected', event);
  }

  proof(event: any) {
    console.log(event);
  }
}
