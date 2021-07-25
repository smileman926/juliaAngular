import { Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'input[appFocusOnEnter]'
})
export class FocusOnEnterDirective implements OnChanges, OnDestroy {

  @Input() foeMap!: focusOnEnterMap;
  @Input() foeIndex!: number;

  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const neighbor = this.getNeighbor(!event.shiftKey);
      if (neighbor) {
        neighbor.focus();
      }
    }
  }

  constructor(private elementRef: ElementRef) {}

  public focus(): void {
    this.elementRef.nativeElement.focus();
  }

  private deleteMapIndex(index?: number): void {
    if (!this.foeMap || index === undefined) {
      return;
    }
    if (this.foeMap.get(index) === this) {
      this.foeMap.delete(index);
    }
  }

  private getMapKeys(): number[] {
    const keysArray: number[] = [];
    const keys = this.foeMap.keys();
    let key = keys.next();
    while (!key.done) {
      keysArray.push(key.value);
      key = keys.next();
    }
    return keysArray;
  }

  private getNeighbor(next: boolean): FocusOnEnterDirective | undefined {
    const key = next ? this.getNextNeighborKey() : this.getPreviousNeighborKey();
    return this.foeMap.get(key);
  }

  private getNextNeighborKey(): number {
    const keys = this.getMapKeys();
    const keyIndex = keys.findIndex(key => key === this.foeIndex);
    if (keyIndex < 0 || keyIndex >= keys.length - 1) {
      return keys[0];
    }
    return keys[keyIndex + 1];
  }

  private getPreviousNeighborKey(): number {
    const keys = this.getMapKeys();
    const keyIndex = keys.findIndex(key => key === this.foeIndex);
    if (keyIndex < 0) {
      return keys[0];
    }
    if (keyIndex === 0) {
      return keys[keys.length - 1];
    }
    return keys[keyIndex - 1];
  }

  private setMapIndex(index?: number): void {
    if (!this.foeMap) {
      return;
    }
    if (index === undefined) {

    } else {
      this.foeMap.set(index, this);
    }
  }

  ngOnChanges({foeIndex}: SimpleChanges): void {
    if (foeIndex && foeIndex.previousValue !== foeIndex.currentValue) {
      this.deleteMapIndex(foeIndex.previousValue);
      this.setMapIndex(foeIndex.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.deleteMapIndex(this.foeIndex);
  }
}

export type focusOnEnterMap = Map<number, FocusOnEnterDirective>;
