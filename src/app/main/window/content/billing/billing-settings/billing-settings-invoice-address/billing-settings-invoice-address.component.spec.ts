import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSettingsInvoiceAddressComponent } from './billing-settings-invoice-address.component';

describe('BillingSettingsInvoiceAddressComponent', () => {
  let component: BillingSettingsInvoiceAddressComponent;
  let fixture: ComponentFixture<BillingSettingsInvoiceAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSettingsInvoiceAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSettingsInvoiceAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
