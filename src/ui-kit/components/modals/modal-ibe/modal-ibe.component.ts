import { ApiSupportFormService } from '@/app/helpers/api/api-support-form.service';
import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-ibe-confirm',
  templateUrl: './modal-ibe.component.html',
  styleUrls: ['./modal-ibe.component.scss'],
})
export class ModalIbeComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private apiSupportFormService: ApiSupportFormService
  ) { }

  ngOnInit(): void {
  }

  public async notInterested(): Promise<void> {
    this.activeModal.close(true);
  }

  public activate() {
    this.newCase().then(() => {
      const AccountData = {
        ibe_activation_modal_c: 'off'
      };
      this.apiSupportFormService.changeAccountData(AccountData).toPromise();
    });
    this.activeModal.close(true);
  }

  public async newCase() {
    const PostData = {
      name: 'Bitte um Einbau der neuen IBE', 
      recordtype_c: 'CustomerSupport', 
      type: 'SUPPORTweb', 
      origin_c: 'form',
      priority: 'P2', 
      myeb_display_c: '1', 
      support_area_c: 'Website', 
      support_issue_c: 'Website_maintenance', 
      general_cause_c: 'config_change', 
      description: 'Dieses Support Ticket wurde automatisch durch easybooking erstellt, weil Sie den kostenlosen Einbau der neuen Buchungsstrecke verlangt haben. Unser Support Team wird sich in Kürze bei Ihnen mit den notwendigen Informationen melden.'
    };
    return await this.apiSupportFormService.newSupportCase(PostData).toPromise();
  }

}
