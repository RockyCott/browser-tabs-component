import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamic-tabs]',
  standalone: true,
})
export class DynamicTabsDirective {
  constructor(public viewContainer: ViewContainerRef) {}
}
