import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalContextService } from './external-context.service';
import { environment } from '../../environments/environment';

export enum ApiUrlType {
  Vehicle,
  Inventory,
}

@Injectable()
export class SettingsService {
  constructor(private externalContextService: ExternalContextService) {}

  getApiUrlByType(type: ApiUrlType): string {
    return type === ApiUrlType.Vehicle ? environment.vehicleUrl : environment.inventoryUrl;
  }

  createRequestOptions(
    param: any = null,
  ): {
    headers: HttpHeaders;
    params: { [param: string]: string };
    responseType: 'json';
    observe: 'body';
  } {
    const token = this.externalContextService.getToken();

    let headers = new HttpHeaders()
      .append('Cache-Control', 'no-cache') // IE 11 was aggressively caching GET requests
      .append('Pragma', 'no-cache');

    if (token) {
      headers = headers.append('ExternalContext', token);
    }

    const params = param ? this.convertToParamsObject(param) : null;

    return {
      headers,
      params,
      responseType: 'json',
      observe: 'body',
    };
  }

  createUrl(relativeUrl: string, type: ApiUrlType): string {
    const baseUrl = this.addTrailingSlashIfMissing(this.getApiUrlByType(type));

    return this.addQueryIfMissing(baseUrl + relativeUrl);
  }

  addTrailingSlashIfMissing(url: string) {
    return url.lastIndexOf('/') === url.length - 1 ? url : url + '/';
  }

  private addQueryIfMissing(uri: string) {
    return uri.includes('?') ? uri : uri + '?';
  }

  private convertToParamsObject(request: any): { [param: string]: string } {
    const keys = Object.keys(request);
    const params = {};

    keys.forEach((key) => {
      if (request[key] != null) {
        params[key] = request[key].toString();
      }
    });

    return params;
  }
}
