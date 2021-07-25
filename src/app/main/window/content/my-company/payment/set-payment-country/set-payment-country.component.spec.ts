import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPaymentCountryComponent } from './set-payment-country.component';

describe('SetPaymentCountryComponent', () => {
  let component: SetPaymentCountryComponent;
  let fixture: ComponentFixture<SetPaymentCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPaymentCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPaymentCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
