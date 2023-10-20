import { NgModule } from '@angular/core';
import { TabsFullComponent } from './tabs-full.component';
import { TabComponent } from './components/tab/tab.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicTabsDirective } from './directives/dynamic-tabs.directive';
import { ScrollableDirective } from './directives/scrollable.directive';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [TabsFullComponent, TabComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ScrollableDirective,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    DynamicTabsDirective,
    MatIconModule,
  ],
  exports: [TabsFullComponent, TabComponent],
})
export class TabsFullModule {}
