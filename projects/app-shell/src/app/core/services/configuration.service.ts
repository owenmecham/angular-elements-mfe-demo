import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfigurationService {
  config: any;

  constructor(private readonly _location: Location) {}

  load(): Promise<any> {
    const promise = ajax(this._location.prepareExternalUrl('/settings.json'))
      .pipe(map(this.extractData))
      .toPromise();

    promise.then((config) => {
      this.config = config;
    });

    return promise;
  }

  private extractData(data) {
    const body = data.response;
    return body || {};
  }
}
