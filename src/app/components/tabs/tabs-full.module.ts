import { NgModule } from '@angular/core';
import { TabsFullComponent } from './tabs-full.component';
import { TabComponent } from './components/tab/tab.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicTabsDirective } from './directives/dynamic-tabs.directive';
import { ScrollableContainerDirective } from './directives/scrollable-container.directive';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TabContentDirective } from './directives/tab-content.directive';
@NgModule({
  declarations: [TabsFullComponent, TabComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ScrollableContainerDirective,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    DynamicTabsDirective,
    MatCardModule,
    TabContentDirective,
  ],
  exports: [TabsFullComponent, TabComponent, TabContentDirective],
})
export class TabsFullModule {}
