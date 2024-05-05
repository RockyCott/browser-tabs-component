import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive to wrap tab lazy content.
 * */
@Directive({
  selector: '[tabContent]',
  exportAs: 'tabContent',
  standalone: true,
})
export class TabContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}