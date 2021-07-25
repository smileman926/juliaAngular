import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillingTaxComponent } from './add-billing-tax.component';

describe('AddBillingTaxComponent', () => {
  let component: AddBillingTaxComponent;
  let fixture: ComponentFixture<AddBillingTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBillingTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBillingTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
