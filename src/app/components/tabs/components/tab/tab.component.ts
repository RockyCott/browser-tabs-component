import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input('tabTitle') title!: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template: any;
  @Input() dataContext: any;
  index!: number;
}
