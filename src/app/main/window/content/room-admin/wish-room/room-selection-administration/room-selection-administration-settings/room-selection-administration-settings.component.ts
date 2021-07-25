import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { WishRoomData } from '../../models';


@Component({
  selector: 'app-room-selection-administration-settings',
  templateUrl: './room-selection-administration-settings.component.pug',
  styleUrls: ['./room-selection-administration-settings.component.sass']
})
export class RoomSelectionAdministrationSettingsComponent implements OnInit {

  @Input() wishRoomData: WishRoomData;

  public form: FormGroup;
  public isLoading: Observable<boolean>;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService) {
      this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    console.error(this.wishRoomData);
    this.form = new FormGroup({
      wc_active: new FormControl(this.wishRoomData.config.wc_active === 'on')
    });
  }

  ngOnInit(): void {
    this.init();
  }

}
