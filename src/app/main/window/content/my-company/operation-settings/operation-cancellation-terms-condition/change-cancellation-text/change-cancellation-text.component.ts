import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { Observable } from 'rxjs';

import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LocalInfoModel } from '../../../../web-tools/booking-tools/model';
import { LoaderType } from '../../loader-types';
import { CancellationLocaleModel, LocaleTranslationModel } from '../../models';


@Component({
  selector: 'app-change-cancellation',
  templateUrl: './change-cancellation-text.component.pug',
  styleUrls: ['./change-cancellation-text.component.sass']
})
export class ChangeCancellationComponent implements OnInit {
  public localeInfoList: LocalInfoModel[] = [];
  public tabSettings: TabsSettings = {
    buttons: [],
    buttonClasses: ['nav-link'],
  };
  public activeTabId: string;
  public selected: string;
  public isLoading: Observable<boolean>;
  // public localetranslatemaps: LocaleTranslationModel[] = [];
  public localetranslations: CancellationLocaleModel[];
  public form: FormGroup;
  public defaultLocale: string;

  constructor(
    private apiHotel: ApiHotelService,
    private loaderService: LoaderService,
    private mainService: MainService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.CHANGE_CANCELLATION);
    this.defaultLocale = this.mainService.getCompanyDetails().c_beLocale_id.toString();
    this.activeTabId = this.defaultLocale === '1' ? 'localeDescEnUk' : 'localeDescDeAt';
  }

  @Loading(LoaderType.CHANGE_CANCELLATION)
  public async init(): Promise<void> {
    const [val1, val2] = await Promise.all([
      this.apiHotel.getCancellationLocaleModel().toPromise(),
      this.apiHotel.getLocaleInfoModel().toPromise()
    ]);
    this.localetranslations = val1.filter( item => item.cl_id !== '10');
    this.localeInfoList = val2.filter( item => item.l_id !== '7' && item.l_active === 'on');

    this.form = new FormGroup({
      localeDescEnUk: new FormControl(
        this.localetranslations.find(item => item.cl_locale_id === '1') ?
        this.localetranslations.filter(item => item.cl_locale_id === '1')[0].cl_value : ''
      ),
      localeDescDeAt: new FormControl(
        this.localetranslations.find(item => item.cl_locale_id === '2') ?
        this.localetranslations.filter(item => item.cl_locale_id === '2')[0].cl_value : ''
      ),
      localeDescNlNl: new FormControl(
        this.localetranslations.find(item => item.cl_locale_id === '3') ?
        this.localetranslations.filter(item => item.cl_locale_id === '3')[0].cl_value : ''
      ),
      localeDescItIt: new FormControl(
        this.localetranslations.find(item => item.cl_locale_id === '4') ?
        this.localetranslations.filter(item => item.cl_locale_id === '4')[0].cl_value : ''
      ),
      localeDescFrFr: new FormControl(
        this.localetranslations.find(item => item.cl_locale_id === '5') ?
        this.localetranslations.filter(item => item.cl_locale_id === '5')[0].cl_value : ''
      ),
      localeDescHuHu: new FormControl(
        this.localetranslations.find(item => item.cl_locale_id === '6') ?
        this.localetranslations.filter(item => item.cl_locale_id === '6')[0].cl_value : ''
      ),
      localeDescRuRu: new FormControl(
        this.localetranslations.find(item => item.cl_locale_id === '10') ?
        this.localetranslations.filter(item => item.cl_locale_id === '10')[0].cl_value : ''
      ),
    });

    this.localeInfoList.map( item => {
      if (item.l_id !== this.defaultLocale) {
        this.tabSettings.buttons.push({
          id: item.l_desc,
          label: 'BackEnd_WikiLanguage.' + item.l_desc
        });
      }
    });
    const tempArray = this.localeInfoList;
    this.tabSettings.buttons.unshift({
      id: tempArray.filter( item => item.l_id === this.defaultLocale)[0].l_desc,
      label: 'BackEnd_WikiLanguage.' + tempArray.filter( item => item.l_id === this.defaultLocale)[0].l_desc
    });
  }

  @Loading(LoaderType.CHANGE_CANCELLATION)
  public async save(): Promise<any> {
    const promises = this.localeInfoList.map( async item => {
      if (this.localetranslations.find( l => l.cl_locale_id === item.l_id)) {
        const changeID = this.localetranslations.filter( l => l.cl_locale_id === item.l_id)[0].cl_id;
        const changeVal = (this.form.get(item.l_desc) as FormControl ).value;
        if (this.localetranslations.filter( child => child.cl_locale_id === item.l_id)[0].cl_value !== changeVal) {
         return this.apiHotel.putCancellationLocaleModel(changeID, {
            cl_id: changeID,
            cl_value: changeVal
          }).toPromise();
        }
      }
    });
    const result = await Promise.all(promises);
    return {
      res: result,
      initVal: (this.form.get(this.defaultLocale === '1' ? 'localeDescEnUk' : 'localeDescDeAt') as FormControl).value
    };
  }

  ngOnInit(): void {
    this.init();
  }
}
