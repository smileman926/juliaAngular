import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestPaymentsCashRegisterComponent } from './add-guest-payments-cash-register.component';

describe('AddGuestPaymentsCashRegisterComponent', () => {
  let component: AddGuestPaymentsCashRegisterComponent;
  let fixture: ComponentFixture<AddGuestPaymentsCashRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGuestPaymentsCashRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuestPaymentsCashRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
