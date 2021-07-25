import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSettingsCashRegisterComponent } from './billing-settings-cash-register.component';

describe('BillingSettingsCashRegisterComponent', () => {
  let component: BillingSettingsCashRegisterComponent;
  let fixture: ComponentFixture<BillingSettingsCashRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSettingsCashRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSettingsCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
