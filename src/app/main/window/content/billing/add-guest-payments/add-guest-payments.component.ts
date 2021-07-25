import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { LoaderService } from '@/app/shared/loader.service';
import { TabsSettings } from '@/ui-kit/components/tabs/tabs.models';
import { LoaderType } from './loader-types';

@Component({
  selector: 'app-add-guest-payments',
  templateUrl: './add-guest-payments.component.pug',
  styleUrls: ['./add-guest-payments.component.sass']
})
export class AddGuestPaymentsComponent implements OnInit {

  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'payments',
        label: 'ebc.guestPayment.guestPayment.text',
      },
      {
        id: 'cash_register',
        label: 'ebc.guestPayment.cashRegister.text',
      }
    ],
    buttonClasses: ['nav-link'],
  };
  public activeTabId = 'payments';

  public isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  ngOnInit(): void {}

}
