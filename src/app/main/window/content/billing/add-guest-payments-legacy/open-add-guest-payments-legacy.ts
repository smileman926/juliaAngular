import { ViewService } from '@/app/main/view/view.service';

export function openAddGuestPayments(viewService: ViewService, properties?: AddGuestPaymentsLegacyProperties): void {
  viewService.openViewWithProperties('iframeAddGuestPayments', properties || {});
}

export interface AddGuestPaymentsLegacyProperties {
  bookingNo?: string;
  openCashRegister?: boolean;
  amendmentMode?: boolean;
}
