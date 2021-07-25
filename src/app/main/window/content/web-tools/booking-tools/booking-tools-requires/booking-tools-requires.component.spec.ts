import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsRequiresComponent } from './booking-tools-requires.component';

describe('BookingToolsRequiresComponent', () => {
  let component: BookingToolsRequiresComponent;
  let fixture: ComponentFixture<BookingToolsRequiresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsRequiresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsRequiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
