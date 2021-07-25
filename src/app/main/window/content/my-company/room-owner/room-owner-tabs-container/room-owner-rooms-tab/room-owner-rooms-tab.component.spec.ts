import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomOwnerRoomsTabComponent } from './room-owner-rooms-tab.component';

describe('RoomOwnerRoomsTabComponent', () => {
  let component: RoomOwnerRoomsTabComponent;
  let fixture: ComponentFixture<RoomOwnerRoomsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomOwnerRoomsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomOwnerRoomsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
