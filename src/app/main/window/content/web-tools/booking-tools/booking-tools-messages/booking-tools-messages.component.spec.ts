import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsMessagesComponent } from './booking-tools-messages.component';

describe('BookingToolsMessagesComponent', () => {
  let component: BookingToolsMessagesComponent;
  let fixture: ComponentFixture<BookingToolsMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
