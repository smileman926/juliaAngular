import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsSaraComponent } from './booking-tools-sara.component';

describe('BookingToolsSaraComponent', () => {
  let component: BookingToolsSaraComponent;
  let fixture: ComponentFixture<BookingToolsSaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsSaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsSaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
