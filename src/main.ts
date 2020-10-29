// polyfills needs to be imported first to bootstrap the micro-ui
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import './polyfills';

if (environment.production) {
  enableProdMode();
}

if (customElements.get('mrclean-magic')) {
  console.warn('MrClean Magic already defined -> nothing to do...');
} else {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.log(err));
}
