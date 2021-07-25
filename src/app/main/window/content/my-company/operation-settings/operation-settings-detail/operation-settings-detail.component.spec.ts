import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSettingsDetailComponent } from './operation-settings-detail.component';

describe('OperationSettingsDetailComponent', () => {
  let component: OperationSettingsDetailComponent;
  let fixture: ComponentFixture<OperationSettingsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationSettingsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSettingsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
