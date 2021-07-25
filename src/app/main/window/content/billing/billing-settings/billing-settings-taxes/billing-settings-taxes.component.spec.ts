import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSettingsTaxesComponent } from './billing-settings-taxes.component';

describe('BillingSettingsTaxesComponent', () => {
  let component: BillingSettingsTaxesComponent;
  let fixture: ComponentFixture<BillingSettingsTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSettingsTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSettingsTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
