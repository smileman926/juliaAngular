import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private $billingSettingsGeneralSave: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  public onBillingSettingsGeneralSave(): void {
    this.$billingSettingsGeneralSave.next();
  }

  public getBillingSettingsGeneralSave(): Subject<boolean> {
    return this.$billingSettingsGeneralSave;
  }
}
