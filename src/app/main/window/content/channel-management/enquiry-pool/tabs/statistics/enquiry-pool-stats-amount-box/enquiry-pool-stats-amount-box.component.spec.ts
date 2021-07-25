import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryPoolStatsAmountBoxComponent } from './enquiry-pool-stats-amount-box.component';

describe('EnquiryPoolStatsAmountBoxComponent', () => {
  let component: EnquiryPoolStatsAmountBoxComponent;
  let fixture: ComponentFixture<EnquiryPoolStatsAmountBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryPoolStatsAmountBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryPoolStatsAmountBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
