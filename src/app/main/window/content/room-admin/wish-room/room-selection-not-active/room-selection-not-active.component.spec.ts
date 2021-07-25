import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSelectionNotActiveComponent } from './room-selection-not-active.component';

describe('RoomSelectionNotActiveComponent', () => {
  let component: RoomSelectionNotActiveComponent;
  let fixture: ComponentFixture<RoomSelectionNotActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSelectionNotActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSelectionNotActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
