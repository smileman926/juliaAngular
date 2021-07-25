import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAdditionalTypesComponent } from './payment-additional-types.component';

describe('PaymentAdditionalTypesComponent', () => {
  let component: PaymentAdditionalTypesComponent;
  let fixture: ComponentFixture<PaymentAdditionalTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAdditionalTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAdditionalTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
