import { Component, Input, OnInit } from '@angular/core';

import { WishRoomData } from '../../models';

@Component({
  selector: 'app-room-selection-administration-price',
  templateUrl: './room-selection-administration-price.component.pug',
  styleUrls: ['./room-selection-administration-price.component.sass']
})
export class RoomSelectionAdministrationPriceComponent implements OnInit {

  @Input() wishRoomData: WishRoomData;

  constructor() { }

  ngOnInit() {
  }

}
