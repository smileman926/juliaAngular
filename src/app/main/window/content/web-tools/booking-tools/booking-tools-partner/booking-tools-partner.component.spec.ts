import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsPartnerComponent } from './booking-tools-partner.component';

describe('BookingToolsPartnerComponent', () => {
  let component: BookingToolsPartnerComponent;
  let fixture: ComponentFixture<BookingToolsPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
