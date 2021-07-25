import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-enquiry-pool-stats-amount-box',
  templateUrl: './enquiry-pool-stats-amount-box.component.pug',
  styleUrls: ['./enquiry-pool-stats-amount-box.component.sass']
})
export class EnquiryPoolStatsAmountBoxComponent implements OnInit {

  @Input() titleName: string;
  @Input() sourceStr: string;
  @Input() countOfAnsweredEnquiries: number;
  @Input() pillAmount: number;
  @Input() imgSource: string;
  @Input() imgAlt: string;
  @Input() isPill: boolean;
  @Input() isGrey: boolean;
  @Input() isPercentage: boolean;
  @Input() symbolStr: string;

  constructor() { }

  ngOnInit() { }

}
