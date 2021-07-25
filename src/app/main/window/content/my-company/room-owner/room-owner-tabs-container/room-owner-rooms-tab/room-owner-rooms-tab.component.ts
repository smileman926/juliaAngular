import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import dayjs from 'dayjs';
import { Observable } from 'rxjs';

import { ModalService } from '@/ui-kit/services/modal.service';

import { ApiCompanyService } from '@/app/helpers/api/api-company.service';
import { stringifyDate } from '@/app/helpers/date';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { AddNewRoomComponent } from '../../add-new-room/add-new-room.component';
import { LoaderType } from '../../loader-types';
import { EntityInfo, EntityOwnerProfile, EntityOwnerRoomInfo } from '../../models';


@Component({
  selector: 'app-room-owner-rooms-tab',
  templateUrl: './room-owner-rooms-tab.component.pug',
  styleUrls: ['./room-owner-rooms-tab.component.sass']
})
export class RoomOwnerRoomsTabComponent implements OnChanges {

  @Input() entity: EntityOwnerProfile;
  entityOwnerRoomList: EntityOwnerRoomInfo[];
  entityList: EntityInfo[];
  isLoading: Observable<boolean>;

  constructor(
    private modalService: ModalService,
    private apiCompany: ApiCompanyService,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_TAB);
    this.entityOwnerRoomList = [];
  }

  @Loading(LoaderType.LOAD_TAB)
  public async init(): Promise<void> {
    const [val1, val2] = await Promise.all([
      this.apiCompany.getEntityOwnerRoomList({eo_id: this.entity.eo_id}).toPromise(),
      this.apiCompany.getEntityList().toPromise()
    ]);
    this.entityOwnerRoomList = val1;
    this.entityList = val2;
  }

  public async addRooms(): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms('ebc.roomOwner.addRooms.text', AddNewRoomComponent, {
      primaryButtonLabel: 'ebc.buttons.add.text',
      secondaryButtonLabel: 'ebc.buttons.cancel.text'
    });
    const idList: string[] = [];
    this.entityOwnerRoomList.map( item => idList.push(item.eoe_entity_id.toString()));
    modalBody.init(this.entityList.filter(item => !idList.includes(item.e_id.toString())));
    modal.save.subscribe( async () => {
      const result: EntityInfo = await modalBody.save();
      if (result) {
        modal.close(!!result);
        this.entityOwnerRoomList.push({
          eoe_entityOwner_id: this.entity.eo_id,
          eoe_entity_id: result.e_id,
          eoe_provision: '10',
          newRecord: true
        });
      }
    });
  }

  public isHasPeriod(event: boolean, item: EntityOwnerRoomInfo): void {
    const today = dayjs().toDate();
    const untilDate = dayjs().add(10, 'day').toDate();
    if (event) {
      this.entityOwnerRoomList[this.entityOwnerRoomList.indexOf(item)].eoe_fromDate = stringifyDate(today, false);
      this.entityOwnerRoomList[this.entityOwnerRoomList.indexOf(item)].eoe_untilDate = stringifyDate(untilDate, false);
    } else {
      this.entityOwnerRoomList[this.entityOwnerRoomList.indexOf(item)].eoe_fromDate = null;
      this.entityOwnerRoomList[this.entityOwnerRoomList.indexOf(item)].eoe_untilDate = null;
    }
  }

  public fromDateChange(event, item: EntityOwnerRoomInfo): void {
    this.entityOwnerRoomList[this.entityOwnerRoomList.indexOf(item)].eoe_fromDate = stringifyDate(dayjs(event).toDate(), false);
  }

  public untilDateChange(event, item: EntityOwnerRoomInfo): void {
    this.entityOwnerRoomList[this.entityOwnerRoomList.indexOf(item)].eoe_untilDate = stringifyDate(dayjs(event).toDate(), false);
  }

  public commissionChange(event, item: EntityOwnerRoomInfo): void {
    this.entityOwnerRoomList[this.entityOwnerRoomList.indexOf(item)].eoe_provision = event;
  }

  public deleteEntity(id: string): void {
    this.entityOwnerRoomList = this.entityOwnerRoomList.filter( item => item.eoe_id !== id);
  }

  @Loading(LoaderType.LOAD_TAB)
  public async save(): Promise<void> {
    await this.apiCompany.putEntityOwnerEntity(
      this.entityOwnerRoomList,
      {eo_id: this.entity.eo_id}
    ).toPromise();
  }

  ngOnChanges({ entity }: SimpleChanges) {
    if ( entity ) {
      this.init();
    }
  }

}
