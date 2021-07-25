import { Component, OnInit } from '@angular/core';

import { LanguageService } from '@/app/i18n/language.service';

@Component({
  selector: 'app-room-selection-not-active',
  templateUrl: './room-selection-not-active.component.pug',
  styleUrls: ['./room-selection-not-active.component.sass']
})
export class RoomSelectionNotActiveComponent implements OnInit {

  public showVideo: boolean;
  public contactUrl: string;
  private lid: number;

  constructor(private languageService: LanguageService) {
    this.showVideo = true;
  }

  ngOnInit(): void {
  }

  public openContact() {
    this.lid = this.languageService.getLanguageId();
    if (this.lid === 2) {
        this.contactUrl = 'https://www.easybooking.eu/de/kontakt/kontakt';
      } else {
        this.contactUrl = 'https://www.easybooking.eu/contact/contact';
      }
    window.open(this.contactUrl, 'blank');
  }

  public openAcademy() {
    window.open('https://www.easybooking.academy/zimmerauswahl-modul/zimmerauswahl-modul-konfigurieren', '_blank');
  }
}
