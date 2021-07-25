import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterAddProductModalComponent } from './cash-register-add-product-modal.component';

describe('CashRegisterAddProductModalComponent', () => {
  let component: CashRegisterAddProductModalComponent;
  let fixture: ComponentFixture<CashRegisterAddProductModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterAddProductModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterAddProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
