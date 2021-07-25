import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSettingsInvoiceItemComponent } from './billing-settings-invoice-item.component';

describe('BillingSettingsInvoiceItemComponent', () => {
  let component: BillingSettingsInvoiceItemComponent;
  let fixture: ComponentFixture<BillingSettingsInvoiceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSettingsInvoiceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSettingsInvoiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
