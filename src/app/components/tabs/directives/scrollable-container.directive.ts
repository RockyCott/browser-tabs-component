import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[scrollableContainer]',
  exportAs: 'scrollableContainer',
  standalone: true,
})
export class ScrollableContainerDirective {
  @Input() public scrollUnit: number = 200;
  @Input() public scrollDuration: number = 300;
  constructor(private elementRef: ElementRef) {}

  private get element() {
    return this.elementRef.nativeElement;
  }

  public get isOverflow() {
    return this.element?.scrollWidth > this.element?.clientWidth;
  }

  /**
   * Scroll to left or right
   * @param direction - 1 for right, -1 for left
   */
  public scroll(direction: number) {
    this.element.scrollLeft += this.scrollUnit * direction;
  }

  /**
   * Scroll to left or right with animation
   * @param direction - 1 for right, -1 for left
   */
  public scrollSmooth(direction: number) {
    const element = this.elementRef.nativeElement;

    if (element.scrollWidth > element.clientWidth) {
      const startPosition = element.scrollLeft;
      const targetPosition = startPosition + this.scrollUnit * direction;

      this.scrollTo(element, targetPosition, this.scrollDuration);
    }
  }

  /**
   * Scroll to target position with animation
   * @param element - element to scroll
   * @param to - target position
   * @param duration - duration of animation
   */
  private scrollTo(element: HTMLElement, to: number, duration: number) {
    const start = element.scrollLeft;
    let change = to - start;
    let currentTime = 0;
    const increment = 20;
    const animateScroll = () => {
      currentTime += increment;
      const val = this.easeInOutQuad(currentTime, start, change, duration);
      element.scrollLeft = val;

      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    animateScroll();
  }

  /**
   *
   * @param t - current time
   * @param b - start value
   * @param c - change in value
   * @param d - duration
   * @returns - value of scroll position
   */
  private easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  /**
   * Scroll to End of the element
   */
  scrollToEnd() {
    this.element.scrollLeft = this.element.scrollWidth;
  }

  /**
   * Get if can scroll to start
   */
  get canScrollStart() {
    return this.element.scrollLeft > 0;
  }

  /**
   * Get if can scroll to end
   */
  get canScrollEnd() {
    return (
      this.element.scrollLeft + this.element.clientWidth !=
      this.element.scrollWidth
    );
  }

  @HostListener('window:resize')
  onWindowResize() {} // required for update view when windows resized
}
