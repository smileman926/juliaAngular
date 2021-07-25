import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { MainService } from '@/app/main/main.service';

@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.pug',
  styleUrls: ['./manage-list.component.sass']
})
export class ManageListComponent implements OnInit, OnDestroy  {

  @Input() onlyImportant = false;
  @Input() disabled = false;
  @Output() langChange = new EventEmitter<number>();
  @Output() new = new EventEmitter<string>();
  @Output() save = new EventEmitter<string>();

  important = ['1', '2']; // English, German

  lang: string;

  languages: { value: string, name: string }[];

  constructor(
    private mainService: MainService
  ) { }

  private setLanguages() {
    this.languages = this.mainService.getCompanyDetails().languagesDataProvider.map(l => ({
      value: l.l_id,
      name: l.l_nameDisplay
    })).filter(l => !this.onlyImportant || this.important.includes(l.value));
  }

  public onLanguageChange(language: string) {
    this.langChange.emit(+language);
  }

  ngOnInit() {
    this.mainService.company$.pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.setLanguages();
    });
    this.lang = this.mainService.getCompanyDetails().c_beLocale_id;
    this.onLanguageChange(this.lang);
  }

  ngOnDestroy() {}
}
