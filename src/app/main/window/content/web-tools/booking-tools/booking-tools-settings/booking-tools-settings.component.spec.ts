import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolsSettingsComponent } from './booking-tools-settings.component';

describe('BookingToolsSettingsComponent', () => {
  let component: BookingToolsSettingsComponent;
  let fixture: ComponentFixture<BookingToolsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingToolsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingToolsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
