import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TestComponent } from './test/test.component';
import { TabsFullModule } from '../components/tabs/tabs-full.module';
import { TabsFullComponent } from '../components/tabs/tabs-full.component';
import { TabComponent } from '../components/tabs/components/tab/tab.component';
import { TabConfig } from '../components/tabs/models/tab-config';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    TabsFullModule,
    TestComponent,
  ],
})
export class ExampleComponent {
  @ViewChild(TabsFullComponent)
  tabsFullComponent: TabsFullComponent;
  @ViewChild('newTab')
  newTabTemplate: any;
  @ViewChildren(TestComponent)
  protected tabs: QueryList<TestComponent>;
  @Input()
  public tabIndicator: boolean = false;
  @Input()
  public isScrollable: boolean = true;
  @Input()
  public isDragDrop: boolean = true;

  @Input()
  public staticTabs: any[] = [
    { title: 'Tab 1', code: 'code1' },
    { title: 'Tab 2', code: 'code2' },
    { title: 'Tab 3', code: 'code3' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}
  /**
   * @description
   * Method que se encarga de crear una nueva pestaña
   * @param tabConfig - Configuración de la pestaña
   * @param template - Template de la pestaña
   * @param data - Data de la pestaña
   */
  newStaticTab() {
    const title = this.randomTitle;
    const tabConfig = {
      title: title,
      code: title,
    };
    const newName = prompt('Nombre de la pestaña', 'Tab');
    if (newName) {
      tabConfig.title = newName;
    }
    this.staticTabs.push(tabConfig);
    this.cdr.detectChanges();
  }

  private get randomTitle() {
    return 'dy-' + Math.random().toString(36).substring(10);
  }

  /**
   * @description
   * Method que se encarga de crear una nueva pestaña
   * @param tabConfig - Configuración de la pestaña
   * @param template - Template de la pestaña
   * @param data - Data de la pestaña
   */
  protected newDynamicTab(): void {
    const title = this.randomTitle;
    const tabConfig: TabConfig = {
      tabTitle: title,
      closeable: true,
      code: title,
      dataContext: title,
    };
    const newName = prompt('Nombre de la pestaña', 'Tab');
    if (newName) {
      tabConfig.tabTitle = newName;
    }
    this.tabsFullComponent?.newDynamicTab(
      tabConfig,
      this.newTabTemplate,
      tabConfig
    );
  }

  closeTabSelected(tab: TabComponent) {
    const userConfirmed = confirm(`¿Desea cerrar la pestaña ${tab.tabTitle}?`);

    if (userConfirmed) {
      this.tabsFullComponent.closeTab(tab);
      // es importante eliminar la pestaña de staticTabs(en caso de ser utilizado)
      // esto se puede lograr mediante una propiedad que deberia ser unica como code
      this.staticTabs = this.staticTabs.filter(
        (staticTab) => staticTab.code !== tab.code
      );
      this.cdr.detectChanges();
    }
  }

  tabSelected(tab: TabComponent) {
    console.log('tabSelected', tab);
  }
}
