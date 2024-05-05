import {
  Component,
  ContentChild,
  HostBinding,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TabContentDirective } from '../../directives/tab-content.directive';
import { statusTabIcon } from '../../models/status-icon.type';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
})
export class TabComponent {
  /**
   * The tab content
   */
  @ContentChild(TabContentDirective) 
  tabContentDirective: TabContentDirective;
  /**
   * The tab title
   * @type {string}
   * @default 'New Tab'
   */
  @Input('tabTitle')
  get tabTitle(): string {
    return this.tabTitleValue;
  }
  set tabTitle(title: string) {
    this.tabTitleValue = title || 'New Tab';
  }

  protected tabTitleValue: string;

  /**
   * The index of the tab
   * @type {number}
   */
  public index!: number;

  /**
   * Tab icon name or icon config object
   * @type {string}
   */
  @Input()
  public icon: string = '';

  @Input()
  public iconColor: string = 'var(--main-color)';

  @Input()
  public iconTooltipText: string = '';

  /**
   * Item is disabled and cannot be opened.
   * @type {boolean}
   */
  @Input('status')
  @HostBinding('class.status')
  get status(): statusTabIcon {
    return this.statusValue;
  }
  set status(val: statusTabIcon) {
    this.statusValue = val;
  }

  /**
   * value of the status
   * @type {statusTabIcon}
   * @default 'default'
   */
  protected statusValue: statusTabIcon = 'default';

  /**
   * Item is disabled and cannot be opened.
   * @type {boolean}
   */
  @Input('disabled')
  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.disabledValue;
  }
  set disabled(val: boolean) {
    this.disabledValue = Boolean(val);
  }

  /**
   * Makes this tab a link that initiates navigation to a route
   * @type string
   */
  @Input() route: string;

  @HostBinding('class.content-active')
  protected activeValue: boolean = false;

  disabledValue = false;

  /**
   * Specifies active tab
   * @returns {boolean}
   */
  @Input()
  get active(): boolean {
    return this.activeValue;
  }
  set active(val: boolean) {
    this.activeValue = Boolean(val);
  }

  /**
   * Can the tab be closed?
   * @default false
   */
  @Input() public closeable = false;

  /**
   * The template to render
   */
  @Input() public template: TemplateRef<any>;

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
   * is the tab editing?
   * @default false
   */
  @Input() public isNameEditing = false;

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

  /**
   * The index of the dynamic tab
   */
  public dynamicIndex!: number;

  /**
   * The index of the static tab
   */
  @Input()
  public code: string;

  /**
   * The position of the tab
   * min 0
   * max tabs.length - 1
   */
  public position!: number;
}
