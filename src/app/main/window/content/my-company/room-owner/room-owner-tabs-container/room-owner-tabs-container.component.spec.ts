import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomOwnerTabsContainerComponent } from './room-owner-tabs-container.component';

describe('RoomOwnerTabsContainerComponent', () => {
  let component: RoomOwnerTabsContainerComponent;
  let fixture: ComponentFixture<RoomOwnerTabsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomOwnerTabsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomOwnerTabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
