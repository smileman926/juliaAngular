import { ApiJuliaAngularService } from '@/app/helpers/api/api-julia-angular.service';
import { LanguageService } from '@/app/i18n/language.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import {Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-pci-nagscreen',
  templateUrl: './pci-nagscreen.component.pug',
  styleUrls: ['./pci-nagscreen.component.sass'],
})
export class PciNagscreenComponent implements OnInit {
  public contactUrl: string;
  public dontshow: boolean = false;

  constructor(
    private languageService: LanguageService,
    private modalService: ModalService,
    private apiJuliaAngular: ApiJuliaAngularService
  ) { 
  }

  ngOnInit() {
    this.openConfirmModal();
  }

  public openContact() {
    const lid = this.languageService.getLanguageId();
    if (lid === 2)
      {
        this.contactUrl = 'https://www.easybooking.eu/de/kontakt/kontakt';
      } else
      {
        this.contactUrl = 'https://www.easybooking.eu/contact/contact';
      }
    window.open(this.contactUrl, 'blank');
  }

  public async setCheckbox() {
    await this.apiJuliaAngular.setPCICheckbox(this.dontshow).toPromise();
  }

  public async openConfirmModal() {
    const confirmed = await this.modalService.openConfirm('', 'BackEnd_WikiLanguage.adScreens_pcina_popupText', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.adScreens_button_moreInformations',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
      hideHeader: true,
      disableClose: true,
      modalType: 3
    });
  }

}
