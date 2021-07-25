import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSelectionAdministrationConfigComponent } from './room-selection-administration-config.component';

describe('RoomSelectionAdministrationConfigComponent', () => {
  let component: RoomSelectionAdministrationConfigComponent;
  let fixture: ComponentFixture<RoomSelectionAdministrationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSelectionAdministrationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSelectionAdministrationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
