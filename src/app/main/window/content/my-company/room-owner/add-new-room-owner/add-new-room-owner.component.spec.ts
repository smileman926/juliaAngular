import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRoomOwnerComponent } from './add-new-room-owner.component';

describe('AddNewRoomOwnerComponent', () => {
  let component: AddNewRoomOwnerComponent;
  let fixture: ComponentFixture<AddNewRoomOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewRoomOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewRoomOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
