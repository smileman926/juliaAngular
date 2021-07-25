import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationGeneralComponent } from './operation-general.component';

describe('OperationGeneralComponent', () => {
  let component: OperationGeneralComponent;
  let fixture: ComponentFixture<OperationGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
