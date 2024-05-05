# Browser tab Component

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.4.

I greatly appreciate your support and hope you find the component useful. Feel free to check it out and provide any additional feedback you may have. 🚀

# Tabs Component for Angular

This is an Angular component that provides a tabbed interface for your web application. It allows you to create tabs, switch between them, and perform various tab-related actions. It is inspired by the design of modern web browsers and offers a variety of features, including drag-and-drop, tab closing, tab editing, and more.

## Features of the Tabs Component

- Design similar to modern web browsers.
- Customizable appearance and behavior.
- Drag-and-drop functionality to reorder tabs.
- Option to close tabs individually.
- Possibility to edit tab names directly.
- Support for dynamic tabs that can be added at runtime.
- Visual indicator of the active tab for a better user experience.
- Full customization through multiple configuration options.
- **Scrollable Tabs**: Supports both scrollable and non-scrollable tab lists.
- **Tab Content**: Each tab can have its own content, which can be customized.
- **Tab Events**: You can listen to tab events such as tabAdded, tabRemoved, tabSelected, etc.

## It works in progress
![example 1](./assets%20readme/TabsComponent.gif)

![example 2](./assets%20readme/TabsComponent2.gif)

![example 3](./assets%20readme/TabsComponent3.gif)

![Use example](./assets%20readme//example%20code.png)

## Example of use

```html
<section class="gris-background">
  <app-tabs-full
    (tabSelected)="tabSelected($event)"
    (closeTabButton)="closeTabSelected($event)"
    (addTabButtonClick)="newDynamicTab()"
    [tabIndicator]="true"
    [tabIndicatorPosition]="'top'"
    [isNameEditable]="true"
    [hasCloseableEmit]="true"
    [allCloseable]="true"
  >
    <app-tab
      [tabTitle]="tab.title"
      [closeable]="true"
      [code]="tab.code"
      *ngFor="let tab of staticTabs"
    >
      <ng-container
        *ngIf="tab.template; else projectedContent"
        [ngTemplateOutlet]="tab.template"
        [ngTemplateOutletContext]="{ data: tab.data }"
      ></ng-container>
      <ng-template #projectedContent>
        <app-test [(testTitle)]="tab.title" [componentCode]="tab.code">
          <mat-card style="height: 300px"
            ><input type="text" /></mat-card></app-test
      ></ng-template>
    </app-tab>
  </app-tabs-full>
</section>

<ng-template #newTab let-data="data">
  <app-test [(testTitle)]="data.tabTitle" [componentCode]="data.code">
    <mat-card style="height: 300px"
      ><input type="text" /></mat-card></app-test
></ng-template>
```

#### Properties

- `darkMode`: Enables dark mode for the tabs component. (Default: `false`)
- `isDraggable`: Enables the ability to drag and drop tabs. (Default: `true`)
- `hasCloseableEmit`: Indicates whether to notify the parent component when closing a tab. (Default: `false`)
- `showAddTabButton`: Shows or hides the button to add new tabs. (Default: `true`)
- `isScrollable`: Enables lateral scrolling of tabs when there are too many to display. (Default: `true`)
- `scrollUnit`: Defines the amount of scrolling when pressing the lateral arrows in scrollable mode. (Default: `200`)
- `tabIndicator`: Indicates whether to show a visual indicator for the active tab. (Default: `false`)
- `tabIndicatorColor`: Color of the active tab indicator. (Default: `'var(--main-color)'`)
- `tabIndicatorPosition`: Position of the active tab indicator (`'top'` or `'bottom'`). (Default: `'top'`)
- `isNameEditable`: Indicates whether tab names can be edited. (Default: `true`)
- `allCloseable`: Indicates whether all tabs can be closed. (Default: `false`)
- `dragDropDisabled`: Disables the drag and drop tabs functionality. (Default: `false`)
- `tabNameChanged`: Emits when a tab name is changed.
- `closeTabButton`: Emits when closing a tab.
- `tabSelected`: Emits when a tab is selected.
- `addTabButtonClick`: Emits when clicking the add tab button.
- ...