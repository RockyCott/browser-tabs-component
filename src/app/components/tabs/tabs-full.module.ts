import { NgModule } from '@angular/core';
import { TabsFullComponent } from './tabs-full.component';
import { TabComponent } from './components/tab/tab.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicTabsDirective } from './directives/dynamic-tabs.directive';
import { ScrollableDirective } from './directives/scrollable.directive';
@NgModule({
  declarations: [
    TabsFullComponent,
    TabComponent,
    DynamicTabsDirective,
    ScrollableDirective,
  ],
  imports: [CommonModule, DragDropModule],
  exports: [TabsFullComponent, TabComponent],
  entryComponents: [TabComponent],
})
export class TabsFullModule {}
