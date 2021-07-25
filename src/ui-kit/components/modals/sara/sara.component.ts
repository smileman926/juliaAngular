import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import {Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-sara',
  templateUrl: './sara.component.html',
  styleUrls: ['./sara.component.scss'],
})
export class SaraComponent implements OnInit {
  public page: number = 1;

  constructor(
    public activeModal: NgbActiveModal,
    private apiHotel: ApiHotelService
  ) { }

  ngOnInit() {
    
  }

  public useSaraNow() {
    this.apiHotel.updateSara({ss_newDesignReservation: 1}).toPromise();
    this.page = 3;
  }

  public hideSara() {
    this.apiHotel.updateSara({ss_hideCalltoActionModal: 1}).toPromise();
    this.activeModal.close();
  }

  public openSaraBlog() {
    window.open("https://blog.easybooking.eu/kommunikation-mit-app-sara/", "_blank");
  }

  public openAcademy() {
    window.open("https://www.easybooking.academy/anleitungen/buchungstools-sara-app", "_blank");
  }
}
