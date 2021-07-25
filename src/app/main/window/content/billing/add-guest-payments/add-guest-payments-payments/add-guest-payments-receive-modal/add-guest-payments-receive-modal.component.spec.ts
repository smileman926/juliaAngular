import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestPaymentsReceiveModalComponent } from './add-guest-payments-receive-modal.component';

describe('AddGuestPaymentsReceiveModalComponent', () => {
  let component: AddGuestPaymentsReceiveModalComponent;
  let fixture: ComponentFixture<AddGuestPaymentsReceiveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGuestPaymentsReceiveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuestPaymentsReceiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
