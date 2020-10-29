import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../theme/theme.service';
import { CustomAnnouncementService } from './announcements/custom/custom-announcement.service';
import { InventoryAnnouncementService } from './announcements/inventory/inventory-announcement.service';
import { MvdaAnnouncementService } from './announcements/mvda/mvda-announcement.service';
import { VehicleAnnouncementService } from './announcements/vehicle/vehicle-announcement.service';
import { AppService } from './app.service';
import { auctionSites, Country } from './shared/auctionSites';
import { ExternalContextService } from './shared/external-context.service';

@Component({
  selector: 'mrclean-magic',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _auctionSiteId: number;
  private _inventoryId: number;
  private _siteThemeName = 'amp';
  private _adesaLocale = 'en-us';
  private _externalContextToken;

  @Input() set inventoryId(value: string) {
    this._inventoryId = Number(value);
    this.onInventoryChanged();
  }

  @Input() set auctionSiteId(value: string) {
    this._auctionSiteId = Number(value);
    this.onAuctionChanged();
  }

  @Input() set siteThemeName(value: string) {
    this._siteThemeName = value;
    this.onSiteThemeChanged();
  }

  @Input() set adesaLocale(value: string) {
    this._adesaLocale = value;
    this.adesaLocaleChanged();
  }

  @Input() set externalContextToken(value: string) {
    this._externalContextToken = value;
    this.externalContextTokenChanged();
  }

  readOnlyMode = true;
  private viewModeSet$ = new Subject<void>();
  canadianSite = false;

  constructor(
    private appService: AppService,
    private themeService: ThemeService,
    private vehicleAnnouncementService: VehicleAnnouncementService,
    private inventoryAnnouncementService: InventoryAnnouncementService,
    private customAnnouncementService: CustomAnnouncementService,
    private mvdaAnnouncementService: MvdaAnnouncementService,
    private translocoService: TranslocoService,
    private externalContextService: ExternalContextService,
  ) {}

  private setViewMode() {
    combineLatest([
      this.vehicleAnnouncementService.vehicleAnnouncementsList$,
      this.inventoryAnnouncementService.inventoryAnnouncementsList$,
      this.customAnnouncementService.customAnnouncementsList$,
      this.mvdaAnnouncementService.mvdaAnnouncementsList$,
    ])
      .pipe(takeUntil(this.viewModeSet$))
      .subscribe(
        ([vehicle, inventory, custom, mvda]) => {
          if (inventory && custom && (vehicle || mvda)) {
            this.readOnlyMode =
              inventory.length > 0 ||
              custom.length > 0 ||
              (!this.canadianSite && vehicle && vehicle.length > 0) ||
              (this.canadianSite && mvda && mvda.length > 0);

            this.viewModeSet$.next();
            this.viewModeSet$.complete();
          }
        },
        (error) => {
          throw error;
        },
      );
  }

  toggleReadOnlyMode() {
    this.readOnlyMode = !this.readOnlyMode;
  }

  ngOnInit() {
    if (this._auctionSiteId) {
      this.canadianSite = auctionSites[this._auctionSiteId] === Country.Canada;
    }
    if (this._externalContextToken) {
      this.externalContextTokenChanged();
    }

    if (this._siteThemeName) {
      this.onSiteThemeChanged();
    }

    if (this._inventoryId) {
      this.onInventoryChanged();
    }
    this.setViewMode();
  }

  private onInventoryChanged() {
    this.appService.setInventoryId(this._inventoryId);
  }

  private onAuctionChanged() {
    localStorage.setItem('auctionSiteId', this._auctionSiteId.toString());
    this.canadianSite = auctionSites[this._auctionSiteId] === Country.Canada;
  }

  private onSiteThemeChanged() {
    this.themeService.setActiveTheme(this._siteThemeName);
  }

  private adesaLocaleChanged() {
    this.translocoService.setActiveLang(this._adesaLocale);
  }

  private externalContextTokenChanged() {
    this.externalContextService.setToken(this._externalContextToken);
  }

  ngOnDestroy(): void {
    this.vehicleAnnouncementService.clearList();
    this.mvdaAnnouncementService.clearList();
    this.inventoryAnnouncementService.clearList();
    this.customAnnouncementService.clearList();
  }
}
