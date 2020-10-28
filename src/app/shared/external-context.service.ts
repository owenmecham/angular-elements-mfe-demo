import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExternalContextService {
  private token;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token && this.token.length > 0 ? this.token : null;
  }
}
