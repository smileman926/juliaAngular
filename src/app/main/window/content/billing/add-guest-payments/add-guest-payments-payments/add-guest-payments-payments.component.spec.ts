import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestPaymentsPaymentsComponent } from './add-guest-payments-payments.component';

describe('AddGuestPaymentsPaymentsComponent', () => {
  let component: AddGuestPaymentsPaymentsComponent;
  let fixture: ComponentFixture<AddGuestPaymentsPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGuestPaymentsPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuestPaymentsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
