import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ApiCompanyService } from '@/app/helpers/api/api-company.service';
import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../loader-types';
import { PortalAATDataInfo } from '../model';
import { PortalConfirmSubmitComponent } from '../portal-confirm-submit/portal-confirm-submit.component';

@Component({
  selector: 'app-portal-aat-portal',
  templateUrl: './portal-aat-portal.component.pug',
  styleUrls: ['./portal-aat-portal.component.sass']
})
export class PortalAatPortalComponent implements OnInit {

  portalAATData: PortalAATDataInfo;
  isLoading: Observable<boolean>;
  currentLocale: string;
  shortDescription: string;
  showMissingToolTip: boolean;
  showMissingToolTipStr: string;
  missingDataMessages: {
    categories: {message: string, show: boolean},
    facilities: {message: string, show: boolean},
    locations: {message: string, show: boolean},
    germanText: {message: string, show: boolean},
    germanTextLength: {message: string, show: boolean},
    pictures: {message: string, show: boolean}
  };
  statusOptions: {
    not_started: {label: string, icon: string, color: string},
    in_progress: {label: string, icon: string, color: string},
    in_progress_temp: { label: string, icon: string, color: string},
    submitted: {label: string, icon: string, color: string},
    approved: {label: string, icon: string, color: string},
    denied: {label: string, icon: string, color: string},
    published: {label: string, icon: string, color: string}
  };
  currentStatus: {label: string, icon: string, color: string};
  isMouseEnter: boolean;
  isDisableSubmit: boolean;
  isDisableSave: boolean;
  isDisableAll: boolean;

  constructor(
    private apiCompany: ApiCompanyService,
    private loaderService: LoaderService,
    private mainService: MainService,
    private translateService: TranslateService,
    private modalService: ModalService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.currentLocale = this.mainService.getCompanyDetails().c_beLocale_id.toString();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.missingDataMessages = {
      categories: {message: await this.translateService.get('ebc.portalAAT.missingCategories.text').toPromise(), show: false},
      facilities: {message: await this.translateService.get('ebc.portalAAT.missingFacilities.text').toPromise(), show: false},
      locations: {message: await this.translateService.get('ebc.portalAAT.missingLocations.text').toPromise(), show: false},
      germanText: {message: await this.translateService.get('ebc.portalAAT.missingDescriptionDE.text').toPromise(), show: false},
      germanTextLength: {message: await this.translateService.get('ebc.portalAAT.descriptionTooShort.text').toPromise(), show: false},
      pictures: {message: await this.translateService.get('ebc.portalAAT.missingPictures.text').toPromise(), show: false}
    };
    this.statusOptions = {
      not_started: {
        label: await this.translateService.get('ebc.portalAAT.status_not_started.text').toPromise(),
        icon: 'mdi mdi-settings',
        color: '#ff000061'
      },
      in_progress: {
        label: await this.translateService.get('ebc.portalAAT.status_in_progress.text').toPromise(),
        icon: 'mdi mdi-settings',
        color: '#00f1007d'
      },
      in_progress_temp: {
        label: await this.translateService.get('ebc.portalAAT.status_in_progress_temp.text').toPromise(),
        icon: 'mdi mdi-alert',
        color: '#ff000061'
      },
      submitted: {
        label: await this.translateService.get('ebc.portalAAT.status_submitted.text').toPromise(),
        icon: 'mdi mdi-timer-sand',
        color: '#ff000061'
      },
      approved: {
        label: await this.translateService.get('ebc.portalAAT.status_approved.text').toPromise(),
        icon: 'mdi mdi-timer-sand',
        color: '#ff000061'
      },
      denied: {label: await this.translateService.get('ebc.portalAAT.status_denied.text').toPromise(),
      icon: 'mdi mdi-cancel',
      color: '#ff000061'
      },
      published: {label: await this.translateService.get('ebc.portalAAT.status_published.text').toPromise(),
      icon: 'mdi mdi-check-bold',
      color: '#00f1007d'
      }
    };
    this.portalAATData = await this.apiCompany.getPortalAATData().toPromise();
    this.initShortDescription();
    this.initStatusContent(this.portalAATData.customer.c_aatContentStatus !== 'not_started' ?
      this.portalAATData.customer.c_aatContentStatus : null);
    this.initSubmitValidation(this.portalAATData.customer.c_aatContentStatus !== 'not_started' ?
    this.portalAATData.customer.c_aatContentStatus : null);
  }

  initSubmitValidation(status: string | null): void {
    if ( status === 'approved' || status === 'submitted' ) {
      this.isDisableAll = true;
    }
    if ( !status || status === 'denied' || status === 'approved' || status === 'submitted') {
      this.isDisableSave = true;
      this.isDisableSubmit = true;
    } else if ( status === 'not_started' ) {
      this.isDisableSave = false;
      this.isDisableSubmit = true;
    } else {
      this.isDisableSave = false;
      this.isDisableSubmit = true;
    }
  }

  initStatusContent(status: string | null): void {
    if (status) {
      this.currentStatus = this.statusOptions[status];
    }
  }

  initShortDescription(): void {
    const currentLocaleDescObj = this.portalAATData.descriptions.find(item => item.cd_locale_id === this.currentLocale);
    this.shortDescription = currentLocaleDescObj ? currentLocaleDescObj.cd_shortDescription : '';
  }

  public changeLocale(): void {
    this.initShortDescription();
  }

  public changeShortDescription(): void {
    if (this.portalAATData.descriptions.find( item => item.cd_locale_id === this.currentLocale)) {
      this.portalAATData.descriptions.filter(
        item => item.cd_locale_id === this.currentLocale)[0].cd_shortDescription = this.shortDescription;
    }
    this.missingDataMessages.germanText.show = this.currentLocale === '2' && this.shortDescription.length < 1;
    this.initStatusContent('not_started');
    this.initSubmitValidation('not_started');
  }

  public changeItemActivity(kind: string, item: any, checked: boolean): void {
    this.portalAATData[kind][this.portalAATData[kind].indexOf(item)].active = checked;
    let isAllNoActive = true;
    this.portalAATData[kind].map( l => {
      if ( l.active ) {
        isAllNoActive = false;
      }
    });
    this.missingDataMessages[kind].show = isAllNoActive;
    this.initStatusContent('not_started');
    this.initSubmitValidation('not_started');
  }

  async initShowMissingToolTipStr(): Promise<void> {
    this.showMissingToolTip = false;
    let tooltipContent = '';
    Object.keys(this.missingDataMessages).map( type => {
      if ( this.missingDataMessages[type].show ) {
        this.showMissingToolTip = true;
        tooltipContent += '<br>' + '- ' + this.missingDataMessages[type].message;
      }
    });
    if ( this.showMissingToolTip ) {
      const tooltipHeader: string =  await this.translateService.get('ebc.portalAAT.missingDataTooltip.text').toPromise();
      this.showMissingToolTipStr = tooltipHeader + tooltipContent;
    }
  }

  mouseEnter(flag: boolean): void {
    this.isMouseEnter = flag;
    if (flag) {
      this.initShowMissingToolTipStr();
    }
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    if (this.showMissingToolTip) {
      return;
    }
    const res = await this.apiCompany.putPortalAATData({...this.portalAATData}).toPromise();
    if ( res ) {
      this.initShowMissingToolTipStr();
      const afterStatus = this.showMissingToolTip ? 'in_progress_temp' : 'in_progress';
      this.initStatusContent(afterStatus);
      this.initSubmitValidation(afterStatus);
      this.isDisableSubmit = this.showMissingToolTip;
    }
  }

  public async submit(): Promise<void> {
    const {modal, modalBody} = this.modalService.openForms('ebc.portalAAT.modal_header.text', PortalConfirmSubmitComponent, {
      primaryButtonLabel: 'ebc.buttons.submit.text',
      secondaryButtonLabel: 'ebc.buttons.cancel.text'
    });

    modal.save.subscribe( async () => {
      const result: any = await modalBody.save();
      if (result) {
        modal.close(!!result);
        this.initStatusContent('submitted');
        this.initSubmitValidation('submitted');
        this.isDisableAll = true;
      }
    });
  }

  ngOnInit(): void {
    this.init();
  }

}
