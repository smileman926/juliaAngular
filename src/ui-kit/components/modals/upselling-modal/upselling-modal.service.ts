import { ApiSupportFormService } from '@/app/helpers/api/api-support-form.service';
import { ViewService } from '@/app/main/view/view.service';
import { openSupportForm } from '@/app/main/window/content/my-eb/support-form-new/open-support-form';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalGenericComponent } from '@/ui-kit/components/modal-generic/modal-generic.component';
import {
  UpsellingModalButtonAction,
  UpsellingModalButtonDataChange,
  UpsellingModalData,
  UpsellingModalOptions,
  UpsellingModalSaveData,
  UpsellingModalStaticData,
  UpsellingModalStructure
} from '@/ui-kit/components/modals/upselling-modal/models';
import { mergeAndUniqueArrays } from '@/ui-kit/utils/static.functions';
import { Injectable, OnDestroy, Type } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ModalService } from '@/ui-kit/services/modal.service';
import {
  UpsellingModalComponent,
  upsellingModalLoadingIdentifier
} from '@/ui-kit/components/modals/upselling-modal/upselling-modal.component';
import { UpsellingModalFooterComponent } from '@/ui-kit/components/modals/upselling-modal/upselling-modal-footer/upselling-modal-footer.component';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class UpsellingModalService implements OnDestroy {

  constructor(
    private modalService: ModalService,
    private apiSupportFormService: ApiSupportFormService,
    private viewService: ViewService,
    private loaderService: LoaderService, // Needed for @Loading
  ) { }

  openUabUpsellingModal(): void {
    this.openUpsellingModal(
      uabData,
      this.apiSupportFormService.getUpsellingData('UpsellingDataUAB'),
      'UpsellingUAB'
    ).catch();
  }

  openFiskaltrustUpsellingDialog(): void {
    this.openUpsellingModal(
      fiskaltrustData,
      this.apiSupportFormService.getUpsellingData('FiskalDEUpsellingData'),
      'fiskalDEUpselling'
    ).catch();
  }

  private async openUpsellingModal(
    staticData: UpsellingModalStaticData,
    dataRequest: Observable<UpsellingModalData>,
    sendEndpoint: string,
    options?: Partial<UpsellingModalOptions>
  ): Promise<void> {
    const modalData = await dataRequest.toPromise();

    const mergedClasses = mergeAndUniqueArrays(defaultOptions.classes, (options ? options.classes : undefined));
    const mergedOptions = Object.assign({}, defaultOptions, options);
    mergedOptions.classes = mergedClasses;

    const modal: UpsellingModalStructure = this.modalService.openGeneric(
      staticData.labels.modalTitle,
      UpsellingModalComponent,
      mergedOptions,
      UpsellingModalFooterComponent
    );
    this.setupModalEvents(modal, sendEndpoint);
    modal.modalBody.init(modalData, staticData);
    modal.modalShortcuts.init(staticData.labels, staticData.footerButtons);
  }

  private setupModalEvents(
    modal: UpsellingModalStructure,
    sendEndpoint: string
  ): void {
    modal.modalBody.formStateChange.pipe(untilDestroyed(this)).subscribe(formState => {
      modal.modalShortcuts.formState = formState;
    });
    modal.modalShortcuts.buttonPress.pipe(untilDestroyed(this)).subscribe(buttonAction => {
      this.onButtonClick(buttonAction, modal);
    });
    modal.modalShortcuts.view$ = modal.modalBody.view$;

    modal.modalBody.send.pipe(untilDestroyed(this)).subscribe(data => {
      this.sendModal(sendEndpoint, modal.modalBody, data).catch();
    });
  }

  @Loading(upsellingModalLoadingIdentifier)
  private async sendModal(
    sendEndpoint: string,
    modalBody: UpsellingModalComponent,
    modalData: UpsellingModalSaveData
  ): Promise<void> {
    await this.apiSupportFormService.sendUpsellingData(sendEndpoint, modalData).toPromise();
    modalBody.showThankYou();
  }

  private closeModal(
    modal: ModalGenericComponent,
  ): void {
    modal.activeModal.close();
  }

  @Loading(upsellingModalLoadingIdentifier)
  private async cancelModal(
    modal: ModalGenericComponent,
    dataChange?: UpsellingModalButtonDataChange
  ): Promise<void> {
    if (dataChange) {
      await this.apiSupportFormService.sendUpsellingCancelData(dataChange.fieldName, dataChange.value).toPromise();
    }
    this.closeModal(modal);
  }

  private onButtonClick(
    buttonAction: UpsellingModalButtonAction,
    modal: UpsellingModalStructure
  ): void {
    switch (buttonAction.type) {
      case 'submit':
        modal.modalBody.save().catch();
        break;
      case 'notInterested':
        this.cancelModal(modal.modal, buttonAction.dataChange).catch();
        break;
      case 'close':
        this.closeModal(modal.modal);
        break;
      case 'contactUs':
        openSupportForm(this.viewService);
        this.closeModal(modal.modal);
        break;
    }
  }

  ngOnDestroy(): void {}
}

const defaultOptions: UpsellingModalOptions = {
  hideHeaderInfoIcon: true,
  hidePrimaryButton: true,
  classes: ['upselling-modal'],
}

const uabData: UpsellingModalStaticData = {
  price: {
    perMonth: 6.25,
    oneTimeActivationFee: 50
  },
  logo: 'assets/images/uab-logo.png',
  labels: {
    modalTitle: 'BackEnd_WikiLanguage.uabUpsellingTitle',
    intro: {
      title: 'BackEnd_WikiLanguage.uabUpsellingIntroTitle',
      titleIcon: '🎉',
      text: 'BackEnd_WikiLanguage.uabUpsellingIntro',
      button: {
        label: 'BackEnd_WikiLanguage.uabUpsellingIntroButton',
        link: 'https://blog.easybooking.eu/neue-schnittstelle-zu-urlaub-am-bauernhof/'
      }
    },
    benefits: [
      'BackEnd_WikiLanguage.uabUpsellingInfoBoxList1',
      'BackEnd_WikiLanguage.uabUpsellingInfoBoxList2',
      'BackEnd_WikiLanguage.uabUpsellingInfoBoxList3',
    ],
    activation: 'BackEnd_WikiLanguage.uabUpsellingTitle',
    purchaseInfo: 'BackEnd_WikiLanguage.uabUpsellingPurchaseInfo',
    orderButton: 'BackEnd_WikiLanguage.uabUpsellingOrderButton',
    successTitle: 'BackEnd_WikiLanguage.uabUpsellingThankYouTitle',
    successNextStepsTitle: 'BackEnd_WikiLanguage.uabUpsellingThankYouNextStepsTitle',
    successNextSteps: 'BackEnd_WikiLanguage.uabUpsellingThankYouNextSteps',
  },
  footerButtons: [
    {
      label: 'BackEnd_WikiLanguage.uabUpsellingContactUs',
      primary: true,
      info: 'BackEnd_WikiLanguage.uabUpsellingQuestionAboutUab',
      action: { type: 'contactUs' }
    },
    {
      label: 'BackEnd_WikiLanguage.uabUpsellingNotInterested',
      primary: false,
      action: {
        type: 'notInterested',
        dataChange: {
          fieldName: 'uab_modal_c',
          value: 'notInterested'
        }
      }
    }
  ]
}

const fiskaltrustData: UpsellingModalStaticData = {
  price: {
    perMonth: 24,
    oneTimeActivationFee: 99
  },
  logo: 'assets/images/fiskal-logo.png',
  labels: {
    modalTitle: 'BackEnd_WikiLanguage.fiskaltrustUpsellingTitle',
    intro: {
      title: 'BackEnd_WikiLanguage.fiskaltrustUpsellingIntroTitle',
      titleIcon: '💰',
      text: 'BackEnd_WikiLanguage.fiskaltrustUpsellingIntro',
      button: {
        label: 'BackEnd_WikiLanguage.fiskaltrustUpsellingIntroButton',
        link: 'https://www.landingpage.easybooking.eu/registrierkasse'
      }
    },
    benefits: [
      'BackEnd_WikiLanguage.fiskaltrustUpsellingInfoBoxList1',
      'BackEnd_WikiLanguage.fiskaltrustUpsellingInfoBoxList2',
      'BackEnd_WikiLanguage.fiskaltrustUpsellingInfoBoxList3',
    ],
    activation: 'BackEnd_WikiLanguage.fiskaltrustUpsellingActivation',
    purchaseInfo: 'BackEnd_WikiLanguage.fiskaltrustUpsellingPurchaseInfo',
    orderButton: 'BackEnd_WikiLanguage.fiskaltrustUpsellingOrderButton',
    successTitle: 'BackEnd_WikiLanguage.fiskaltrustUpsellingThankYouTitle',
    successNextStepsTitle: 'BackEnd_WikiLanguage.fiskaltrustUpsellingThankYouNextStepsTitle',
    successNextSteps: 'BackEnd_WikiLanguage.fiskaltrustUpsellingThankYouNextSteps',
  },
  footerButtons: [
    {
      label: 'BackEnd_WikiLanguage.fiskaltrustUpsellingNotRequired',
      primary: false,
      action: {
        type: 'notInterested',
        dataChange: {
          fieldName: 'fiskal_upselling_modal_c',
          value: 'notRequired'
        }
      }
    },
    {
      label: 'BackEnd_WikiLanguage.fiskaltrustUpsellingNotInterested',
      primary: false,
      action: {
        type: 'notInterested',
        dataChange: {
          fieldName: 'fiskal_upselling_modal_c',
          value: 'notInterested'
        }
      }
    }
  ]
}
