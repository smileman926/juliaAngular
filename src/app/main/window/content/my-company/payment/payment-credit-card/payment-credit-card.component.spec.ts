import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCreditCardComponent } from './payment-credit-card.component';

describe('PaymentCreditCardComponent', () => {
  let component: PaymentCreditCardComponent;
  let fixture: ComponentFixture<PaymentCreditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCreditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
