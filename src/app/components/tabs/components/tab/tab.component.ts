import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  /**
   * The tab title
   * @default 'New Tab'
   */
  @Input() public tabTitle: string = 'New Tab';

  /**
   * Is the tab active?
   * @default false
   */
  @Input() public active = false;

  /**
   * Is the tab closeable?
   * @default false
   */
  @Input() public isCloseable = false;

  /**
   * The template to render
   */
  @Input() public template: any;

  /**
   * The data context to pass to the template
   */
  @Input() public dataContext: any;

  /**
   * Is the tab disabled?
   * @default false
   */
  @Input() public isFirst = false;

  /**
   * is the tab the last one?
   * @default false
   */
  @Input() public isLast = false;

  /**
   * is the tab disabled?
   * @default false
   */
  @Input() public isDisabled = false;

  /**
   * is the tab editing?
   * @default false
   */
  @Input() public isNameEditing = false;

  /**
   * has the tab an error?
   */
  @Input() public inError: boolean = false;

  /**
   * The error content
   * @default 'Hay errores dentro de la pestaña'
   */
  @Input() public errorContent: string = 'Hay errores dentro de la pestaña';

  /**
   * The index of the tab
   */
  public index!: number;

  /**
   * The name of the tab in editing
   */
  public editName: string;

  /**
   * The name previous of the tab
   */
  public previousName: string;

  /**
   * is the tab dynamic?
   */
  @Input() public isDynamicTab: boolean = false;
}
