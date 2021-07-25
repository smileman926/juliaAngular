import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSelectionAdministrationPriceComponent } from './room-selection-administration-price.component';

describe('RoomSelectionAdministrationPriceComponent', () => {
  let component: RoomSelectionAdministrationPriceComponent;
  let fixture: ComponentFixture<RoomSelectionAdministrationPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomSelectionAdministrationPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSelectionAdministrationPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
