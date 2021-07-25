import { MainService } from '@/app/main/main.service';
import { CompanyDetails } from '@/app/main/models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wish-room-legacy',
  templateUrl: './wish-room-legacy.component.pug'
})
export class WishRoomLegacyComponent implements OnInit {
  companyDetails: CompanyDetails

  constructor(private mainService: MainService) {
    this.companyDetails = this.mainService.getCompanyDetails();
  }

  ngOnInit(): void {
  }

}
