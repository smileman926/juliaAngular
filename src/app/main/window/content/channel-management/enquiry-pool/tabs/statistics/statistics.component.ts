import { Component, OnInit } from '@angular/core';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

import dayjs from 'dayjs';
import { Observable } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiEnquiryPoolService } from '@/app/helpers/api/api-enquiry-pool.service';
import { ApiPaymentOptionsService } from '@/app/helpers/api/api-payment-options.service';
import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { CurrencyTypeModel } from '../../../../my-company/payment/models';
import { LoaderType } from '../../loader-types';
import { EnquiryPoolStatsModel } from '../../models';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.pug',
  styleUrls: ['./statistics.component.sass']
})
export class StatisticsComponent implements OnInit {

  form: FormGroup;
  public statisticsData: EnquiryPoolStatsModel;
  public isLoading: Observable<boolean>;
  public countOfEnquiries: number;
  public countOfAnsweredEnquiries: number;
  public bookingAmountOfSelectedSource: number;
  public countOfAnsweredEnquiriesThatBecameBookings: number;
  public countOfAnsweredEnquiriesThatBecameCancelledBookings: number;
  public bookingAmountTotal: number;
  public sourceTypeStr: string;
  public defaultLocale: number;
  public defaultCurrencyId: string;
  public currencyTypes: CurrencyTypeModel[];
  public defaultCurrencySymbol: string;

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: false },
    scales: {
      yAxes: [{ display: false }],
      xAxes: [{ display: false }]
    }
  };
  public barChartLabels: Label[] = ['', ''];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public chartColors = [
    { backgroundColor: '#DBE0EB' },
    { backgroundColor: '#FF6E8A' },
    { backgroundColor: '#2883BF' },
    { backgroundColor: '#4E5D7B' }
  ];

  public barChartData: ChartDataSets[] = [];

  constructor(
    private apiPayment: ApiPaymentOptionsService,
    private apiEnquiry: ApiEnquiryPoolService,
    private mainService: MainService,
    public loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.DATA);
    this.defaultLocale = Number(this.mainService.getCompanyDetails().c_beLocale_id);
    this.defaultCurrencyId = this.mainService.getCompanyDetails().c_currency_id;
    this.countOfEnquiries = 0;
    this.countOfAnsweredEnquiries = 0;
    this.bookingAmountOfSelectedSource = 0;
    this.countOfAnsweredEnquiriesThatBecameBookings = 0;
    this.countOfAnsweredEnquiriesThatBecameCancelledBookings = 0;
    this.bookingAmountTotal = 0;
  }

  @Loading(LoaderType.DATA)
  public async getEnquirySats(): Promise<void> {
    this.sourceTypeStr = (this.form.get('sourceOption') as FormControl).value as string;
    this.statisticsData = await this.apiEnquiry.getEnquiryPoolStatistics(
      (this.form.get('fromDate') as FormControl).value as Date,
      (this.form.get('untilDate') as FormControl).value as Date,
      (this.form.get('sourceOption') as FormControl).value as string
    ).toPromise();

    this.countOfEnquiries = this.statisticsData.countOfEnquiries;
    this.countOfAnsweredEnquiries = this.statisticsData.countOfAnsweredEnquiries;
    this.bookingAmountOfSelectedSource = this.statisticsData.bookingAmountOfSelectedSource;
    this.countOfAnsweredEnquiriesThatBecameBookings = this.statisticsData.countOfAnsweredEnquiriesThatBecameBookings;
    this.countOfAnsweredEnquiriesThatBecameCancelledBookings = this.statisticsData.countOfAnsweredEnquiriesThatBecameCancelledBookings;
    this.bookingAmountTotal = this.statisticsData.bookingAmountTotal;

    this.barChartData = [
      {
        data: [this.countOfEnquiries, 0],
        label: this.defaultLocale === 1 ? 'Amount ' + this.sourceTypeStr + ' Enquiries' : 'Anzahl ' + this.sourceTypeStr + ' Anfragen',
        stack: 'a' },
      {
        data: [0, this.countOfAnsweredEnquiriesThatBecameCancelledBookings],
        label: this.defaultLocale === 1 ? 'Cancellations' : 'Stornierungen',
        stack: 'a' },
      {
        data: [0, this.countOfAnsweredEnquiriesThatBecameBookings],
        label: this.defaultLocale === 1 ? 'Booking Generated' : 'Buchungen generiert',
        stack: 'a' },
      {
        data: [0, this.countOfAnsweredEnquiries],
        label: this.defaultLocale === 1 ? 'Enquiries Answered' : 'Anfragen beantwortet',
        stack: 'a' }
    ];
  }

  @Loading(LoaderType.DATA)
  public async init(): Promise<void> {
    this.currencyTypes = await this.apiPayment.getCurrencyTypeModel().toPromise();
    this.defaultCurrencySymbol = this.currencyTypes.filter( item => item.c_id === this.defaultCurrencyId)[0].c_symbol;
    this.form = new FormGroup({
      sourceOption: new FormControl('deskline'),
      fromDate: new FormControl(dayjs().subtract(28, 'day').toDate()),
      untilDate: new FormControl(dayjs().add(2, 'day').toDate())
    });
    await this.getEnquirySats();
    this.onChanges();
  }

  public async onChanges(): Promise<void> {
    (this.form.get('fromDate') as FormControl).valueChanges.subscribe(async val => {
      await this.getEnquirySats();
    });
    (this.form.get('untilDate') as FormControl).valueChanges.subscribe(async val => {
      await this.getEnquirySats();
    });
  }

  public async search(): Promise<void> {
    await this.getEnquirySats();
  }

  public getPillAmount(first: number, second: number): number {
    return !first && !second ? 0 : first * 100 / second;
  }

  ngOnInit(): void {
    this.init();
  }

}

