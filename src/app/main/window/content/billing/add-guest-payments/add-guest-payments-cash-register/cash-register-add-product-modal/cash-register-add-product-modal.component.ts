import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '@/app/auth/auth.service';
import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { TaxListModel } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { AddingProductForGuestPayment, AddingProductGroup, EditRCIInfo, RCIInfo, RCITInfo } from '../../models';

@Component({
  selector: 'app-cash-register-add-product-modal',
  templateUrl: './cash-register-add-product-modal.component.pug',
  styleUrls: ['./cash-register-add-product-modal.component.sass']
})
export class CashRegisterAddProductModalComponent implements OnInit {

  isLoading: Observable<boolean>;
  addingProductGroupList: AddingProductGroup[];
  addingProudctList: AddingProductForGuestPayment[];
  taxGroupList: TaxListModel[];
  form: FormGroup;
  isInvalid: {
    GPCR_product: boolean,
    GPCR_p_name: boolean,
    GPCR_p_group: boolean,
    GPCR_p_tax: boolean,
    pmdp_taxId1: boolean,
    pmdp_taxId2: boolean
  };
  editModeItem: EditRCIInfo;

  constructor(
    private apiHotel: ApiHotelService,
    private authService: AuthService,
    private apiBilling: ApiBillingWorkbenchService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_ADD_PRODUCT);
    this.isInvalid = {
      GPCR_product: false,
      GPCR_p_name: false,
      GPCR_p_group: false,
      GPCR_p_tax: false,
      pmdp_taxId1: false,
      pmdp_taxId2: false
    };
   }

  @Loading(LoaderType.LOAD_ADD_PRODUCT)
  public async init(rciInfo?: EditRCIInfo): Promise<void> {

    const [val1, val2, val3] = await Promise.all([
      this.apiHotel.getAddingProductGroup().toPromise(),
      this.apiHotel.getAddingProductForGuestPayment().toPromise(),
      this.apiBilling.getTaxListModel().toPromise()
    ]);
    this.addingProductGroupList = val1;
    this.addingProudctList = val2;
    this.taxGroupList = val3;

    this.form = new FormGroup({
      GPCR_productGroup: new FormControl(rciInfo && rciInfo.lpgId ? rciInfo.lpgId : 'all'),
      GPCR_product: new FormControl(rciInfo && rciInfo.item ? rciInfo.item.rci_product_id : 'choose'),
      GPCR_p_name: new FormControl(''),
      GPCR_p_group: new FormControl('choose'),
      GPCR_p_tax: new FormControl('choose'),
      GPCR_p_amount: new FormControl(rciInfo && rciInfo.item ? rciInfo.item.rci_unitCount : 1),
      GPCR_p_gross: new FormControl(0),
      pmdp_taxPart1: new FormControl(60),
      pmdp_taxPart2: new FormControl(40),
      pmdp_taxId1: new FormControl('choose'),
      pmdp_taxId2: new FormControl('choose'),
      GPCR_p_totalGross: new FormControl(0)
    });
    if (rciInfo && rciInfo.item && rciInfo.item.rci_product_id) {
      this.showProductDetails(true, rciInfo.item.rci_product_id);
    } else {
      this.showProductDetails(true);
    }

    this.form.valueChanges.subscribe( () => this.resetValidation());

    if (rciInfo) {
      this.editModeItem = rciInfo;
    }

    (this.form.get('GPCR_productGroup') as FormControl).valueChanges.subscribe( val => {
      if (val === 'all') {
        this.addingProudctList = val2;
      } else {
        this.addingProudctList = val2.filter( l => l.p_productGroup_id === val);
      }
      (this.form.get('GPCR_product') as FormControl).setValue('choose');
    });

    (this.form.get('GPCR_product') as FormControl).valueChanges.subscribe( val => {
      if (val === 'choose') {
        this.showProductDetails(true);
      } else if (val === 'new') {
        this.showProductDetails(false);
      } else {
        this.showProductDetails(true, val);
      }
    });

    (this.form.get('GPCR_p_group') as FormControl).valueChanges.subscribe( val => {
      const selectedGroup = this.addingProductGroupList.find(l => l.pg_id === val);
      if (selectedGroup) {
        if (selectedGroup.pg_name === 'Taxe') {
          const zeroTax = this.taxGroupList.find(l => Number(l.t_decimal) === 0);
          (this.form.get('GPCR_p_tax') as FormControl).setValue(zeroTax ? zeroTax.t_id.toString() : '1');
          (this.form.get('GPCR_p_tax') as FormControl).disable();
        } else {
          (this.form.get('GPCR_p_tax') as FormControl).setValue('choose');
          (this.form.get('GPCR_p_tax') as FormControl).enable();
        }
      }
    });

    (this.form.get('GPCR_p_amount') as FormControl).valueChanges.subscribe( val => {
      this.calculateTotalGross();
    });

    (this.form.get('GPCR_p_gross') as FormControl).valueChanges.subscribe( val => {
      this.calculateTotalGross();
    });

    (this.form.get('pmdp_taxPart1') as FormControl).valueChanges.pipe(distinctUntilChanged()).subscribe( val => {
      (this.form.get('pmdp_taxPart2') as FormControl).setValue(100 - Number(val));
    });

    (this.form.get('pmdp_taxPart2') as FormControl).valueChanges.pipe(distinctUntilChanged()).subscribe( val => {
      (this.form.get('pmdp_taxPart1') as FormControl).setValue(100 - Number(val));
    });
  }

  public showProductDetails(flag: boolean, selected?: string | number): void {
    if (selected) {
      const selectedProduct = this.addingProudctList.find(l => l.p_id === selected);
      if (selectedProduct) {
        (this.form.get('GPCR_p_name') as FormControl).setValue(selectedProduct.pl_name);
        (this.form.get('GPCR_p_group') as FormControl).setValue(selectedProduct.p_productGroup_id);
        (this.form.get('GPCR_p_amount') as FormControl).setValue(1);
        (this.form.get('GPCR_p_gross') as FormControl).setValue(selectedProduct.p_gross);
        if (selectedProduct.p_multipleTax === 'on') {
          (this.form.get('GPCR_p_tax') as FormControl).setValue('multipleTax');
          (this.form.get('pmdp_taxPart1') as FormControl).setValue(selectedProduct.pmt_taxPart1);
          (this.form.get('pmdp_taxId1') as FormControl).setValue(selectedProduct.pmt_tax_id1);
          (this.form.get('pmdp_taxPart2') as FormControl).setValue(selectedProduct.pmt_taxPart2);
          (this.form.get('pmdp_taxId2') as FormControl).setValue(selectedProduct.pmt_tax_id2);
        } else {
          (this.form.get('GPCR_p_tax') as FormControl).setValue(selectedProduct.p_tax_id);
        }
        (this.form.get('GPCR_p_totalGross') as FormControl).setValue(selectedProduct.p_gross);
      }
    } else {
      (this.form.get('GPCR_p_name') as FormControl).setValue('');
      (this.form.get('GPCR_p_group') as FormControl).setValue('choose');
      (this.form.get('GPCR_p_amount') as FormControl).setValue(1);
      (this.form.get('GPCR_p_gross') as FormControl).setValue(0);
      (this.form.get('GPCR_p_tax') as FormControl).setValue('choose');
      (this.form.get('GPCR_p_totalGross') as FormControl).setValue(0);
    }

    if (flag) {
      (this.form.get('GPCR_p_name') as FormControl).disable();
      (this.form.get('GPCR_p_group') as FormControl).disable();
      (this.form.get('GPCR_p_gross') as FormControl).disable();
      (this.form.get('GPCR_p_tax') as FormControl).disable();
      (this.form.get('GPCR_p_totalGross') as FormControl).disable();
    } else {
      (this.form.get('GPCR_p_name') as FormControl).enable();
      (this.form.get('GPCR_p_group') as FormControl).enable();
      (this.form.get('GPCR_p_amount') as FormControl).enable();
      (this.form.get('GPCR_p_gross') as FormControl).enable();
      (this.form.get('GPCR_p_tax') as FormControl).enable();
      (this.form.get('GPCR_p_totalGross') as FormControl).enable();
    }
  }

  public calculateTotalGross(): void {
    const selectedProdId = (this.form.get('GPCR_product') as FormControl).value;
    if (this.addingProudctList.find( l => l.p_id === selectedProdId) || selectedProdId === 'new') {
      const amount = (this.form.get('GPCR_p_amount') as FormControl).value;
      const unitGross = selectedProdId === 'new' ?
        (this.form.get('GPCR_p_gross') as FormControl).value :
          this.addingProudctList.filter( prod => prod.p_id === selectedProdId)[0].p_gross;
      const totalGross = amount * Number(unitGross);
      (this.form.get('GPCR_p_totalGross') as FormControl).setValue(totalGross);
    }
  }

  public checkInvalidStatus(): boolean {
    let status = false;
    if ((this.form.get('GPCR_product') as FormControl).value === 'choose') {
      this.isInvalid.GPCR_product = true;
      status = true;
    } else if ((this.form.get('GPCR_product') as FormControl).value === 'new') {
      if ((this.form.get('GPCR_p_name') as FormControl).value.trim().length === 0) {
        this.isInvalid.GPCR_p_name = true;
        status = true;
      }
      if ((this.form.get('GPCR_p_group') as FormControl).value === 'choose') {
        this.isInvalid.GPCR_p_group = true;
        status = true;
      }
      if ((this.form.get('GPCR_p_tax') as FormControl).value === 'choose') {
        this.isInvalid.GPCR_p_tax = true;
        status = true;
      } else if ((this.form.get('GPCR_p_tax') as FormControl).value === 'multipleTax') {
        if ((this.form.get('pmdp_taxId1') as FormControl).value === 'choose') {
          this.isInvalid.pmdp_taxId1 = true;
          status = true;
        }
        if ((this.form.get('pmdp_taxId2') as FormControl).value === 'choose') {
          this.isInvalid.pmdp_taxId2 = true;
          status = true;
        }
      }
    }
    return status;
  }

  public resetValidation(): void {
    this.isInvalid = {
      GPCR_product: false,
      GPCR_p_name: false,
      GPCR_p_group: false,
      GPCR_p_tax: false,
      pmdp_taxId1: false,
      pmdp_taxId2: false
    };
  }

  @Loading(LoaderType.LOAD_ADD_PRODUCT)
  public async save(): Promise<any> {
    this.resetValidation();
    const invalidStatus = this.checkInvalidStatus();
    if (invalidStatus) {
      return {
        status: false,
        obj: null,
        isEdit: false
      };
    } else {
      if ((this.form.get('GPCR_product') as FormControl).value === 'new') {
        const { customerId, languageId } = this.authService.getQueryParams();
        const prod = {
          customerId,
          localeId: languageId
        };
        const name = (this.form.get('GPCR_p_name') as FormControl).value.trim();
        const group = (this.form.get('GPCR_p_group') as FormControl).value;
        const gross = (this.form.get('GPCR_p_gross') as FormControl).value;
        let tax = (this.form.get('GPCR_p_tax') as FormControl).value;

        let taxMdl;
        let pTaxDec = 0;
        let pNet = 0;

        if (tax === 'multipleTax') {
          let taxPart = 0;
          let taxPart2 = 0;
          let grossPart = 0;

          Object.assign(prod, {p_multipleTax: 'on'});

          taxPart = (this.form.get('pmdp_taxPart1') as FormControl).value;
          tax = (this.form.get('pmdp_taxId1') as FormControl).value;
          Object.assign(prod, {
            pmt_taxPart1: taxPart,
            pmt_tax_id1: tax
          });

          taxMdl = this.taxGroupList.find(l => l.t_id === tax);
          pTaxDec = taxMdl && Number(taxMdl.t_decimal) > 0 ? (1 + (Number(taxMdl.t_decimal) / 100)) : 1;
          grossPart = (gross / 100) * taxPart;
          pNet += grossPart / pTaxDec;

          taxPart2 = (this.form.get('pmdp_taxPart2') as FormControl).value;
          tax = (this.form.get('pmdp_taxId2') as FormControl).value;

          if (taxPart + taxPart2 !== 100) {
            taxPart2 = 100 - taxPart;
          }

          Object.assign(prod, {
            pmt_taxPart2: taxPart2,
            pmt_tax_id2: tax
          });

          taxMdl = this.taxGroupList.find(l => l.t_id === tax);
          pTaxDec = taxMdl && Number(taxMdl.t_decimal) > 0 ? (1 + (Number(taxMdl.t_decimal) / 100)) : 1;
          grossPart = (gross / 100) * taxPart2;
          pNet += grossPart / pTaxDec;

          // setting the tax to 0, because it's not used anyway
          tax = 0;
        } else {
          taxMdl = this.taxGroupList.find(l => l.t_id === tax);
          pTaxDec = taxMdl && Number(taxMdl.t_decimal) > 0 ? (1 + (Number(taxMdl.t_decimal) / 100)) : 1;
          pNet = gross / pTaxDec;
        }

        Object.assign(prod, {
          p_active: 'on',
          p_gross: gross,
          p_net: pNet,
          p_onlineBookable: 'off',
          p_priceType: 'PricePerPiece',
          p_productGroup_id: group,
          p_productPricingScheme_id: '1',
          p_productType_id: '1',
          p_sortOrder: '',
          p_tax: (gross - pNet),
          p_tax_id: tax,
          pl_name: name,
        });

        const body = await this.apiHotel.postAddingProductForGuestPayments(prod).toPromise();
        const result = this.addProduct(body);
        const object: {[fields: string]: boolean | RCIInfo | number | {[fields: string]: number | string}} = {
          status: true,
          obj: result,
          isEdit: !!this.editModeItem
        };
        if (!this.editModeItem) {
          object.lastProductGroup_id = (this.form.get('GPCR_productGroup') as FormControl).value;
          object.lastSavedReceipt = {
            rc_id: 0,
            rc_creationDate: '',
            rc_billVersionPaymentType_id: 0,
            rc_2ndBillVersionPaymentType_id: 0
          };
        } else {
          object.index = this.editModeItem.index;
        }
        return object;
      } else {
        const selProd = this.addingProudctList.find( l => l.p_id === (this.form.get('GPCR_product') as FormControl).value);
        if (selProd) {
          const result = this.addProduct(selProd);
          const object: {[fields: string]: boolean | RCIInfo | number | {[fields: string]: number | string}} = {
            status: true,
            obj: result,
            isEdit: !!this.editModeItem
          };
          if (!this.editModeItem) {
            object.lastProductGroup_id = (this.form.get('GPCR_productGroup') as FormControl).value;
            object.lastSavedReceipt = {
              rc_id: 0,
              rc_creationDate: '',
              rc_billVersionPaymentType_id: 0,
              rc_2ndBillVersionPaymentType_id: 0
            };
          } else {
            object.index = this.editModeItem.index;
          }
          return object;
        }
      }
    }
  }

  public addProduct(selProd: AddingProductForGuestPayment) {
    let rci: RCIInfo;
    if (!this.editModeItem) {
      const { customerId, languageId } = this.authService.getQueryParams();
      rci = {
        customerId,
        localeId: languageId,
        rci_unitCount: 1,
        rci_unitPriceGross: 0,
        rci_totalNet: 0,
        rci_totalTax: 0,
        rci_totalGross: 0,
        rci_description: '',
        rci_product_id: '',
        rcit: []
      };
    } else {
      rci = this.editModeItem.item;
    }

    const amount = (this.form.get('GPCR_p_amount') as FormControl).value;
    const unitNet = Number(selProd.p_net);
    const unitTax = Number(selProd.p_tax);
    const unitGross = Number(selProd.p_gross);
    const totalNet = amount * unitNet;
    const totalTax = amount * unitTax;
    const totalGross = amount * unitGross;

    Object.assign(rci, {
      rci_unitCount: amount,
      rci_unitPriceGross: unitGross,
      rci_totalNet: totalNet,
      rci_totalTax: totalTax,
      rci_totalGross: totalGross,
      rci_description: selProd.pl_name,
      rci_product_id: selProd.p_id
    });

    const rcit: RCITInfo[] = [];
    if (selProd.p_multipleTax === 'on') {
      // multipleTax needs 2 rows currently

      let part = selProd.pmt_taxPart1;
      let tId = selProd.pmt_tax_id1;
      let tDecimal = Number(
        this.taxGroupList.find(l => l.t_id === tId) ? this.taxGroupList.filter(l => l.t_id === tId)[0].t_decimal : 0);
      let grossPart = (totalGross / 100) * Number(part);
      let net = grossPart / (Number(('1' + tDecimal.toString())) / 100);

      rcit.push({
        rcit_tax_id: tId,
        rcit_taxDecimal: tDecimal,
        rcit_totalNet: net,
        rcit_totalTax: (grossPart - net),
        rcit_totalGross: grossPart
      });

      part = selProd.pmt_taxPart2;
      tId = selProd.pmt_tax_id2;
      tDecimal = Number(
        this.taxGroupList.find(l => l.t_id === tId) ? this.taxGroupList.filter(l => l.t_id === tId)[0].t_decimal : 0);
      grossPart = (totalGross / 100) * Number(part);
      net = grossPart / (Number(('1' + tDecimal.toString())) / 100);

      rcit.push({
        rcit_tax_id: tId,
        rcit_taxDecimal: tDecimal,
        rcit_totalNet: net,
        rcit_totalTax: (grossPart - net),
        rcit_totalGross: grossPart
      });

    } else {
      // no multipleTax
      rcit.push({
        rcit_tax_id: selProd.p_tax_id,
        rcit_taxDecimal: this.taxGroupList.find(l => l.t_id === selProd.p_tax_id) ?
          this.taxGroupList.filter(l => l.t_id === selProd.p_tax_id)[0].t_decimal : 0,
        rcit_totalNet: totalNet,
        rcit_totalTax: totalTax,
        rcit_totalGross: totalGross
      });
    }
    Object.assign(rci, {
      rcit
    });

    return rci;
  }

  ngOnInit(): void { }

}
