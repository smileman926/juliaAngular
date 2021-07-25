import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';

import { LoaderType } from '../loader-types';
import { BookingTextTranslateInitValueModel, BookingTextTranslateModel } from '../model';
import { BookingTextTranslateComponent } from './translate-text/translate-text.component';


@Component({
  selector: 'app-booking-tools-texts',
  templateUrl: './booking-tools-texts.component.pug',
  styleUrls: ['./booking-tools-texts.component.sass']
})
export class BookingToolsTextsComponent implements OnInit {

  public textTypes: BookingTextTranslateInitValueModel[];
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
    this.bookingTextTranslations.map( item => {
      switch (item.fer_name) {
        case 'FrontendRoomSingular':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontendRoomSingular.text',
            pureType: 'FrontendRoomSingular',
            value: item.fetl_text
          });
          break;
        case 'FrontendRoomPlural':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_FrontendRoomPlural.text',
            pureType: 'FrontendRoomPlural',
            value: item.fetl_text
          });
          break;
        case 'EnquiryTitle':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_EnquiryTitle.text',
            pureType: 'EnquiryTitle',
            value: item.fetl_text
          });
          break;
        case 'ReservationTitle':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_ReservationTitle.text',
            pureType: 'ReservationTitle',
            value: item.fetl_text
          });
          break;
        case 'BookingTitle':
          this.textTypes.push({
            id: Number(item.fer_id),
            type: 'ebc.bookingTools.Message_BookingTitle.text',
            pureType: 'BookingTitle',
            value: item.fetl_text
          });
          break;
        default:
          break;
      }
    });
  }

  public async changeTranslate(type: string) {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.translateTitle.text', BookingTextTranslateComponent, {
      primaryButtonLabel: 'ebc.buttons.save.text',
      ngbOptions: {
        size: 'lg'
      }
    });
    switch (type) {
      case 'FrontendRoomSingular':
        modalBody.init('FrontendRoomSingular');
        break;
      case 'FrontendRoomPlural':
        modalBody.init('FrontendRoomPlural');
        break;
      case 'EnquiryTitle':
        modalBody.init('EnquiryTitle');
        break;
      case 'ReservationTitle':
        modalBody.init('ReservationTitle');
        break;
      case 'BookingTitle':
        modalBody.init('BookingTitle');
        break;
      default:
        break;
    }
    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      this.textTypes.filter(item => item.pureType === result.type)[0].value = result.initVal;
      modal.close(!!result.res);
    });
  }

  ngOnInit(): void {
    this.init();
  }
}
