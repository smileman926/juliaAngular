import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ModalService } from '@/ui-kit/services/modal.service';

import { ApiCompanyService } from '@/app/helpers/api/api-company.service';
import { CountryInfoModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { AddNewRoomOwnerComponent } from './add-new-room-owner/add-new-room-owner.component';
import { LoaderType } from './loader-types';
import { EntityOwnerProfile } from './models';

@Component({
  selector: 'app-room-owner',
  templateUrl: './room-owner.component.pug',
  styleUrls: ['./room-owner.component.sass']
})
export class RoomOwnerComponent implements OnInit {

  public isLoading: Observable<boolean>;
  public entityOwnerList: EntityOwnerProfile[];
  public selectedEntity: EntityOwnerProfile;
  public countriesList: CountryInfoModel[];

  constructor(
    private loaderService: LoaderService,
    private apiCompany: ApiCompanyService,
    private modalService: ModalService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.entityOwnerList = [];
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2] = await Promise.all([
      this.apiCompany.getEntityOwnerList().toPromise(),
      this.apiCompany.getCountryInfoList().toPromise()
    ]);
    this.entityOwnerList = val1;
    this.entityOwnerList.map( item => item.id = Number(item.eo_id));
    this.countriesList = val2.filter( item => item.c_active === 'on');
    this.selectedEntity = this.entityOwnerList[0];
  }

  public selectItem(item: EntityOwnerProfile): void {
    this.selectedEntity = item;
  }

  public async addType(): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms('ebc.roomOwner.addRoomOwner.text', AddNewRoomOwnerComponent, {
      primaryButtonLabel: 'ebc.buttons.add.text',
      secondaryButtonLabel: 'ebc.buttons.cancel.text'
    });
    modalBody.init(this.countriesList);
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      if (result) {
        modal.close(!!result);
        this.init();
      }
    });
  }

  ngOnInit(): void {
    this.init();
  }
}
