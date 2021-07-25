import { ApiSupportFormService } from '@/app/helpers/api/api-support-form.service';
import { parseDate } from '@/app/helpers/date';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { DATE_FORMAT_PROVIDER, PipeDate } from '@/ui-kit/injection';
import { FormatService } from '@/ui-kit/services/format.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  UpsellingModalData,
  UpsellingModalScreenData,
  UpsellingModalPaymentMethodType,
  UpsellingModalSaveData,
  upsellingModalView,
  UpsellingModalLabels,
  UpsellingModalPrice,
  UpsellingModalStaticData,
} from './models';
import { Component, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

export const upsellingModalLoadingIdentifier = 'UPSELLING_MODAL';

@Component({
  selector: 'app-upselling-modal',
  templateUrl: './upselling-modal.component.html',
  styleUrls: ['./upselling-modal.component.sass']
})
export class UpsellingModalComponent implements OnDestroy {

  private view: BehaviorSubject<upsellingModalView> = new BehaviorSubject<upsellingModalView>('upselling');
  view$ = this.view.pipe(untilDestroyed(this));

  @Output() send: EventEmitter<UpsellingModalSaveData> = new EventEmitter();
  @Output() formStateChange = new EventEmitter<boolean>();

  form: FormGroup;
  isLoading: Observable<boolean>;
  formState: boolean;
  data: UpsellingModalData;
  modalData: UpsellingModalScreenData;
  price: UpsellingModalPrice;
  logo: string;
  labels: UpsellingModalLabels;

  UabPaymentMethodType = UpsellingModalPaymentMethodType;

  constructor(
    @Inject(DATE_FORMAT_PROVIDER) private dateFormatter: PipeDate,
    public loaderService: LoaderService,
    private formatService: FormatService,
    private apiSupportFormService: ApiSupportFormService,
  ) {
    this.isLoading = this.loaderService.isLoading(upsellingModalLoadingIdentifier);
  }

  init(
    modalData: UpsellingModalData,
    staticData: UpsellingModalStaticData
  ): void {
    this.modalData = this.setModalData(modalData, staticData);
    this.setupForm();
    this.formStateChange.emit(this.form.valid);
  }

  showThankYou(): void {
    this.view.next('thankYou');
  }

  @Loading(upsellingModalLoadingIdentifier)
  async save(): Promise<void> {
    const pm = (this.modalData._selectedPaymentMethod === UpsellingModalPaymentMethodType.SEPANew || this.modalData._selectedPaymentMethod === UpsellingModalPaymentMethodType.SEPA) ? 'sepa' : 'banktransfer';
    const postData: UpsellingModalSaveData = {
      licenseUntilDate: this.modalData.licenseUntilDate,
      aliquotLicenseCosts: this.modalData.aliquotLicenseCosts,
      pm: pm,
    };
    if (this.modalData._selectedPaymentMethod === UpsellingModalPaymentMethodType.SEPA) {
      postData['sepa'] = {
        id: this.modalData.sepaId
      }
    }
    if (this.modalData._selectedPaymentMethod === UpsellingModalPaymentMethodType.SEPANew) {
      const IBAN = (this.form.get('iban') as FormControl).value;
      const isIBANValid = await this.apiSupportFormService.sendIBANValidation(IBAN).toPromise();
      if (!isIBANValid) {
        (this.form.get('iban') as FormControl).setErrors({'incorrect': true});
        return;
      }
      postData['sepa'] = {
        iban_c: IBAN,
        account_owner_c: (this.form.get('accountOwner') as FormControl).value,
      }
    }
    this.send.emit(postData);
  }

  private selectPaymentMethod(paymentMethod: UpsellingModalPaymentMethodType) {
    this.modalData._selectedPaymentMethod = paymentMethod;
    this.setValidators();
  }

  private setValidators() {
    if (this.form) {
      if ((this.form.get('selectedPaymentMethod') as FormControl).value === UpsellingModalPaymentMethodType.SEPANew) {
        (this.form.get('accountOwner') as FormControl).setValidators([Validators.required]);
        (this.form.get('iban') as FormControl).setValidators([Validators.required]);
        (this.form.get('sepaLegalInfo') as FormControl).setValidators([Validators.requiredTrue]);
      } else {
        (this.form.get('accountOwner') as FormControl).clearValidators();
        (this.form.get('iban') as FormControl).clearValidators();
        (this.form.get('sepaLegalInfo') as FormControl).clearValidators();
      }
      (this.form.get('accountOwner') as FormControl).updateValueAndValidity();
      (this.form.get('iban') as FormControl).updateValueAndValidity();
      (this.form.get('sepaLegalInfo') as FormControl).updateValueAndValidity();
    }
  }

  private setupForm(): void {
    const selectedPaymentMethod = new FormControl(this.modalData._selectedPaymentMethod, [Validators.required]);
    const termsAccepted = new FormControl(false, [Validators.requiredTrue]);

    this.form = new FormGroup({
      selectedPaymentMethod,
      termsAccepted: termsAccepted,
      accountOwner: new FormControl(null,  []),
      iban: new FormControl(null, []),
      sepaLegalInfo: new FormControl(false, []),
    });

    this.setValidators();
    selectedPaymentMethod.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.selectPaymentMethod(value);
    });

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.formStateChange.emit(this.form.valid);
    });
  }

  private setModalData(data: UpsellingModalData, {labels, logo, price}: UpsellingModalStaticData): UpsellingModalScreenData {
    this.logo = logo;
    this.price = price;
    this.labels = labels;
    const switzerland = 'ch_123';
    const licenseUntilDate = parseDate(data.licenseUntilDate,'YYYY.MM.DD');
    const sepaDate = parseDate(data.sepaDate,'YYYY.MM.DD');
    const formattedData = {
      _licenseUntilDate: licenseUntilDate ? this.formatDate(licenseUntilDate) : '',
      _sepaDate: sepaDate ? this.formatDate(sepaDate) : '',
      _perMonth: this.formatPrice(this.price.perMonth),
      _oneTimeActivationFee: this.formatPrice(this.price.oneTimeActivationFee),
      _totalUpsellingCosts: this.formatPrice(+data.totalUpsellingCosts),
      _termsAccepted: false,
    };
    const modalData: UpsellingModalScreenData = {...data, ...formattedData};
    if (data.billingCountry === switzerland || (data.billingCountry === '' && data.shippingCountry === switzerland)) {
      modalData._selectedPaymentMethod = UpsellingModalPaymentMethodType.BankTransfer;
      modalData._disabledSepa = true;
      modalData._disabledSepaNew = true;
    } else {
      if (data.sepaId.length < 1) {
        modalData._selectedPaymentMethod = UpsellingModalPaymentMethodType.SEPANew;
        modalData._disabledSepa = true;
      } else {
        modalData._selectedPaymentMethod = UpsellingModalPaymentMethodType.SEPA;
        modalData._disabledBankTransfer = true;
      }
    }
    return modalData;
  }

  private formatPrice(amount: number): string {
    const amountStr = this.formatService.numberFormat(amount);
    return amountStr ? '€ ' + amountStr : '';
  }

  private formatDate(date: Date): string {
    return this.formatService.dateFormat(
      date,
      this.dateFormatter.getFormat()
    ) || '';
  }

  ngOnDestroy(): void {}
}
