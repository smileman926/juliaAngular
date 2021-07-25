import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { LanguageService } from '@/app/i18n/language.service';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';
import { getUrl, redirectWithPOST } from '@/app/main/window/utils';


import {
  CompanyInfoListModel,
  CompanyInfoModel,
  WorkflowModel,
  WorkflowVariableModel
} from '@/app/main/window/content/my-company/operation-settings/models';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-operation-email-admin',
  templateUrl: './operation-email-admin.component.pug',
  styleUrls: ['./operation-email-admin.component.sass']
})
export class OperationEmailAdminComponent implements OnInit {
  form: FormGroup;
  sendForm: FormGroup;
  isUseCustEmailSet: boolean;
  daysInputLabels: string[] = [
    'ebc.hotelManagement.emailAdmin_daysAfterOption.text',
    'ebc.hotelManagement.emailAdmin_daysBeforeArrival.text',
    'ebc.hotelManagement.emailAdmin_daysAfterDeparture.text',
    'ebc.hotelManagement.emailAdmin_daysBeforeArrival.text'];
  workFlowIDs: string[] = ['2', '7', '12', '8', '13', '15'];
  public items: CompanyInfoListModel;
  public itemsList: CompanyInfoModel;
  public workFlowItems: WorkflowVariableModel[];
  public workFlows: WorkflowModel[];
  public isLoading: Observable<boolean>;
  public isDisableSendSmtp: boolean;
  public response: { [field: string]: any };

  constructor(
    private apiHotel: ApiHotelService,
    private mainService: MainService,
    public loaderService: LoaderService,
    private languageService: LanguageService,
    private modalService: ModalService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.INNER_TAB_EMAIL_ADMIN);
    this.isDisableSendSmtp = false;
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const formVals = this.form.getRawValue();
    const sendFormVals = this.sendForm.getRawValue();
    const realFlowChecks = formVals.workFlowChecks.map(item => item ? 'on' : 'off');

    const bodyAdds = {
      c_smtpFromName: formVals.c_smtpFromName,
      c_smtpFromEMail: formVals.c_smtpFromEMail,
      c_smtpReplyToName: formVals.c_smtpReplyToName,
      c_smtpReplyToEMail: formVals.c_smtpReplyToEMail,
      c_smtpServer: sendFormVals.c_smtpServer,
      c_smtpUserName: sendFormVals.c_smtpUserName,
      c_smtpPassword: sendFormVals.c_smtpPassword,
      c_smtpPort: sendFormVals.c_smtpPort,
      c_useCustomSMTP: formVals.c_useCustomSMTP ? 'on' : 'off',
      c_smtpSsl: sendFormVals.c_smtpSsl === 'ssl' ? 'on' : 'off',
      c_smtpTls: sendFormVals.c_smtpSsl === 'ssl' ? 'off' : 'on',
      c_sendEventsAtOffer: formVals.c_sendEventsAtOffer ? 'on' : 'off',
      c_sendEventsAtBooking: formVals.c_sendEventsAtBooking ? 'on' : 'off',
      c_sendEventsAtReservation: formVals.c_sendEventsAtReservation ? 'on' : 'off',
      c_sendEventsAtGoodJourney: formVals.c_sendEventsAtGoodJourney ? 'on' : 'off'
    };
    await Promise.all([
      this.apiHotel
        .putCompanyModel(bodyAdds)
        .toPromise(),
      this.workFlows.map(async (item, index) => {
        if (item.w_value !== realFlowChecks[index]) {
          await this.apiHotel.putWorkflowModel(item.w_id, {
            w_id: item.w_id,
            w_value: realFlowChecks[index]
          }).toPromise();
        }
      }),
      this.workFlowItems.map(async (item, index) => {
        if (item.wv_value !== formVals.daysInput[index]) {
          await this.apiHotel.putWorkflowVariableModel(item.wv_id, {
            wv_id: item.wv_id,
            wv_value: formVals.daysInput[index]
          }).toPromise();
        }
      })
    ]);
    this.init();
  }

  @Loading(LoaderType.LOAD)
  public async init(): Promise<void> {
    const [val1, val2, val3] = await Promise.all([
      this.apiHotel.getCompanyModel().toPromise(),
      this.apiHotel.getWorkflowVariableModel().toPromise(),
      this.apiHotel.getWorkflowModel().toPromise(),
    ]);
    this.itemsList = val1;
    this.workFlowItems = val2.filter(item => item.wv_id !== '2');
    this.workFlows = val3.filter(item => this.workFlowIDs.includes(item.w_id));

    // for reorder checkbox values
    const temp = this.workFlows[2];
    this.workFlows[2] = this.workFlows[3];
    this.workFlows[3] = temp;

    this.items = this.itemsList['0'];
    this.isUseCustEmailSet = this.items.c_useCustomSMTP === 'on';

    this.form = new FormGroup({
      c_smtpFromName: new FormControl(this.items.c_smtpFromName, Validators.required),
      c_smtpFromEMail: new FormControl(this.items.c_smtpFromEMail, [Validators.required, Validators.email]),
      c_smtpReplyToName: new FormControl(this.items.c_smtpReplyToName, Validators.required),
      c_smtpReplyToEMail: new FormControl(this.items.c_smtpReplyToEMail, [Validators.required, Validators.email]),
      c_useCustomSMTP: new FormControl(this.items.c_useCustomSMTP === 'on'),
      workFlowChecks: new FormArray(this.workFlows.map(item => {
        return new FormControl(item.w_value === 'on');
      })),
      daysInput: new FormArray(this.workFlowItems.map(item => {
        return new FormControl(Number(item.wv_value));
      })),
      c_sendEventsAtOffer: new FormControl(this.items.c_sendEventsAtOffer === 'on'),
      c_sendEventsAtBooking: new FormControl(this.items.c_sendEventsAtBooking === 'on'),
      c_sendEventsAtReservation: new FormControl(this.items.c_sendEventsAtReservation === 'on'),
      c_sendEventsAtGoodJourney: new FormControl(this.items.c_sendEventsAtGoodJourney === 'on')
    });

    this.sendForm = new FormGroup({
      c_smtpServer: new FormControl(this.items.c_smtpServer, Validators.required),
      c_smtpUserName: new FormControl(this.items.c_smtpUserName, Validators.required),
      c_smtpPassword: new FormControl(this.items.c_smtpPassword, Validators.required),
      c_smtpPort: new FormControl(this.items.c_smtpPort, Validators.required),
      c_smtpSsl: new FormControl({ value: this.items.c_smtpSsl === 'on' ? 'ssl' : 'tls', disabled: this.items.c_useCustomSMTP === 'off' })
    });
  }

  setIsUseCustEmailSet(event: boolean): void {
    this.isUseCustEmailSet = event;
    const fieldSSL = this.sendForm.get('c_smtpSsl') as FormControl;
    event ? fieldSSL.enable({ emitEvent: false }) : fieldSSL.disable({ emitEvent: false });
  }

  setSSL(val: boolean): void {
    const fieldSSL = this.sendForm.get('c_smtpSsl') as FormControl;
    val ? fieldSSL.setValue('ssl') : fieldSSL.setValue('tls');
  }

  @Loading(LoaderType.LOAD)
  public async sendTestEmail(): Promise<void> {
    // for validation
    const formVals = this.sendForm.getRawValue();
    const tempSSL = formVals.c_smtpSsl === 'ssl' ? 'on' : 'off';
    if ( formVals.c_smtpServer !== this.items.c_smtpServer
      || formVals.c_smtpUserName !== this.items.c_smtpUserName
      || formVals.c_smtpPassword !== this.items.c_smtpPassword
      || formVals.c_smtpPort !== this.items.c_smtpPort
      ||  tempSSL !== this.items.c_smtpSsl) {
      this.modalService.openSimpleText(
        'SMTP',
        'ebc.hotelManagement.emailAdmin_notSavedWarning.text'
      );
      return;
    }
    const appUser = {
      au_userName: this.mainService.getCompanyDetails().username,
      au_password: '',
      au_dbName: this.mainService.getCompanyDetails().dbName,
      locale_id: this.mainService.getCompanyDetails().c_beLocale_id,
      au_locale_id: this.mainService.getCompanyDetails().c_beLocale_id
    };
    const formData = new FormData();

    formData.append('action', 'sendCustomSMTPTestEmail');
    formData.append('toEMail', (this.form.get('c_smtpFromEMail') as FormControl).value);
    formData.append('subject', 'Subject: Test Message');
    formData.append('body', 'This is a test message.');
    formData.append('appUser', JSON.stringify(appUser));

    try {
      const result = await this.apiHotel.postTestEmailModel(formData).toPromise();
      if (result === 'SUCCESS') {
        this.modalService.openSimpleText(
          'SMTP',
          'ebc.hotelManagement.emailAdmin_sendTestMailSuccessMsg.text'
        );
      } else {
        this.modalService.openSimpleText(
          'SMTP',
          'ebc.hotelManagement.emailAdmin_sendTestMailErrorMsg.text'
        );
      }
    } catch (error) {
      this.modalService.openSimpleText(
        'SMTP',
        error
      );
    }
  }

  openReference(): void {
    redirectWithPOST(
      getUrl('/wo/Services/com/gotoacademy.php'),
      {
        screen: 'emailAdmin',
        l_id: String(this.languageService.getLanguageId())
      }
    );
  }

  ngOnInit(): void {
    this.init();
  }

}
