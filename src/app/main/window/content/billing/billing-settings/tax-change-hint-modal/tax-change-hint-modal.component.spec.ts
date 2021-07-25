import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxChangeHintModalComponent } from './tax-change-hint-modal.component';

describe('TaxChangeHintModalComponent', () => {
  let component: TaxChangeHintModalComponent;
  let fixture: ComponentFixture<TaxChangeHintModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxChangeHintModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxChangeHintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
