import { groupBy, uniqBy } from 'lodash';

import { parseDate } from '@/app/helpers/date';
import {
  CateringEntity, PersonPricingEntity, Pricing, PricingAgeGroup, PricingConfig, PricingEntity, PricingEntityAgeGroup,
  PricingScheme, PricingSource, RawPricing, RawPricingBody, RawPricingConfig, RawPricingScheme, RawServiceType, ServiceType
} from './models';
import { calculateAdultsPrice } from './utils';

function reducePersonPricing(
  p: RawPricing['seasonPeriodEntityPrice'][0],
  personGroups: RawPricing['seasonPeriodEntityPrice'],
  ageGroupIdMap: Map<string, symbol>
): PersonPricingEntity {
  const ages: PricingEntity['ages'] = personGroups.map((groupItem: RawPricing['seasonPeriodEntityPrice'][0]) => {
    const from = +groupItem.spep_fromAge;
    const to = +groupItem.spep_toAge;
    return {
      id: getOrCreateAgeGroupId(from, to, ageGroupIdMap),
      from,
      to,
      price: +groupItem.spep_price
    };
  });
  const pr: PersonPricingEntity = {
    typeId: +p.spep_serviceType_id,
    seasonPeriodEntityId: +p.spep_seasonPeriodEntity_id,
    isStdPricePosition: p.spep_isStdPricePosition === 'on',
    adultPrice: calculateAdultsPrice(ages),
    percDiscount: +p.spep_percDiscount,
    personsNo: +p.spep_personsNo,
    ages: ages.filter(g => +g.from !== 18)
  };

  return pr;
}

function getOrCreateAgeGroupId(from: number, to: number, ageGroupIdMap: Map<string, symbol>): symbol {
  const key = from + '-' + to;
  const existingId = ageGroupIdMap.get(key);
  if (existingId) {
    return existingId;
  }
  const newId = Symbol('ageGroup');
  ageGroupIdMap.set(key, newId);
  return newId;
}

export function reducePricing(s: RawPricing): Pricing {
  const uniqCaterings = uniqBy(s.seasonPeriodEntityEntityGroupServiceType, c => c.speegst_serviceType_id);
  const groups = groupBy(s.seasonPeriodEntityEntityGroupServiceType, c => c.speegst_serviceType_id);
  const ageGroupIdMap = new Map<string, symbol>();

  const serviceTypeGroups: {[typeId: string]: RawPricing['seasonPeriodEntityPrice']} = groupBy(
    s.seasonPeriodEntityPrice, c => c.spep_serviceType_id
  );
  let stdAdultPrice = 0;
  if (s.seasonPeriodEntityPrice) {
    const adultPriceHelper = s.seasonPeriodEntityPrice.find((spep) =>
      +spep.spep_fromAge === 18 && spep.spep_isStdPricePosition === 'on'
    );
    if (adultPriceHelper) {
      stdAdultPrice = +adultPriceHelper.spep_price;
    }
  }

  const prices: {[typeId: string]: PersonPricingEntity[] } = {};
  Object.keys(serviceTypeGroups).map(typeId => {
    const groupByPersonNo: {[personNo: string]: RawPricing['seasonPeriodEntityPrice']} = groupBy(
      serviceTypeGroups[typeId], c => c.spep_personsNo
    );
    prices[typeId] = Object.values(groupByPersonNo).map(group => reducePersonPricing(group[0], group, ageGroupIdMap));
  });

  return {
    pricingSchemeId: +s.spe_pricingScheme_id,
    settings: {
      cleanUpPrice: +s.spe_cleanUpPrice,
      minPersons: +s.spe_minPersons,
      maxPersons: +s.spe_maxPersons,
      stdPricePosition: +s.spe_stdPricePosition,
      childDiscountStartPosition: +s.spe_childDiscountStartPosition,
      childUnderXForFree: +s.spe_childUnderXForfree,
    },
    stdAdultPrice,
    categoryName: s.egl_value,
    seasonPeriodId: +s.spe_seasonPeriodEntity_id,
    caterings: uniqCaterings.map((c: RawPricing['seasonPeriodEntityEntityGroupServiceType'][0]) => {
      const ages: PricingEntity['ages'] = groups[c.speegst_serviceType_id].map(
        (groupItem: RawPricing['seasonPeriodEntityEntityGroupServiceType'][0]) => {
          const from = +groupItem.speegst_fromAge;
          const to = +groupItem.speegst_toAge;
          return {
            id: getOrCreateAgeGroupId(from, to, ageGroupIdMap),
            from,
            to,
            price: +groupItem.speegst_price,
          };
        }
      );
      const cat: CateringEntity = {
        typeId: +c.speegst_serviceType_id,
        active: c.speegst_active === 'on',
        adultPrice: calculateAdultsPrice(ages),
        entityGroupId: +c.speegst_entityGroup_id,
        seasonPeriodEntityId: +c.speegst_seasonPeriodEntity_id,
        stdDisplayPrice: c.speegst_stdDisplayPrice === 'on',
        ages
      };
      return cat;
    }),
    ageGroups: s.ageGroup ? s.ageGroup.map(g => {
      const from = +g.spep_fromAge;
      const to = +g.spep_toAge;
      return {
        id: getOrCreateAgeGroupId(from, to, ageGroupIdMap),
        from,
        to,
        discount: +g.spep_percDiscount
      };
    }) : [],
    prices
  };
}

export function preparePricingBody(p: Pricing): RawPricingBody {
  const caterings: RawPricingBody['seasonPeriodEntityEntityGroupServiceType'] = p.caterings ? p.caterings.map(c => {
    return {
      speegst_active: c.active ? 'on' : 'off',
      speegst_stdDisplayPrice: c.stdDisplayPrice ? 'on' : 'off',
      st_id: String(c.typeId),
      adultPrice: c.adultPrice,
      ...convertAgesToObject(c.ages, p.ageGroups)
    };
  }) : [];
  const prices: RawPricingBody['pricing'] = [];
  Object.keys(p.prices).map(serviceTypeId => {
    const personsGroup = p.prices[serviceTypeId];
    personsGroup.forEach(persons => {
      if (persons.personsNo < p.settings.minPersons || persons.personsNo > p.settings.maxPersons) {
        return;
      }
      let personPrices = {
        isStdPricePosition: persons.isStdPricePosition ? 'on' : 'off',
        personsNo: String(persons.personsNo),
        adultPrice: String(persons.adultPrice),
        serviceTypeId: String(persons.typeId),
      };
      const fullPayer = p.settings.childDiscountStartPosition >= persons.personsNo;
      personPrices = {...personPrices, ...convertAgesToObject(persons.ages, p.ageGroups, true, fullPayer)};
      prices.push(personPrices);
    });
  });

  return {
    spe_pricingScheme_id: String(p.pricingSchemeId),
    spe_cleanUpPrice: String(p.settings.cleanUpPrice),
    spe_childUnderXForfree: String(p.settings.childUnderXForFree),
    spe_minPersons: String(p.settings.minPersons),
    spe_maxPersons: String(p.settings.maxPersons),
    spe_stdPricePosition: String(p.settings.stdPricePosition),
    spe_childDiscountStartPosition: String(p.settings.childDiscountStartPosition),
    seasonPeriodEntityEntityGroupServiceType: caterings,
    pricing: prices,
    ageGroup: null,
    spe_id: null,
    egl_value: p.categoryName,
    spe_seasonPeriodEntity_id: String(p.seasonPeriodId)
  };
}

function convertAgesToObject(
  entityAgeGroups: PricingEntityAgeGroup[],
  ageGroups: PricingAgeGroup[],
  appendPercent: boolean = false,
  fullPayer?: boolean,
): {[key: string]: string} {
  const filteredAgeGroups = ageGroups.filter(entityAgeGroup => !(entityAgeGroup.from === 18 && entityAgeGroup.to === 150));
  return filteredAgeGroups.reduce((ageGroupsObject, ageGroup) => {
    const priceStr = getAgeGroupPrice(ageGroup, entityAgeGroups, fullPayer);
    return {
      ...ageGroupsObject,
      [getAgeGroupObjectKey(ageGroup)]: priceStr + getAgeGroupPriceSuffix(ageGroup, ageGroups, appendPercent)
    };
  }, {});
}

function getAgeGroupPrice(
  ageGroup: PricingAgeGroup,
  entityAgeGroups: PricingEntityAgeGroup[],
  fullPayer?: boolean
): string {
  if (fullPayer) {
    return '0';
  }
  const entityAgeGroup = !fullPayer ? entityAgeGroups.find(searchAgeGroup => searchAgeGroup.id === ageGroup.id) : undefined;
  return (entityAgeGroup ? entityAgeGroup.price : 0).toString();
}

function getAgeGroupPriceSuffix(
  ageGroup: PricingAgeGroup,
  ageGroups: PricingAgeGroup[],
  appendPercent: boolean
): string {
  if (!appendPercent) {
    return '';
  }
  return `_${ageGroup.discount}`;
}

function getAgeGroupObjectKey(ageGroup: PricingAgeGroup): string {
  return 'ag' + ageGroup.from + '_' + ageGroup.to;
}

export function reducePricingScheme(s: RawPricingScheme): PricingScheme {
  return {
    id: +s.ps_id,
    // name is used in some static text comparisons to display features in age categories
    name: s.ps_name,
    nameLang: s.psl_name,
  };
}


export function reduceServiceType(s: RawServiceType): ServiceType {
  return {
    id: +s.st_id,
    name: s.stl_name,
    active: s.st_active === 'on'
  };
}

export function reducePricingConfig(p: RawPricingConfig): { period: PricingConfig, source: PricingConfig } {
  const reduceType = (prefix: 'sp_' | 'spe_'): PricingConfig => ({
    id: +p[`${prefix}id`],
    arrival: {
      monday: p[`${prefix}anMon`] === 'on',
      tuesday: p[`${prefix}anTue`] === 'on',
      wednesday: p[`${prefix}anWed`] === 'on',
      thursday: p[`${prefix}anThu`] === 'on',
      friday: p[`${prefix}anFri`] === 'on',
      saturday: p[`${prefix}anSat`] === 'on',
      sunday: p[`${prefix}anSun`] === 'on',
    },
    departure: {
      monday: p[`${prefix}abMon`] === 'on',
      tuesday: p[`${prefix}abTue`] === 'on',
      wednesday: p[`${prefix}abWed`] === 'on',
      thursday: p[`${prefix}abThu`] === 'on',
      friday: p[`${prefix}abFri`] === 'on',
      saturday: p[`${prefix}abSat`] === 'on',
      sunday: p[`${prefix}abSun`] === 'on',
    },
    allowBooking: p[`${prefix}allowBooking`] === 'on',
    allowEnquiry: p[`${prefix}allowEnquiry`] === 'on',
    allowReservation: p[`${prefix}allowReservation`] === 'on',
    fromDate: parseDate(p[`${prefix}fromDate`], false),
    untilDate: parseDate(p[`${prefix}untilDate`], false),
    maxStay: +p[`${prefix}maxStay`],
    minStay: +p[`${prefix}minStay`],
    useLongStayDiscount: p[`${prefix}useLongStayDiscount`] === 'on',
    useNightsMultiple: p[`${prefix}useNightsMultiple`] === 'on',
    finalCleanUp: +p[`${prefix}cleanUpPrice`]
  });

  return {
    period: reduceType('sp_'),
    source: reduceType('spe_')
  };
}

export function preparePricingConfigBody(c: PricingConfig, source: PricingSource) {
  return {
    spe_id: String(c.id),
    entityGroupUpdate: source.type === 'category' ? 'true' : 'false',
    updateForAllEntitiesOfThisGroup: false,
    spe_minStay: c.minStay,
    spe_maxStay: c.maxStay,
    spe_anMon: c.arrival.monday ? 'on' : 'off',
    spe_anTue: c.arrival.tuesday ? 'on' : 'off',
    spe_anWed: c.arrival.wednesday ? 'on' : 'off',
    spe_anThu: c.arrival.thursday ? 'on' : 'off',
    spe_anFri: c.arrival.friday ? 'on' : 'off',
    spe_anSat: c.arrival.saturday ? 'on' : 'off',
    spe_anSun: c.arrival.sunday ? 'on' : 'off',
    spe_abMon: c.departure.monday ? 'on' : 'off',
    spe_abTue: c.departure.tuesday ? 'on' : 'off',
    spe_abWed: c.departure.wednesday ? 'on' : 'off',
    spe_abThu: c.departure.thursday ? 'on' : 'off',
    spe_abFri: c.departure.friday ? 'on' : 'off',
    spe_abSat: c.departure.saturday ? 'on' : 'off',
    spe_abSun: c.departure.sunday ? 'on' : 'off',
    spe_useNightsMultiple: c.useNightsMultiple ? 'on' : 'off',
    spe_allowEnquiry: c.allowEnquiry ? 'on' : 'off',
    spe_allowReservation: c.allowReservation ? 'on' : 'off',
    spe_cleanUpPrice: c.finalCleanUp // TODO format number
  };
}
