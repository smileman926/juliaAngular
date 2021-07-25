import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsPricemeterComponent } from './booking-tools-pricemeter.component';

describe('BookingToolsPricemeterComponent', () => {
  let component: BookingToolsPricemeterComponent;
  let fixture: ComponentFixture<BookingToolsPricemeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsPricemeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsPricemeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
