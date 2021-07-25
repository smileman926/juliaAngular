import { Component, Input, OnInit } from '@angular/core';

import { WishRoomData } from '../../models';

@Component({
  selector: 'app-room-selection-administration-config',
  templateUrl: './room-selection-administration-config.component.pug',
  styleUrls: ['./room-selection-administration-config.component.sass']
})
export class RoomSelectionAdministrationConfigComponent implements OnInit {

  @Input() wishRoomData: WishRoomData;

  constructor() { }

  ngOnInit() {
  }

}
