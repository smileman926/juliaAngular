import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishRoomComponent } from './wish-room.component';

describe('WishRoomComponent', () => {
  let component: WishRoomComponent;
  let fixture: ComponentFixture<WishRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
