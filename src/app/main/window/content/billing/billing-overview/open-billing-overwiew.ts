import { ViewService } from '@/app/main/view/view.service';
import { InvoiceType } from '@/app/main/window/content/billing/billing-overview/tabs/billing-invoices-tab/models';
import { DateRange } from '@/ui-kit/models';

export function openBillingOverview(viewService: ViewService, properties?: BillingOverviewProperties) {
  viewService.openViewWithProperties('billingWorkbench', properties || {});
}

export interface BillingOverviewProperties {
  range?: DateRange;
  bookingNumber?: string;
  billSplitId?: number;
  openManageInvoiceModal?: boolean;
  type?: InvoiceType;
}
