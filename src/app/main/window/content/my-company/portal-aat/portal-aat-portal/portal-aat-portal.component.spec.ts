import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalAatPortalComponent } from './portal-aat-portal.component';

describe('PortalAatPortalComponent', () => {
  let component: PortalAatPortalComponent;
  let fixture: ComponentFixture<PortalAatPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalAatPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalAatPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
