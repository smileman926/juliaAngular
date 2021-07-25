import { ViewService } from '@/app/main/view/view.service';
import { tabId } from '@/app/main/window/content/room-admin/room-category/models';

export function openRoomCategory(viewService: ViewService, properties?: RoomCategoryProperties) {
  viewService.openViewWithProperties('entityGroup', properties || {});
}

export interface RoomCategoryProperties {
  preselectRoomId?: number;
  preselectRoomCategoryId?: number;
  preselectTabId?: tabId;
}
