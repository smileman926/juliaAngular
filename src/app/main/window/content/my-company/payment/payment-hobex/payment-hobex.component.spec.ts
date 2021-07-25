import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHobexComponent } from './payment-hobex.component';

describe('PaymentHobexComponent', () => {
  let component: PaymentHobexComponent;
  let fixture: ComponentFixture<PaymentHobexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHobexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHobexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
