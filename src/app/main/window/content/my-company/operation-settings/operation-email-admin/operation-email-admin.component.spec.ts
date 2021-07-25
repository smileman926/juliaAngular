import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationEmailAdminComponent } from './operation-email-admin.component';

describe('OperationEmailAdminComponent', () => {
  let component: OperationEmailAdminComponent;
  let fixture: ComponentFixture<OperationEmailAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationEmailAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationEmailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
