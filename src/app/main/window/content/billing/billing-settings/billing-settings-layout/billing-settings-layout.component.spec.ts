import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSettingsLayoutComponent } from './billing-settings-layout.component';

describe('BillingSettingsLayoutComponent', () => {
  let component: BillingSettingsLayoutComponent;
  let fixture: ComponentFixture<BillingSettingsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSettingsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSettingsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
