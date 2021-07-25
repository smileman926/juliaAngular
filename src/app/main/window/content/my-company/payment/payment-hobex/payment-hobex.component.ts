import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ModalService } from '@/ui-kit/services/modal.service';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { CountryInfoModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { PaymentMethodCountryModel, PaymentMethodModel } from '../models';
import { SetPaymentCountryComponent } from '../set-payment-country/set-payment-country.component';

@Component({
  selector: 'app-payment-hobex',
  templateUrl: './payment-hobex.component.pug',
  styleUrls: ['./payment-hobex.component.sass']
})
export class PaymentHobexComponent implements OnInit {

  public paymentMethods: PaymentMethodModel[];
  public paymentCountryList: PaymentMethodCountryModel[];
  public countryFullInfoList: CountryInfoModel[];
  public entityID: string;
  public accessToken: string;
  public isLoading: Observable<boolean>;

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    private modalService: ModalService,
    public loaderService: LoaderService) {
      this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
      this.paymentCountryList = [];
    }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2, val3] = await Promise.all([
      this.apiPayment.getPaymentMethodModel().toPromise(),
      this.apiPayment.getPaymentMethodCountryModel({p3: 5}).toPromise(),
      this.apiPayment.getCountryInfoList().toPromise()
    ]);
    this.paymentMethods = val1;
    this.entityID = this.paymentMethods.filter(item => item.pm_name === 'Hobex')[0].pm_accountId;
    this.accessToken = this.paymentMethods.filter(item => item.pm_name === 'Hobex')[0].pm_projectPassword;

    const data = val2.sort(
      (a, b) => (Number(a.pmc_country_id) > Number(b.pmc_country_id)) ? 1
      : ((Number(b.pmc_country_id) > Number(a.pmc_country_id)) ? -1 : 0)
    );

    const map = new Map();
    for (const item of data) {
        if (!map.has(item.pmc_country_id)) {
            map.set(item.pmc_country_id, true);
            this.paymentCountryList.push({
              pmc_country_id: item.pmc_country_id,
              pmc_id: item.pmc_id,
              pmc_paymentMethod_id: item.pmc_paymentMethod_id
            });
        }
    }

    this.countryFullInfoList = val3;
  }

  public getCountryName(id: string) {
    return this.countryFullInfoList.filter(item => item.c_id === id)[0].cl_name;
  }

  public async setCountries() {
    const {modal, modalBody} = this.modalService.openForms('ebc.payment.activeCountrySettingPMCountry.text', SetPaymentCountryComponent, {
      primaryButtonLabel: 'ebc.buttons.close.text',
      disableClose: true,
      hideSecondaryButton: true,
      ngbOptions: {
        size: 'lg'
      },
    });
    modalBody.init(5);
    modal.save.subscribe( () => {
      const result = modalBody.save();
      this.paymentCountryList = result.sort(
        (a, b) => (Number(a.pmc_country_id) > Number(b.pmc_country_id)) ? 1
        : ((Number(b.pmc_country_id) > Number(a.pmc_country_id)) ? -1 : 0)
      );
      modal.close(!!result);
    });
  }

  ngOnInit(): void {
    this.init();
  }

}
