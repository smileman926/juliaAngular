import { WindowPosition } from '@/app/main/window/models';
import { environment } from '@/environments/environment';
import { count } from 'rxjs/operators';

interface Sizes { width: number; height: number; }

export function calculatePositionOfMinimized(index: number, block: Sizes, bounds: Sizes): WindowPosition {
    const row = 1 + Math.floor(block.width / bounds.width * index);

    return {
        x: (index * block.width) % bounds.width,
        y: bounds.height - block.height * row
    };
}

export function redirectWithPOST(url: string, variables: { [key: string]: string }): void {
    const form = document.createElement('form');

    form.setAttribute('action', url);
    form.setAttribute('method', 'post');
    form.setAttribute('target', '_blank');
    form.setAttribute('style', 'display: none');
    document.body.appendChild(form);

    Object.keys(variables).forEach(name => {
        const el = document.createElement('input');

        el.setAttribute('type', 'password');
        el.setAttribute('name', name);
        el.value = variables[name];

        form.appendChild(el);
    });

    form.submit();
    form.remove();
}

export function getUrlFromPath(path: string): string {
  const baseUrl = environment.remoteUrl.replace(/\/$/, '');
  const relativeUrl = path.replace(/^\/var\/www\/html/, '');
  return baseUrl + relativeUrl;
}

export function getUrl(
  url: string,
  baseUrl?: string,
): string {
  if (!baseUrl) {
    baseUrl = environment.remoteUrl;
  }
  if (baseUrl.match(/\/$/) && url.match(/^\//)) {
    baseUrl = baseUrl.replace(/\/$/, '');
  } else if (baseUrl !== '' && !baseUrl.match(/\/$/) && url !== '' && !url.match(/^\//)) {
    url = '/' + url;
  }
  return baseUrl + url;
}

export function getLegacyContentUrl(
  url: string,
  parameters: {cid: number | undefined, lid: number, [key: string]: string | number | null | undefined},
  hash?: string
): string {
  const baseUrl = getUrl(url, environment.legacyContentUrl);
  return buildUrl(baseUrl, parameters, hash);
}

export function buildUrl(
  baseUrl: string,
  parameters: {[key: string]: string | number | null | undefined},
  hash?: string
): string {
  const delimiter = baseUrl.match(/\?/) ? '&' : '?';
  const queryString = Object.keys(parameters).filter(key => parameters.hasOwnProperty(key)).map(key => {
    if (parameters[key] === null) {
      return key;
    }
    return key + '=' + parameters[key];
  }).join('&');
  if (hash && hash !== '' && !hash.match(/^#/)) {
    hash = '#' + hash;
  }
  if (!hash) {
    hash = '';
  }
  return `${baseUrl}${delimiter}${queryString}${hash}`;
}

export function isCountrySelected(countryId: number | null | undefined): boolean {
  return !(
    countryId === 247 // 247 = empty country
    || countryId === null
    || countryId === undefined
    || isNaN(countryId)
  );
}
