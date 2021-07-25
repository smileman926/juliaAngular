import { Country } from '@/app/main/models';

export function filterRealCountries<T extends Country>(countries: T[]): T[] {
  const filteredCountries = countries.filter(country => (
    country.c_name !== 'Unknown'
    && country.c_name !== ''
    && !country.c_name.match(/\-+/)
  ));
  return filteredCountries;
}

export function sortCountries<T extends Country>(countries: T[]): T[] {
  return countries.sort((country1, country2) => {
    if (country1.cl_name < country2.cl_name) {
      return -1;
    }
    if (country1.cl_name > country2.cl_name) {
      return 1;
    }
    return 0;
  });
}
