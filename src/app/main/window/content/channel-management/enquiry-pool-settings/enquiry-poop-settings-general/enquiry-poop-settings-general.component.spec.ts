import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryPoopSettingsGeneralComponent } from './enquiry-poop-settings-general.component';

describe('EnquiryPoopSettingsGeneralComponent', () => {
  let component: EnquiryPoopSettingsGeneralComponent;
  let fixture: ComponentFixture<EnquiryPoopSettingsGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryPoopSettingsGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryPoopSettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
