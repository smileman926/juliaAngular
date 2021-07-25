import { Component } from '@angular/core';

import { EntityInfo } from '../models';

@Component({
  selector: 'app-add-new-room',
  templateUrl: './add-new-room.component.pug',
  styleUrls: ['./add-new-room.component.sass']
})
export class AddNewRoomComponent {

  entityOwnerRoomInfoList: EntityInfo[];
  selectedEntity: EntityInfo;

  constructor() { }

  public init(list: EntityInfo[]): void {
    if (list.length > 0) {
      this.entityOwnerRoomInfoList = list;
      this.entityOwnerRoomInfoList.map( item => item.id = Number(item.e_id));
      this.selectedEntity = this.entityOwnerRoomInfoList[0];
    }
  }

  public selectItem(item: EntityInfo): void {
    this.selectedEntity = item;
  }

  public async save(): Promise<EntityInfo> {
    return this.selectedEntity;
  }

}
