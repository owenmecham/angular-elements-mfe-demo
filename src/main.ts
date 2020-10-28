import './polyfills';
// polyfills needs to be imported first to bootstrap the micro-ui
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (customElements.get('adesa-announcements')) {
  console.warn('Adesa Announcements already defined -> nothing to do...');
} else {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.log(err));
}
