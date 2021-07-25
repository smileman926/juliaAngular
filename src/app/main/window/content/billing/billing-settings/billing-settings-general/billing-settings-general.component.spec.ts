import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSettingsGeneralComponent } from './billing-settings-general.component';

describe('BillingSettingsGeneralComponent', () => {
  let component: BillingSettingsGeneralComponent;
  let fixture: ComponentFixture<BillingSettingsGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSettingsGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
