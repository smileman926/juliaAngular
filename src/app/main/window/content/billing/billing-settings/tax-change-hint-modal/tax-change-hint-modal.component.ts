import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tax-change-hint-modal',
  templateUrl: './tax-change-hint-modal.component.pug',
  styleUrls: ['./tax-change-hint-modal.component.sass']
})
export class TaxChangeHintModalComponent implements OnInit {

  constructor() { }

  public save(): string {
    return 'success';
  }

  ngOnInit() {
  }

}
