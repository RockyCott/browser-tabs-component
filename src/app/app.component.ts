import { Component, ViewChild } from '@angular/core';
import { TabsFullComponent } from './components/tabs/tabs-full.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tabs-component';
  @ViewChild(TabsFullComponent) tabsFullComponent: TabsFullComponent;
  @ViewChild('newTab') newTabTemplate: any;

  numero = 4;

  onNewTab() {
    this.tabsFullComponent?.newTab(
      `Tab ${this.numero}`,
      this.newTabTemplate,
      //{},
      this.numero,
      true
    );
    this.numero++;
  }

  onCloseTab() {
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

  tabSelected(event: any) {
    console.log('tabSelected', event);
  }
}
