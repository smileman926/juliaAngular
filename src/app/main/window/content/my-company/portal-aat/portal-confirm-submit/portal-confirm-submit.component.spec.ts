import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalConfirmSubmitComponent } from './portal-confirm-submit.component';

describe('PortalConfirmSubmitComponent', () => {
  let component: PortalConfirmSubmitComponent;
  let fixture: ComponentFixture<PortalConfirmSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalConfirmSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalConfirmSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
