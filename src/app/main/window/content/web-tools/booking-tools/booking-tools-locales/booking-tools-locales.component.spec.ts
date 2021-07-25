import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsLocalesComponent } from './booking-tools-locales.component';

describe('BookingToolsLocalesComponent', () => {
  let component: BookingToolsLocalesComponent;
  let fixture: ComponentFixture<BookingToolsLocalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsLocalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsLocalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
