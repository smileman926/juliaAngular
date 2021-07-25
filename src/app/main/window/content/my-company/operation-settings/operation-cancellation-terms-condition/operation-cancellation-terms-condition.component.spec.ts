import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationCancellationTermsConditionComponent } from './operation-cancellation-terms-condition.component';

describe('OperationCancellationTermsConditionComponent', () => {
  let component: OperationCancellationTermsConditionComponent;
  let fixture: ComponentFixture<OperationCancellationTermsConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationCancellationTermsConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationCancellationTermsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
