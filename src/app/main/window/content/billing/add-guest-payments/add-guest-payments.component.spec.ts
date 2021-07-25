import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestPaymentsComponent } from './add-guest-payments.component';

describe('AddGuestPaymentsComponent', () => {
  let component: AddGuestPaymentsComponent;
  let fixture: ComponentFixture<AddGuestPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGuestPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuestPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
