import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSelectionAdministrationComponent } from './room-selection-administration.component';

describe('RoomSelectionAdministrationComponent', () => {
  let component: RoomSelectionAdministrationComponent;
  let fixture: ComponentFixture<RoomSelectionAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSelectionAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSelectionAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
