import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSelectionAdministrationSettingsComponent } from './room-selection-administration-settings.component';

describe('RoomSelectionAdministrationSettingsComponent', () => {
  let component: RoomSelectionAdministrationSettingsComponent;
  let fixture: ComponentFixture<RoomSelectionAdministrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSelectionAdministrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSelectionAdministrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
