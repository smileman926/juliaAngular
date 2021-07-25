import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBankTransferComponent } from './payment-bank-transfer.component';

describe('PaymentBankTransferComponent', () => {
  let component: PaymentBankTransferComponent;
  let fixture: ComponentFixture<PaymentBankTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentBankTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBankTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
