import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPeriodsModalComponent } from './tax-periods-modal.component';

describe('TaxPeriodsModalComponent', () => {
  let component: TaxPeriodsModalComponent;
  let fixture: ComponentFixture<TaxPeriodsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxPeriodsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPeriodsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
