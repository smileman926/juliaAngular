import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelectOnFocus]'
})
export class SelectOnFocusDirective {

  @HostListener('focus') onFocus() {
    this.elementRef.nativeElement.select();
  }

  constructor(private elementRef: ElementRef) {}

}
