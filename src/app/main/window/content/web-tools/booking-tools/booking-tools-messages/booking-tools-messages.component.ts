import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';

import { BookingTextTranslateComponent } from '../booking-tools-texts/translate-text/translate-text.component';
import { LoaderType } from '../loader-types';
import { BookingTextTranslateInitValueModel, BookingTextTranslateModel } from '../model';

@Component({
  selector: 'app-booking-tools-messages',
  templateUrl: './booking-tools-messages.component.pug',
  styleUrls: ['./booking-tools-messages.component.sass']
})
export class BookingToolsMessagesComponent implements OnInit {

  public textTypes: BookingTextTranslateInitValueModel[];
  public selectedType: BookingTextTranslateInitValueModel;
  public bookingTextTranslations: BookingTextTranslateModel[];
  public isLoading: Observable<boolean>;
  public defaultLocale: string;

  constructor(
    private apiHotel: ApiHotelService,
    public loaderService: LoaderService,
    private modalService: ModalService,
    private mainService: MainService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.textTypes = [];
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id;
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.bookingTextTranslations = await this.apiHotel.getBookingTextTranslateModel(this.defaultLocale).toPromise();

    this.selectedType = {
      id: 1,
      type: 'Enquiry Successful',
      pureType: 'FrontEndSuccessEnquiry',
      value: this.bookingTextTranslations.filter( item => item.fer_name === 'FrontEndSuccessEnquiry')[0].fetl_text
    };

    this.bookingTextTranslations.map( item => {
      switch (item.fer_name) {
        case 'FrontEndNoResult':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndNoResult.text',
            pureType: 'FrontEndNoResult',
            value: item.fetl_text
          });
          break;
        case 'FrontEndNoResultWithSisterResult':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndNoResultWithSisterResult.text',
            pureType: 'FrontEndNoResultWithSisterResult',
            value: item.fetl_text
          });
          break;
        case 'FrontEndNoResultMinStay':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndNoResultMinStay.text',
            pureType: 'FrontEndNoResultMinStay',
            value: item.fetl_text
          });
          break;
        case 'FrontEndNoResultNoPrice':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndNoResultNoPrice.text',
            pureType: 'FrontEndNoResultNoPrice',
            value: item.fetl_text
          });
          break;
        case 'FrontEndSuccessEnquiry':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndSuccessEnquiry.text',
            pureType: 'FrontEndSuccessEnquiry',
            value: item.fetl_text
          });
          break;
        case 'FrontEndFailureEnquiry':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndFailureEnquiry.text',
            pureType: 'FrontEndFailureEnquiry',
            value: item.fetl_text
          });
          break;
        case 'FrontEndSuccessReservation':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndSuccessReservation.text',
            pureType: 'FrontEndSuccessReservation',
            value: item.fetl_text
          });
          break;
        case 'FrontEndFailureReservation':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontEndFailureReservation.text',
            pureType: 'FrontEndFailureReservation',
            value: item.fetl_text
          });
          break;
        default:
          break;
      }
    });
  }

  public selectItem(item: BookingTextTranslateInitValueModel): void {
    this.selectedType = item;
  }

  public async changeTranslate(type: string) {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.translateTitle.text', BookingTextTranslateComponent, {
      primaryButtonLabel: 'ebc.buttons.save.text',
      ngbOptions: {
        size: 'lg'
      }
    });
    switch (type) {
      case 'FrontEndNoResult':
        modalBody.init('FrontEndNoResult');
        break;
      case 'FrontEndNoResultWithSisterResult':
        modalBody.init('FrontEndNoResultWithSisterResult');
        break;
      case 'FrontEndNoResultMinStay':
        modalBody.init('FrontEndNoResultMinStay');
        break;
      case 'FrontEndNoResultNoPrice':
        modalBody.init('FrontEndNoResultNoPrice');
        break;
      case 'FrontEndSuccessEnquiry':
        modalBody.init('FrontEndSuccessEnquiry');
        break;
      case 'FrontEndFailureEnquiry':
        modalBody.init('FrontEndFailureEnquiry');
        break;
      case 'FrontEndSuccessReservation':
        modalBody.init('FrontEndSuccessReservation');
        break;
      case 'FrontEndFailureReservation':
        modalBody.init('FrontEndFailureReservation');
        break;
      default:
        break;
    }
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      this.textTypes.filter(item => item.pureType === result.type)[0].value = result.initVal;
      this.selectedType.value = result.initVal;
      modal.close(!!result.res);
    });
  }

  ngOnInit(): void {
    this.init();
  }

}
