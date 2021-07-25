import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsLayoutComponent } from './booking-tools-layout.component';

describe('BookingToolsLayoutComponent', () => {
  let component: BookingToolsLayoutComponent;
  let fixture: ComponentFixture<BookingToolsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
