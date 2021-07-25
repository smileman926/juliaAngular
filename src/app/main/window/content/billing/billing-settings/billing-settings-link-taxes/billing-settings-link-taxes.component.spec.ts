import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSettingsLinkTaxesComponent } from './billing-settings-link-taxes.component';

describe('BillingSettingsLinkTaxesComponent', () => {
  let component: BillingSettingsLinkTaxesComponent;
  let fixture: ComponentFixture<BillingSettingsLinkTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSettingsLinkTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSettingsLinkTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
