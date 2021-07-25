import { ModalGenericComponent } from '@/ui-kit/components/modal-generic/modal-generic.component';
import { UpsellingModalFooterComponent } from '@/ui-kit/components/modals/upselling-modal/upselling-modal-footer/upselling-modal-footer.component';
import { UpsellingModalComponent } from '@/ui-kit/components/modals/upselling-modal/upselling-modal.component';

export interface UpsellingModalOptions {
  hideHeaderInfoIcon: boolean;
  hidePrimaryButton;
  classes: string[];
}

export interface UpsellingModalData {
  accId: string;
  licenseUntilDate: string;
  aliquotLicenseCosts: string;
  totalUpsellingCosts: string;
  sepaId: string;
  iban: string;
  sepaDate: string;
  billingCountry: string;
  shippingCountry: string;
}

export interface UpsellingModalSaveData {
  licenseUntilDate: string;
  aliquotLicenseCosts: string;
  pm: 'sepa' | 'banktransfer';
  sepa?: {
    id?: string;
    iban_c?: string;
    account_owner_c?: string;
  }
}

export interface UpsellingModalScreenData extends UpsellingModalData {
  _perMonth?: string;
  _oneTimeActivationFee?: string;
  _licenseUntilDate?: string;
  _sepaDate?: string;
  _totalUpsellingCosts?: string;
  _termsAccepted?: boolean;
  _selectedPaymentMethod?: UpsellingModalPaymentMethodType;
  _disabledSepa?: boolean;
  _disabledSepaNew?: boolean;
  _disabledBankTransfer?: boolean;
}

export enum UpsellingModalPaymentMethodType {
  'BankTransfer' = 'bankTransfer',
  'SEPA' = 'SEPA',
  'SEPANew' = 'SEPANew',
}

export type upsellingModalButton = 'submit' | 'notInterested' | 'close' | 'contactUs';

export type upsellingModalView = 'upselling' | 'thankYou';

export interface UpsellingModalStructure {
  modal: ModalGenericComponent;
  modalBody: UpsellingModalComponent;
  modalShortcuts: UpsellingModalFooterComponent;
  result: Promise<boolean>
}

export interface UpsellingModalStaticData {
  price: UpsellingModalPrice;
  logo: string;
  labels: UpsellingModalLabels;
  footerButtons: UpsellingModalFooterButton[]
}

export interface UpsellingModalFooterButton {
  label: string;
  info?: string;
  primary: boolean;
  action: UpsellingModalButtonAction;
}

export interface UpsellingModalButtonAction {
  type: upsellingModalButton;
  dataChange?: UpsellingModalButtonDataChange;
}

export interface UpsellingModalButtonDataChange {
  fieldName: string;
  value: string;
}

export interface UpsellingModalPrice {
  perMonth: number;
  oneTimeActivationFee: number;
}

export interface UpsellingModalLabels {
  modalTitle: string;
  intro: {
    title: string,
    titleIcon?: string;
    text: string,
    button: {
      label: string,
      link: string
    }
  };
  benefits: string[];
  activation: string;
  purchaseInfo: string;
  orderButton: string;
  successTitle: string;
  successNextStepsTitle: string;
  successNextSteps: string;
}
