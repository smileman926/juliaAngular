import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalAatPicturesComponent } from './portal-aat-pictures.component';

describe('PortalAatPicturesComponent', () => {
  let component: PortalAatPicturesComponent;
  let fixture: ComponentFixture<PortalAatPicturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalAatPicturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalAatPicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
