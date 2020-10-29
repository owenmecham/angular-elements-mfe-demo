import { AuctionService } from '@adesa/component-authorization';
import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomAnnouncement } from './announcements/custom/custom-announcement';
import { CustomAnnouncementService } from './announcements/custom/custom-announcement.service';
import { InventoryAnnouncement } from './announcements/inventory/inventory-announcement';
import { InventoryAnnouncementService } from './announcements/inventory/inventory-announcement.service';
import { MvdaAnnouncement } from './announcements/mvda/mvda-announcement';
import { MvdaAnnouncementService } from './announcements/mvda/mvda-announcement.service';
import { VehicleAnnouncement } from './announcements/vehicle/vehicle-announcement';
import { VehicleAnnouncementService } from './announcements/vehicle/vehicle-announcement.service';
import { AppService } from './app.service';
import { auctionSites, Country } from './shared/auctionSites';
import { ExternalContextService } from './shared/external-context.service';

@Component({
  selector: 'mrclean-magic-view',
  templateUrl: './mrclean-magic-view.component.html',
  styleUrls: ['./mrclean-magic-view.component.scss'],
})
export class AdesaAnnouncementsViewComponent implements OnInit, OnDestroy {
  private _auctionSiteId: number;
  private _inventoryId: number;
  private _adesaLocale = 'en-us';
  private _externalContextToken;
  private _hasEditPermission = 'true';

  @Input() set inventoryId(value: string) {
    this._inventoryId = Number(value);
    this.onInventoryChanged();
  }

  @Input() set auctionSiteId(value: string) {
    this._auctionSiteId = Number(value);
    this.onAuctionChanged();
  }

  @Input() set adesaLocale(value: string) {
    this._adesaLocale = value;
    this.adesaLocaleChanged();
  }

  @Input() set externalContextToken(value: string) {
    this._externalContextToken = value;
    this.externalContextTokenChanged();
  }

  @Input() set hasEditPermission(value: string) {
    this._hasEditPermission = value;
  }
  get hasEditPermission(): string {
    return this._hasEditPermission;
  }

  vehicleAnnouncements: VehicleAnnouncement[];
  inventoryAnnouncements: InventoryAnnouncement[];
  customAnnouncements: CustomAnnouncement[];
  mvdaAnnouncements: MvdaAnnouncement[];

  private canadianSite = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private appService: AppService,
    private vehicleAnnouncementService: VehicleAnnouncementService,
    private inventoryAnnouncementService: InventoryAnnouncementService,
    private customAnnouncementService: CustomAnnouncementService,
    private mvdaAnnouncementService: MvdaAnnouncementService,
    private translocoService: TranslocoService,
    private externalContextService: ExternalContextService,
    private _auctionService: AuctionService,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    if (this._auctionSiteId) {
      this.canadianSite = auctionSites[this._auctionSiteId] === Country.Canada;
    }

    if (this._externalContextToken) {
      this.externalContextTokenChanged();
    }

    if (this._inventoryId) {
      this.onInventoryChanged();
    }

    if (this.auctionSiteId) {
      this.canadianSite = auctionSites[this.auctionSiteId] === Country.Canada;
    }

    this.initializeVehicleAnnouncements();
    this.initializeInventoryAnnouncements();
    this.initializeCustomAnnouncements();
    this.initializeMvdaAnnouncements();
  }

  private onInventoryChanged() {
    this.appService.setInventoryId(this._inventoryId);
  }

  private onAuctionChanged() {
    this._auctionService.setAuctionSiteId(this._auctionSiteId);
    this.canadianSite = auctionSites[this._auctionSiteId] === Country.Canada;
  }

  private adesaLocaleChanged() {
    this.translocoService.setActiveLang(this._adesaLocale);
  }

  private externalContextTokenChanged() {
    this.externalContextService.setToken(this._externalContextToken);
  }

  private initializeVehicleAnnouncements() {
    this.vehicleAnnouncementService.vehicleAnnouncementsList$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (vehicleAnnouncements) => {
        this.zone.run(() => (this.vehicleAnnouncements = vehicleAnnouncements));
      },
      (error) => {
        throw error;
      },
    );
  }

  private initializeInventoryAnnouncements() {
    this.inventoryAnnouncementService.inventoryAnnouncementsList$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (inventoryAnnouncements) => {
          this.zone.run(() => (this.inventoryAnnouncements = inventoryAnnouncements));
        },
        (error) => {
          throw error;
        },
      );
  }

  private initializeCustomAnnouncements() {
    this.customAnnouncementService.customAnnouncementsList$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (customAnnouncements) => {
        this.zone.run(() => (this.customAnnouncements = customAnnouncements));
      },
      (error) => {
        throw error;
      },
    );
  }

  private initializeMvdaAnnouncements() {
    this.mvdaAnnouncementService.mvdaAnnouncementsList$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (mvdaAnnouncements) => {
        this.zone.run(() => (this.mvdaAnnouncements = mvdaAnnouncements));
      },
      (error) => {
        throw error;
      },
    );
  }

  hasAnnouncements(): boolean {
    return (
      (!this.canadianSite && this.vehicleAnnouncements && this.vehicleAnnouncements.length > 0) ||
      (this.inventoryAnnouncements && this.inventoryAnnouncements.length > 0) ||
      (this.customAnnouncements && this.customAnnouncements.length > 0) ||
      (this.canadianSite && this.mvdaAnnouncements && this.mvdaAnnouncements.length > 0)
    );
  }

  toggleEditMode() {
    const event = new CustomEvent('editModeToggleUpdated', {
      bubbles: true,
      detail: this._hasEditPermission,
    });

    dispatchEvent(event);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.vehicleAnnouncementService.clearList();
    this.mvdaAnnouncementService.clearList();
    this.inventoryAnnouncementService.clearList();
    this.customAnnouncementService.clearList();
  }
}
