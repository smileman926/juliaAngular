import { LanguageService } from '@/app/i18n/language.service';
import { MainService } from '@/app/main/main.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-wish-room-module-not-active',
  templateUrl: './wish-room-module-not-active.component.pug',
  styleUrls: ['./wish-room-module-not-active.component.sass']
})
export class WishRoomModuleNotActiveComponent implements OnInit {
  public showVideo: boolean = true;
  public contactUrl: string;
  private lid: number;

  constructor(private languageService: LanguageService) {
  }

  ngOnInit(): void {
  }

  public openContact() {
    this.lid = this.languageService.getLanguageId();
    if (this.lid === 2)
      {
        this.contactUrl = 'https://www.easybooking.eu/de/kontakt/kontakt';
      } else
      {
        this.contactUrl = 'https://www.easybooking.eu/contact/contact';
      }
      window.open(this.contactUrl, 'blank');
  }

  public openAcademy() {
    window.open('https://www.easybooking.academy/zimmerauswahl-modul/zimmerauswahl-modul-konfigurieren', '_blank');
  }
}
