import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private activeTheme = 'amp';
  private availableThemes: Array<string> = ['amp', 'portal'];

  constructor() {}

  setActiveTheme(name: string) {
    this.activeTheme = name;
  }

  getActiveTheme() {
    return this.availableThemes.find((i) => i === this.activeTheme);
  }
}
