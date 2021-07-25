import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSofortComponent } from './payment-sofort.component';

describe('PaymentSofortComponent', () => {
  let component: PaymentSofortComponent;
  let fixture: ComponentFixture<PaymentSofortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSofortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSofortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
