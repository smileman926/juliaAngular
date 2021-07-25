import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsTextsComponent } from './booking-tools-texts.component';

describe('BookingToolsTextsComponent', () => {
  let component: BookingToolsTextsComponent;
  let fixture: ComponentFixture<BookingToolsTextsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsTextsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
