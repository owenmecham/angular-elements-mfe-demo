import { OverlayContainer } from '@angular/cdk/overlay';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslocoConfig, TranslocoModule, TRANSLOCO_CONFIG } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { NgxMaskModule } from 'ngx-mask';
import { environment } from '../environments/environment';
import { ThemeModule } from '../theme/theme.module';
import { AnnouncementOptionsFilterPipe } from './announcements/announcement-options-filter.pipe';
import { CustomAnnouncementComponent } from './announcements/custom/custom-announcement.component';
import { CustomAnnouncementService } from './announcements/custom/custom-announcement.service';
import { InventoryAnnouncementService } from './announcements/inventory/inventory-announcement.service';
import { InventorySelectComponent } from './announcements/inventory/select/inventory-select.component';
import { AnnouncementsListComponent } from './announcements/list/announcements-list.component';
import { ReadOnlyListComponent } from './announcements/list/read-only-list/read-only-list.component';
import { MvdaAnnouncementService } from './announcements/mvda/mvda-announcement.service';
import { MvdaDeleteComponent } from './announcements/mvda/mvda-delete.component';
import { ConvertFormatToMaskPipe } from './announcements/mvda/select/convert-format-to-mask.pipe';
import { MvdaAddComponent } from './announcements/mvda/select/mvda-add.component';
import { MvdaSelectComponent } from './announcements/mvda/select/mvda-select.component';
import { VehicleSelectComponent } from './announcements/vehicle/select/vehicle-select.component';
import { VehicleAnnouncementService } from './announcements/vehicle/vehicle-announcement.service';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppOverlayContainer } from './custom-overlay-container';
import { MrcleanMagicViewComponent } from './mrclean-magic-view.component';
import { ErrorHandlerService } from './shared/error-handler.service';
import { SettingsService } from './shared/settings.service';
import { translocoLoader } from './transloco.loader';

@NgModule({
  declarations: [
    AppComponent,
    AnnouncementsListComponent,
    VehicleSelectComponent,
    AnnouncementOptionsFilterPipe,
    InventorySelectComponent,
    CustomAnnouncementComponent,
    MvdaSelectComponent,
    MvdaAddComponent,
    MvdaDeleteComponent,
    ConvertFormatToMaskPipe,
    ReadOnlyListComponent,
    MrcleanMagicViewComponent,
  ],
  imports: [
    HttpClientModule,
    RouterModule.forRoot([], {
      onSameUrlNavigation: 'reload',
      paramsInheritanceStrategy: 'always',
    }),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ThemeModule,
    FormsModule,
    NgxMaskModule.forRoot({}),
    TranslocoModule,
    TranslocoLocaleModule.init(),
  ],
  providers: [
    { provide: OverlayContainer, useClass: AppOverlayContainer },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    SettingsService,
    AppService,
    VehicleAnnouncementService,
    InventoryAnnouncementService,
    CustomAnnouncementService,
    MvdaAnnouncementService,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: [
          { id: 'en-us', label: 'English' },
          { id: 'fr-ca', label: 'French' },
          { id: 'es-mx', label: 'Spanish' },
        ],
        defaultLang: 'en-us',
        reRenderOnLangChange: true,
        listenToLangChange: true,
        prodMode: environment.production,
      } as TranslocoConfig,
    },
    translocoLoader,
    CurrencyPipe,
  ],
  entryComponents: [AppComponent, MvdaAddComponent, MvdaDeleteComponent, MrcleanMagicViewComponent],
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const appComponent = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    const appViewComponent = createCustomElement(MrcleanMagicViewComponent, {
      injector: this.injector,
    });

    customElements.define('mrclean-magic', appComponent);
    customElements.define('mrclean-magic-view', appViewComponent);
  }
}
