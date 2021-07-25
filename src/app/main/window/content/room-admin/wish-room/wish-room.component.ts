import { Component, OnInit } from '@angular/core';

import { MainService } from '@/app/main/main.service';
import { CompanyDetails } from '@/app/main/models';

@Component({
  selector: 'app-wish-room',
  templateUrl: './wish-room.component.pug',
  styleUrls: ['./wish-room.component.sass']
})
export class WishRoomComponent implements OnInit {

  public companyDetails: CompanyDetails;

  constructor(private mainService: MainService) {
    this.companyDetails = this.mainService.getCompanyDetails();
  }

  ngOnInit() {
  }

}
