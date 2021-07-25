import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DeviceDetectorService } from 'ngx-device-detector';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { GlobalLoaderTypes } from '@/app/shared/loader-types';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { ContractRenewalService } from '@/ui-kit/components/modals/contract-renewal/contract-renewal.service';
import { GDPRAgreementComponent } from '@/ui-kit/components/modals/gdpr-agreement/gdpr-agreement.component';
import { GDPRAgreementModalStatus } from '@/ui-kit/components/modals/gdpr-agreement/gdpr-agreement.model';
import { ModalDirectConnectComponent } from '@/ui-kit/components/modals/modal-direct-connect/modal-direct-connect.component';
import { ModalIbeComponent } from '@/ui-kit/components/modals/modal-ibe/modal-ibe.component';
import { SaraComponent } from '@/ui-kit/components/modals/sara/sara.component';
import { SugarDataNagscreenComponent } from '@/ui-kit/components/modals/sugar-data-nagscreen/sugar-data-nagscreen.component';
import { UpsellingModalService } from '@/ui-kit/components/modals/upselling-modal/upselling-modal.service';
import { FormatService } from '@/ui-kit/services/format.service';
import { ModalOptions, ModalService } from '@/ui-kit/services/modal.service';
import { User } from '../auth/models';
import { UserService } from '../auth/user.service';
import { ApiAuthService } from '../helpers/api/api-auth.service';
import { CacheService } from '../helpers/cache.service';
import { LogBackendService } from '../helpers/log-backend.service';
import { AppVersion } from '../helpers/models';
import { PeriodicCheckService } from '../helpers/periodic-check.service';
import { LanguageService } from '../i18n/language.service';
import { ViewService } from '../main/view/view.service';
import { CompanyDetails } from './models';

import { ModalInvoiceNoticeComponent } from '@/ui-kit/components/modals/modal-invoice-notice/modal-invoice-notice.component';
import { InvoiceStatus } from '@/ui-kit/components/modals/modal-invoice-notice/models';

@Injectable({
  providedIn: 'root'
})
export class MainService implements OnDestroy {
  private company: BehaviorSubject<CompanyDetails | null> = new BehaviorSubject(
    null
  );
  private hashFragment: string;
  public company$: Observable<CompanyDetails | null> = this.company.asObservable();
  public isAdmin$: Observable<boolean> = this.company.asObservable().pipe(
    untilDestroyed(this),
    map((companyDetails) =>
      companyDetails ? companyDetails.au_isAdmin === 'on' : false
    ),
    distinctUntilChanged()
  );

  currentVersion: AppVersion | undefined;
  messageCenterCount: number | undefined;

  constructor(
    private cacheService: CacheService,
    private languageService: LanguageService,
    private logBackendService: LogBackendService,
    private userService: UserService,
    private periodicCheckService: PeriodicCheckService,
    private modalService: ModalService,
    private viewService: ViewService,
    private contractRenewalService: ContractRenewalService,
    private upsellingModalService: UpsellingModalService,
    private apiAuthService: ApiAuthService,
    private formatService: FormatService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private deviceDetectService: DeviceDetectorService,
  ) {
    this.init().then(() => {
      this.activatedRoute.fragment.pipe(untilDestroyed(this)).subscribe((fragment: string) => {
        this.hashFragment = fragment;
        if (this.company.value) {
          this.managingDialogues();
        }
      });
    });
  }

  private detectDevice(): void {
    document.body.classList.add('os-' + (this.deviceDetectService.os).toLowerCase());
  }

  private async showGDPRAgreementModal(): Promise<void> {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' &&  this.hashFragment && this.hashFragment === 'GDPR-agreement-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.c_gdprAvAccepted === 'off')
      ) {
        allowed = true;
      }
      if (allowed) {
        const letsGo = await this.modalService.openConfirm(
          'modal.gdprAgreementFirstScreenTitle.text',
          'modal.gdprAgreementFirstScreenBody.text',
          {
            primaryButtonLabel: 'BackEnd_WikiLanguage.letsGo',
            textBodyIsHTML: true,
            primaryButtonColor: 'btn-success',
            hideSecondaryButton: true,
            skipJulia: false,
          }
        );
        if (letsGo) {
          const options: ModalOptions = {
            skipJulia: true,
            hideHeader: true,
            textBodyIsHTML: true,
            disableClose: true,
            scrollable: true,
            primaryButtonColor: 'btn-success',
            primaryButtonIcon: 'mdi-chevron-right',
            primaryButtonIconPosition: 'right',
            extraButtonLabel: 'general.back.text',
            extraButtonColor: 'btn-secondary',
            extraButtonIcon: 'mdi-chevron-left',
            extraButtonIconPosition: 'left',
            extraButton: true,
            checkboxForPrimaryButton: true,
            checkboxForPrimaryButtonLabel:
              'modal.gdprAgreementSecondScreenCheckbox.text',
            primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Next',
            savePopOverTitle: 'specialOffer.saveButtonPopOverTitle.text',
            ngbOptions: {
              size: 'xl',
            },
          };
          const modalData = this.modalService.openForms(
            '',
            GDPRAgreementComponent,
            options
          );
          modalData.modalBody.init(this.company.getValue()).catch();
          // modal events
          modalData.modal.save.subscribe((isBackButtonClicked) => {
            let newModalStatus: GDPRAgreementModalStatus | undefined;
            if (isBackButtonClicked) {
              if (
                modalData.modalBody.modalStatus ===
                GDPRAgreementModalStatus.Contract
              ) {
                modalData.modal.close(false);
                this.showGDPRAgreementModal().catch();
              }
              if (
                modalData.modalBody.modalStatus ===
                GDPRAgreementModalStatus.FinalStep
              ) {
                newModalStatus = GDPRAgreementModalStatus.Contract;
                modalData.modal.buttonSaveLabel =
                  'BackEnd_WikiLanguage.generic_Next';
                modalData.modal.hideCheckboxForPrimaryButton = false;
                modalData.modal.formStatus = true;
              }
            } else {
              //////////////////////////////
              // Show 3rd screen
              if (
                modalData.modalBody.modalStatus ===
                GDPRAgreementModalStatus.Contract
              ) {
                newModalStatus = GDPRAgreementModalStatus.FinalStep;
                modalData.modal.buttonSaveLabel =
                  'BackEnd_WikiLanguage.agreeAndContinue';
                modalData.modal.hideCheckboxForPrimaryButton = true;
                modalData.modal.formStatus = modalData.modalBody.newsletter === true;
              }
              if (
                modalData.modalBody.modalStatus ===
                GDPRAgreementModalStatus.FinalStep
              ) {
                // primary button is clicked
                modalData.modal.isSaveProcessing = true;
                modalData.modalBody.saveContract().then(() => {
                  modalData.modal.close(true);
                });
              }
            }
            if (
              Object.values(GDPRAgreementModalStatus).includes(newModalStatus) &&
              newModalStatus !== undefined
            ) {
              modalData.modalBody.modalStatus = newModalStatus;
            }
          });
          modalData.result.catch();
        }
      }
    }
  }

  @Loading(GlobalLoaderTypes.CompanySettings)
  public async updateCompanyDetails(skipUserUpdate?: boolean): Promise<void> {
    const data = await this.cacheService.getCompanyDetails(true);
    await this.languageService.setLanguage(+data.c_beLocale_id);
    this.company.next(data);
    if (!skipUserUpdate) {
      await this.setUser();
    }
  }

  /**
   * @deprecated Use {@link CacheService.getCompanyDetails}
   */
  public getCompanyDetails(): CompanyDetails {
    return this.cacheService.getCompanyDetailsSnapshot(); // TODO
  }

  /**
   * if activated shows the formatted loginMessage
   * in the backend after login is completed,
   */
  public showLoginMessageDialog(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' &&  this.hashFragment && this.hashFragment === 'login-message-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.c_loginMessageActive === 'on')
      ) {
        allowed = true;
      }
      if (allowed) {
        this.modalService.openSimpleText(
          this.company.value.c_loginMessageTitle,
          this.company.value.c_loginMessage,
          {
            closeLabel: 'BackEnd_WikiLanguage.generic_Ok',
            textBodyIsHTML: true,
          }
        );
      }
    }
  }

  /**
   * if activated shows the contract renewal dialog
   * in the backend after login is completed
   */
  public showContractRenewalDialog(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' &&  this.hashFragment && this.hashFragment === 'contract-renewal-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.showSugarContractRenewalDialog === 'on')
      ) {
        allowed = true;
      }
      if (allowed) {
        this.contractRenewalService.openContactRenewal().catch();
      }
    }
  }

  /**
   * if activated shows the UAB upselling dialog
   * in the backend after login is completed
   */
  public showUabUpsellingDialog(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && this.hashFragment === 'uab-upselling-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.c_uabModal)
      ) {
        allowed = true;
      }
      if (allowed) {
        this.upsellingModalService.openUabUpsellingModal();
      }
    }
  }

  public showFiskaltrustUpsellingDialog(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && this.hashFragment === 'fiskaltrust-upselling-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.c_fiskalTrustUpsellingModal)
      ) {
        allowed = true;
      }
      if (allowed) {
        this.upsellingModalService.openFiskaltrustUpsellingDialog();
      }
    }
  }

  public showInvoiceNoticeDialog(): void {
    const data = this.getCompanyDetails();
    let allowed = false;
    if (this.company.value && data && data.invoiceStatus) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && (
          this.hashFragment === 'invoice-notice-reminder-sent-dialog' ||
          this.hashFragment === 'invoice-notice-mahnung-sent-dialog' ||
          this.hashFragment === 'invoice-notice-inkasso-dialog' ||
          this.hashFragment === 'invoice-notice-lawsuit-dialog')) ||
        (this.company.value.au_isAdmin === 'off' && data.showInvoiceDialog === 'on')
      ) {
        allowed = true;
      }
      if (allowed) {
        const modal = this.modalService.openBorderless(
          ModalInvoiceNoticeComponent,
          {
            disableClose: true,
            classes: ['invoice-notice-dialog'],
            ngbOptions: {
              backdropClass: 'invoice-notice-backdrop'
            }
          }
        );
        let invoiceStatus = data.invoiceStatus;
        let closeAfterXSeconds = data.closeAfterXSeconds;
        let showAgainAfterXSeconds = data.showAgainAfterXSeconds;
        /////////////////////////////////////////////////////////////////////////
        // the following test values are copied from AppClass.php of com project
        if (this.company.value.au_isAdmin === 'on' && this.hashFragment) {
          if (this.hashFragment === 'invoice-notice-reminder-sent-dialog') {
            invoiceStatus = InvoiceStatus.REMINDERSENT;
            closeAfterXSeconds = 5;
            showAgainAfterXSeconds = 0;
          }
          if (this.hashFragment === 'invoice-notice-mahnung-sent-dialog') {
            invoiceStatus = InvoiceStatus.MAHNUNGSENT;
            closeAfterXSeconds = 30;
            showAgainAfterXSeconds = 300;
          }
          if (this.hashFragment === 'invoice-notice-inkasso-dialog') {
            invoiceStatus = InvoiceStatus.INKASSO;
            closeAfterXSeconds = 30;
            showAgainAfterXSeconds = 0;
          }
          if (this.hashFragment === 'invoice-notice-lawsuit-dialog') {
            invoiceStatus = InvoiceStatus.LAWSUIT;
            closeAfterXSeconds = 0;
            showAgainAfterXSeconds = 0;
          }
        }
        if (invoiceStatus === InvoiceStatus.LAWSUIT && this.company.value.au_isAdmin !== 'on') {
          modal.modalBody.hideCloseButton = true;
        }
        modal.modalBody.init(invoiceStatus, closeAfterXSeconds);
        modal.modalBody.cancel.subscribe(() => {
          modal.modal.close(true);
          if (showAgainAfterXSeconds > 0) {
            window.setTimeout(() => {
              this.showInvoiceNoticeDialog();
            }, showAgainAfterXSeconds * 1000);
          }
        });
      }
    }
  }

  public showSugarDataNagscreen(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && this.hashFragment === 'sugar-data-nag-screen-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.showSugarDataNagScreen === 'on')
      ) {
        allowed = true;
      }
      if (allowed) {
        const modal = this.modalService.openBorderless(
          SugarDataNagscreenComponent,
          { disableClose: true, ngbOptions: {size: 'lg'} }
        );

        modal.modalBody.saved.subscribe(() => {
          modal.modalBody.disableClose = false;
        });
      }
    }
  }

  public showSaraCallToAction(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && this.hashFragment === 'sara-call-to-action-dialog') ||
        (this.company.value.au_isAdmin === 'off' &&
          this.company.value.ss_newDesignReservation === '0' &&
          this.company.value.ss_hideCalltoActionModal === '0'
        )
      ) {
        allowed = true;
      }
      if (allowed) {
        window.setTimeout(() => {
          const modal = this.modalService.openBorderless(
            SaraComponent, {
              disableClose: true,
            });
        }, 180000);
      }
    }
  }

  private showDirectConnectModal(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && this.hashFragment === 'direct-connect-dialog') ||
        (this.company.value.au_isAdmin === 'off' &&
          this.company.value.isHybridCustomer === 'off' &&
          this.company.value.showCMDirectConnectSellingModal === 'on'
        )
      ) {
        allowed = true;
      }
      if (allowed) {
        this.modalService.openBorderless(ModalDirectConnectComponent, {disableClose: true, ngbOptions: {size: 'lg'}});
      }
    }
  }

  private showIBEPopup(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && this.hashFragment === 'IBE-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.showIBEPopup === 'on')
      ) {
        allowed = true;
      }
      if (allowed) {
        this.modalService.openBorderless(ModalIbeComponent, {disableClose: true, ngbOptions: {size: 'lg'}});
      }
    }
  }

  private showPciNagscreenModal(): void {
    let allowed = false;
    if (this.company.value) {
      if (
        (this.company.value.au_isAdmin === 'on' && this.hashFragment && this.hashFragment === 'pci-nag-screen-dialog') ||
        (this.company.value.au_isAdmin === 'off' && this.company.value.showPCINagScreen === 'on')
      ) {
        allowed = true;
      }
      if (allowed) {
        this.viewService.openViewById('pciNagscreen');
      }
    }
  }

  private async init(): Promise<void> {
    this.currentVersion = await this.periodicCheckService.init();
    this.listenToCompanyChanges();
    this.listenToLogin();
    this.listenToNewMessages();
    this.detectDevice();
  }

  private listenToNewMessages(): void {
    this.periodicCheckService.messageCenterCount$
      .pipe(untilDestroyed(this))
      .subscribe(async (messageCount) => {
        this.messageCenterCount = messageCount;
      });
  }

  private listenToLogin(): void {
    this.userService.loggedIn$.pipe(
      untilDestroyed(this)
    ).subscribe(async loggedIn => {
      if (loggedIn) {
        await this.updateCompanyDetails();
        await this.logBackendService.init();
        if (this.hashFragment && this.hashFragment.match(/^window-/)) {
          const startupWindowId = this.hashFragment.replace(/^window-/, '');
          this.viewService.openViewById(startupWindowId);
        } else if (environment.startupWindow && environment.startupWindow !== '') {
          this.viewService.openViewWithProperties(environment.startupWindow, environment.startupWindowParameters);
        }
        this.managingDialogues();
      }
    });
  }

  private managingDialogues(): void {
    this.showLoginMessageDialog();
    this.showContractRenewalDialog();
    this.showUabUpsellingDialog();
    this.showFiskaltrustUpsellingDialog();
    this.showGDPRAgreementModal().catch();
    this.showInvoiceNoticeDialog();
    this.showSaraCallToAction();
    this.showDirectConnectModal();
    this.showPciNagscreenModal();
    this.showSugarDataNagscreen();
    this.showIBEPopup();
  }

  private listenToCompanyChanges(): void {
    this.company$.pipe(untilDestroyed(this)).subscribe(companySettings => {
      if (companySettings) {
        this.formatService.setCurrency(+companySettings.c_currency_id, '', companySettings.currencySymbol);
      }
    });
  }

  private async setUser(): Promise<void> {
    const companyDetails = this.company.getValue();
    if (!companyDetails) {
      return;
    }
    const user: User = {
      username: companyDetails.username,
      database: companyDetails.dbName,
      hotelName: companyDetails.c_name,
      databases: this.userService.databases,
    };
    // const userData = await this.apiAuthService.checkAuth('info').toPromise();
    // if (userData && userData.databases) {
    //   user.databases = userData.databases.map(customer => reduceRawCustomer(customer));
    // }
    this.userService.setUser(user);
  }

  ngOnDestroy(): void {}
}
