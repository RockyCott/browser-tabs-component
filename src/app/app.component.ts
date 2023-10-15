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


  onNewTab() {
    this.tabsFullComponent?.newTab('About', this.newTabTemplate, {}, true);
  }

  onCloseTab() {
    // close the tab
    this.tabsFullComponent?.closeActiveTab();
  }
}
