import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomOwnerDetailsTabComponent } from './room-owner-details-tab.component';

describe('RoomOwnerDetailsTabComponent', () => {
  let component: RoomOwnerDetailsTabComponent;
  let fixture: ComponentFixture<RoomOwnerDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomOwnerDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomOwnerDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
