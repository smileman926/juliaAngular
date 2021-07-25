import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { CacheService } from '@/app/helpers/cache.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { GuestDetail } from '../../../guest-information/models';
import { ChooseGuestComponent } from '../../choose-guest/choose-guest.component';
import { Providers } from '../../consts';
import { CreateRegistrationFormService } from '../../create-registration-form.service';
import { groupGuestsByTypeAndCountry } from '../../group-guests-by-type-and-country';
import { LoaderType } from '../../loader-types';
import {
  GroupGuest,
  GroupGuestCounty,
  RegistrationFormGroup,
  RegistrationFormGuests,
  RegistrationGuestTypes,
  RegistrationTaxType
} from '../../models';

import { isCountrySelected } from '@/app/main/window/utils';

import { GuestRegistrationForm } from '@/app/main/window/content/customer-admin/guest-registration/models';

enum ItemID {
  LEADER = 'leader',
  GUEST = 'guest'
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.pug',
  styleUrls: ['./group.component.sass']
})
export class GroupComponent implements OnChanges {

  @Input() registrationFormId?: GuestRegistrationForm['id'];
  @Input() group: RegistrationFormGuests['group'];
  @Input() arrived!: boolean;
  @Output() leaderDataChange = new EventEmitter<GuestDetail | null>();
  @Output() save = new EventEmitter<RegistrationFormGroup>();

  public onEditGuestInformation = new EventEmitter();
  public numberOfPersons = 0;

  guests: GroupGuest[] = [];
  taxTypes: RegistrationTaxType[];
  countries: GroupGuestCounty[];
  selectedItemId: ItemID | null = null;
  isAVSProvider = false;

  list = [
    { id: ItemID.LEADER, name: 'BackEnd_WikiLanguage.MW_TourLeader' },
    { id: ItemID.GUEST, name: 'BackEnd_WikiLanguage.MW_TourGroupGuests' }
  ];

  private allGuestTypes: RegistrationGuestTypes;
  public Providers: Providers;

  constructor(
    private cacheService: CacheService,
    public loaderService: LoaderService,
    private modal: ModalService,
    public regFormService: CreateRegistrationFormService,
  ) {
    if (this.regFormService.hotel.guestRegistrationProviderId === Providers.AVS) {
      this.isAVSProvider = true;
    }
  }

  private getLeaderCountryDetails(leader: GuestDetail | null): GroupGuestCounty | null | undefined {
    // https://trello.com/c/3ZAPTi6r/192-customer-admin-guest-registration-create-registration-form-v-travel-group
    if (!leader || !isCountrySelected(leader.countryId)) {
      return null;
    }
    const leaderCountry = leader
      ? (leader.postCode
      ? this.countries.find(
        (c) =>
          c.countryId === leader.countryId &&
          leader.postCode >= c.postCode.from &&
          leader.postCode < c.postCode.until
      )
      : null) ||
      (!leader.postCode
        ? this.countries.find((c) => c.countryId === leader.countryId)
        : null)
      : null;

    return leaderCountry;
  }

  public selectItem(id: ItemID): void {
    this.selectedItemId = id;
  }

  public setCountryValue(): void {
    const leader = this.group.leader;
    if (!leader || !isCountrySelected(leader.countryId)) {
      return;
    }
    const leaderCountryDetails = this.getLeaderCountryDetails(leader);
    if (leaderCountryDetails) {
      this.guests.forEach(guest => {
        if (isCountrySelected(guest.countryId)) {
          return;
        }
        guest.countryId = +leaderCountryDetails.countryId;
        guest.rfcId = +leaderCountryDetails.value;
      });
    }
  }

  public clear(index: number): void {
    if (this.guests.length > 1) {
      this.guests.splice(index, 1);
    }
  }

  public changeLeader(currentLeader: GuestDetail): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.MW_ChangeTourleader', ChooseGuestComponent);

    modalData.modalBody.leaderGuest = currentLeader;
    modalData.modalBody.multiple = false;
    modalData.modal.save.subscribe(() => {
      const [newLeader] = modalData.modalBody.selectedGuests;
      newLeader.guestTypeId = this.allGuestTypes.tourGuide.value;
      this.group.leader = newLeader;
      modalData.modal.close(true);
    });
  }

  public onSave(): void {
    if (this.getNumberOfPersons() > this.numberOfPersons) {
      const classes: string[] = ['error'];
      this.modal.openSimpleText('BackEnd_WikiLanguage.MW_MoreGuestErrorMsg', undefined, {
        classes,
        disableClose: true,
      });
      return;
    }

    this.guests = groupGuestsByTypeAndCountry(this.guests);
    this.guests.forEach((g, i) => {
      if (g.count === null || g.count === 0) {
        this.guests.splice(i, 1);
      }
    });
    this.save.emit({ leader: this.group.leader, guests: this.guests });
  }

  private getNumberOfPersons(guests?: GroupGuest[]): number {
    let count = 0;
    if (!guests) {
      guests = this.guests;
    }
    guests.forEach((g) => {
      if (g.count) {
        count += g.count;
      }
    });
    return count;
  }

  private addGuestRow() {
    if (this.guests) {
      this.guests.push({
        count: 0,
        countryId: null,
        taxTypeId: null,
        registrationFormId: this.registrationFormId || null,
        registrationFormCountryExternalId: null,
        rfcId: null,
      });
    }
  }

  public setGroupGuestCountryId(groupGuest: GroupGuest) {
    groupGuest.countryId = groupGuest.rfcId ? +groupGuest.rfcId : null;
  }

  @Loading(LoaderType.LOAD)
  async ngOnChanges({ group }: SimpleChanges): Promise<void> {
    this.allGuestTypes = await this.cacheService.getGuestTypes();

    if (group && group.currentValue && group.currentValue.leader) {
      group.currentValue.leader.guestTypeId = +this.allGuestTypes.tourGuide.value;
    }

    if (!this.taxTypes || !this.countries) {
      [this.taxTypes, this.countries] = await Promise.all([
        this.cacheService.getRegistrationTaxTypes(this.regFormService.hotel.id, true, false, true),
        this.cacheService.getCountriesForGuestGroups(this.regFormService.hotel.id)
      ]);
    }

    if (group && group.currentValue !== group.previousValue) {
      this.numberOfPersons = this.regFormService.linkedGuestsCount;
      const guestsIncLeader: GroupGuest[] = [...this.group.guests];
      // here the leader must also be included
      // but it will only be added if the reg form has not already been saved
      // in case of a saved reg form the leader is already included in the incoming object
      if (group.currentValue.leader && !this.registrationFormId && this.numberOfPersons === this.getNumberOfPersons(guestsIncLeader) + 1) {
        const leaderCountryDetails = this.getLeaderCountryDetails(group.currentValue.leader);
        guestsIncLeader.unshift({
          count: 1,
          countryId: group.currentValue.leader.countryId,
          taxTypeId: group.currentValue.leader.taxTypeId,
          registrationFormId: this.registrationFormId || null,
          registrationFormCountryExternalId: null,
          rfcId: leaderCountryDetails ? leaderCountryDetails.value : null,
        });
      }
      this.guests = guestsIncLeader;
      this.setCountryValue();
      this.guests = groupGuestsByTypeAndCountry(this.guests);
      this.addGuestRow();
    }
  }
}
