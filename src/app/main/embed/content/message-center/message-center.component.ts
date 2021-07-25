import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';

import { subDays } from 'date-fns';
import dayjs from 'dayjs';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { PeriodicCheckService } from '@/app/helpers/periodic-check.service';
import { ViewService } from '@/app/main/view/view.service';
import { openBillingOverview } from '@/app/main/window/content/billing/billing-overview/open-billing-overwiew';
import { openReportAndList } from '@/app/main/window/content/billing/report-and-list/open-report-and-list';
import { MoveToRoomplanEvent } from '@/app/main/window/content/calendar/calendar-html/events';
import { openEnquiryPool } from '@/app/main/window/content/channel-management/enquiry-pool/open-enquiry-pool';
import { openCompanyCustomerAdmin } from '@/app/main/window/content/customer-admin/company-customer-admin/open-company-customer-admin';
import { openGeneralSettings } from '@/app/main/window/content/customer-admin/general-settings/open-general-settings';
import { ViewMode } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { openGuestRegistration } from '@/app/main/window/content/customer-admin/guest-registration/open-guest-registration';
import { openOperationSettings } from '@/app/main/window/content/my-company/operation-settings/open-operation-settings';
import { openSupportForm } from '@/app/main/window/content/my-eb/support-form-new/open-support-form';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { getLegacyContentUrl } from '@/app/main/window/utils';

import { LanguageService } from '@/app/i18n/language.service';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.pug',
  styleUrls: ['./message-center.component.sass'],
})
export class MessageCenterComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  @Input() visible!: boolean;
  @Output() hide = new EventEmitter();
  private actualLanguageId: number;
  src: SafeResourceUrl | null = null;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private viewService: ViewService,
    private eventBusService: EventBusService,
    private cacheService: CacheService,
    private periodicCheckService: PeriodicCheckService,
    private languageService: LanguageService,
  ) {
    this.periodicCheckService.checkIfThereAreNewMessages();
  }

  private loadIframe() {
    const { customerId, languageId } = this.authService.getQueryParams();
    this.actualLanguageId = languageId;
    const parameters = {
      cid: customerId,
      lid: languageId,
      messagecenterJumpPrepayment: 0
    };
    const rawSrc = getLegacyContentUrl('easybookingConfig/', parameters, 'iframe/messageCenter');
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(rawSrc);
  }

  @HostListener('window:message', ['$event'])
  listenMessageEvent(e: MessageEvent): void {
    this.onMessage(e);
  }

  onMessage(message: MessageEvent): void {
    if (!message || !message.data || message.data.functionName !== 'mcMessage' || !message.data.data) {
      return;
    }
    switch (message.data.data.messageAction) {
      case 'confirm':
      case 'createBooking':
      case 'createChannelBooking':
      case 'feratelError':
      case 'updateChannelBooking':
      case 'updateSelfAdmin':
        this.openBooking(+message.data.data.id, message.data.data.fromDate, 'booking');
        break;
      case 'createEnquiry':
        this.openBooking(+message.data.data.id, message.data.data.fromDate, 'enquiry');
        break;
      case 'updateGuestData':
      case 'updateBirthday':
      case 'guestRating':
        openCompanyCustomerAdmin(this.viewService, {customerId: +message.data.data.id});
        break;
      case 'missingArrival':
        this.openMissingArrival();
        break;
      case 'missingDeparture':
        openGuestRegistration(this.viewService, {activeTabId: ViewMode.ARRIVED});
        break;
      case 'regFormNoRange80PercUsed':
        this.viewService.focusViewById('guestRegistrationConfig');
        break;
      case 'missingPrePayment':
        openReportAndList(this.viewService, {jumpToPrepayments: true});
        break;
      case 'unPaidInvoices':
      case 'uncreatedInvoices':
        let fromDate: Date;
        const untilDate = dayjs().add(2, 'day').toDate();
        if (message.data.data.fromDate) {
          fromDate = new Date(message.data.data.fromDate);
        } else {
          fromDate = dayjs().subtract(28, 'day').toDate();
        }
        openBillingOverview(
          this.viewService,
          {
            range: { start: fromDate, end: untilDate },
            type: (message.data.data.messageAction === 'uncreatedInvoices') ? 'preview' : 'bills'
          });
        break;
      case 'openEnquiries':
        openEnquiryPool(this.viewService, {activeTabId: 'ebEnquiryPool'});
        break;
      case 'openDesklineEnquiries':
        this.cacheService.getCompanyDetails().then(companyDetails => {
          if (companyDetails.c_hasFeratelEnquiryPool === 'off') {
            return;
          }
          openEnquiryPool(this.viewService, {activeTabId: 'desklineEnquiryPool'});
        });
        break;
      case 'expiredReservations':
        this.viewService.focusViewById('channelStatistics');
        break;
      case 'supportCaseReplied':
      case 'supportCaseStateChanged':
      case 'supportNotificationB':
      case 'supportNotificationC':
        openSupportForm(this.viewService, {caseId: +message.data.data.id});
        break;
      case 'refreshMessageCounter':
        this.periodicCheckService.checkIfThereAreNewMessages();
        break;
      case 'openIframedHotelManagementEmailTab':
        openOperationSettings(this.viewService, {tab: 'email'});
        break;
      case 'openGuestAdminSettingsAtTabGDPR':
        openGeneralSettings(this.viewService, {preselectTabId: 'gdpr'});
        break;
      case 'newAirbnbEnquiry':
        const arrivalDate = new Date(message.data.data.arrivalDate);
        openEnquiryPool(this.viewService, {
          activeTabId: 'ebEnquiryPool',
          fromDate: arrivalDate,
          untilDate: arrivalDate
        });
        break;
    }
  }

  private async openBooking(bookingId: number, dateStr: string, type: string): Promise<void> {
    await this.viewService.focusViewById('calendarHTML');
    const arrivalDate = new Date();
    arrivalDate.setTime(Date.parse(dateStr));
    this.eventBusService.emit<MoveToRoomplanEvent>('moveToRoomplan', { arrivalDate, id: bookingId, type });
  }

  private openMissingArrival(): void {
    const start = subDays(new Date(), 30);
    const end = subDays(new Date(), 1);
    openGuestRegistration(this.viewService, {
      range: {start, end},
      status: 'notArrived'
    });
  }

  private refreshContent(): void {
    this.sendMessage('refreshMC');
  }

  private sendMessage(data: any): void {
    const iframe = this.iframe.nativeElement as HTMLIFrameElement;

    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, '*');
    }
  }

  ngOnInit() {
    this.loadIframe();
    this.languageService.languageId$.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.actualLanguageId !== this.languageService.getLanguageId()) {
        this.loadIframe();
      }
    });
  }

  ngOnChanges({visible}: SimpleChanges): void {
    if (visible && !visible.previousValue && visible.currentValue) {
      this.refreshContent();
    }
  }

  ngOnDestroy(): void {}
}
