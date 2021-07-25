import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { PaymentMethodModel } from './models';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.pug',
  styleUrls: ['./payment.component.sass']
})
export class PaymentComponent implements OnInit {

  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'general',
        label: 'ebc.payment.General.text',
      },
      {
        id: 'bank',
        label: 'ebc.payment.Banktransfer.text',
        hidden: true,
      },
      {
        id: 'creditCard',
        label: 'ebc.payment.CreditCard.text',
        hidden: true,
      },
      {
        id: 'paypal',
        label: 'ebc.payment.editFormPPTitle.text',
        hidden: true,
      },
      {
        id: 'sofort',
        label: 'ebc.payment.editFormSofortTitle.text',
        hidden: true,
      },
      {
        id: 'additional',
        label: 'ebc.payment.customPaymentTypes.text',
        hidden: true,
      },
      {
        id: 'hobex',
        label: 'Hobex',
        hidden: true
      }
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'general';
  public selected: string;
  public paymentMethods: PaymentMethodModel[];
  public hobexActive = false;

  public isLoading: Observable<boolean>;

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    this.paymentMethods = await this.apiPayment.getPaymentMethodModel().toPromise();
    const hobexMethod = this.paymentMethods.find( item => item.pm_name === 'Hobex');
    this.hobexActive = (!!hobexMethod && hobexMethod.pm_active === 'on');
    this.setupTabsVisibility();
  }

  private setupTabsVisibility(): void {
    const visibleTabs = this.tabSettings.buttons.filter(button => ['bank', 'paypal', 'additional'].includes(button.id));
    visibleTabs.map(tab => tab.hidden = false);
    const tabsHiddenIfHobexIsActive = this.tabSettings.buttons.filter(button => ['creditCard', 'sofort'].includes(button.id));
    tabsHiddenIfHobexIsActive.forEach(tab => tab.hidden = this.hobexActive);
    const tabsVisibleIfHobexIsActive = this.tabSettings.buttons.filter(button => ['hobex'].includes(button.id));
    tabsVisibleIfHobexIsActive.forEach(tab => tab.hidden = !this.hobexActive);
  }

  ngOnInit(): void {
    this.init();
  }

  // ngOnDestroy(): void {
  //   sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
  // }
}
