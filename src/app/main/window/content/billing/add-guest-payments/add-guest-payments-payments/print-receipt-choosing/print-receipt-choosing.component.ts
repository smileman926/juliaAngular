
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '@/app/auth/auth.service';
import { getUrl, redirectWithPOST } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { LoaderType } from '../../loader-types';



@Component({
  selector: 'app-print-receipt-choosing',
  templateUrl: './print-receipt-choosing.component.pug',
  styleUrls: ['./print-receipt-choosing.component.sass']
})
export class PrintReceiptChoosingComponent implements OnInit {

  rcId: number;
  public isLoading: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  public init(id: number): void {
    this.rcId = id;
  }

  @Loading(LoaderType.LOAD_PRINT)
  public async printReceipt(type: string): Promise<void> {
    const { customerId } = this.authService.getQueryParams();
    const url = '/wo/Services/com/eBook/billing/receiptPrinting.php?cid=' + customerId +
      '&rc_id=' + this.rcId +
      '&access_token=' + environment.token +
      '&paperFormat=' + type;
    redirectWithPOST(
      getUrl(url),
      {}
    );
  }

  ngOnInit() {
  }

}
