import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsGapfilterComponent } from './booking-tools-gapfilter.component';

describe('BookingToolsGapfilterComponent', () => {
  let component: BookingToolsGapfilterComponent;
  let fixture: ComponentFixture<BookingToolsGapfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsGapfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsGapfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
