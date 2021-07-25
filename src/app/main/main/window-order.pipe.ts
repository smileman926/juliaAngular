import { Pipe, PipeTransform } from '@angular/core';

import { Window, windowsOrder } from '@/app/main/window/models';

@Pipe({
  name: 'windowOrder'
})
export class WindowOrderPipe implements PipeTransform {

  transform(orderMap: windowsOrder, window: Window, isOverlay?: boolean): number {
    let zIndex: number | undefined;
    if (window.instanceId && orderMap.get(window.instanceId)) {
      zIndex = orderMap.get(window.instanceId);
    }
    zIndex =  zIndex ? 10 + (zIndex * 2) : 10;
    if (isOverlay) {
      zIndex -= 1;
    }
    return zIndex;
  }

}
