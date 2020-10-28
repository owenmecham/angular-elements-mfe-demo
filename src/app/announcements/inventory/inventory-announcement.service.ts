import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AppService } from '../../app.service';
import { ApiUrlType, SettingsService } from '../../shared/settings.service';
import { AnnouncementOption } from '../announcement-option';
import { filterAvailableAnnouncements } from '../announcements-functions';
import { EventDispatchService } from '../../shared/event-dispatch.service';
import { InventoryAnnouncement } from './inventory-announcement';
import { TranslationService } from '../../shared/translation.service';

@Injectable()
export class InventoryAnnouncementService implements OnDestroy {
  inventoryAnnouncementsList$: BehaviorSubject<InventoryAnnouncement[]> = new BehaviorSubject(null);
  filteredAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(null);
  availableAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(null);
  private inventoryId: number;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
    private settingsService: SettingsService,
    private eventDispatchService: EventDispatchService,
    private translationService: TranslationService,
  ) {
    this.appService.inventoryId$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (inventoryId) => {
        if (!inventoryId) {
          return;
        }
        this.inventoryId = inventoryId;
        this.refreshAnnouncements();
      },
      (error) => {
        throw error;
      },
    );

    combineLatest([this.inventoryAnnouncementsList$, this.availableAnnouncementOptions$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ([active, available]) => {
          this.filteredAnnouncementOptions$.next(filterAvailableAnnouncements(active, available));
        },
        (error) => {
          throw error;
        },
      );
  }

  addInventoryAnnouncement(announcement: AnnouncementOption): void {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.inventoryId}/specialAnnouncements`,
      ApiUrlType.Inventory,
    );

    const announcementId = announcement.id;
    this.httpClient
      .post<InventoryAnnouncement>(url, { announcementId }, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (resp) => {
          this.eventDispatchService.dispatchEvent('inventoryAnnouncementAdded', resp);
          this.refreshAnnouncements();
        },
        (error) => {
          announcement.isBeingAdded = false;
          throw error;
        },
      );
  }

  deleteInventoryAnnouncement(announcementId: number, announcementSequence: number): void {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.inventoryId}/specialAnnouncements/${announcementId}`,
      ApiUrlType.Inventory,
    );

    this.httpClient
      .delete(
        url,
        this.settingsService.createRequestOptions({ ['announcementSequence']: announcementSequence }),
      )
      .pipe(take(1))
      .subscribe(
        (_) => {
          this.eventDispatchService.dispatchEvent('inventoryAnnouncementDeleted', { id: announcementId });
          this.refreshAnnouncements();
        },
        (error) => {
          throw error;
        },
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  clearList(): void {
    this.inventoryAnnouncementsList$.next(null);
    this.filteredAnnouncementOptions$.next(null);
    this.availableAnnouncementOptions$.next(null);
  }

  refreshAnnouncements() {
    this.refreshAvailableAnnouncements();
    this.refreshInventoryAnnouncements();
  }

  refreshAvailableAnnouncements() {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.inventoryId}/availableSpecialAnnouncements`,
      ApiUrlType.Inventory,
    );

    this.httpClient
      .get<AnnouncementOption[]>(url, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (announcements) => {
          const translatedAndSortedAnnouncements = this.translationService.translateAndSortAnnouncementsByDescription(
            announcements,
          );
          this.availableAnnouncementOptions$.next(translatedAndSortedAnnouncements);
        },
        (error) => {
          throw error;
        },
      );
  }

  refreshInventoryAnnouncements() {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.inventoryId}/specialAnnouncements`,
      ApiUrlType.Inventory,
    );

    return this.httpClient
      .get<InventoryAnnouncement[]>(url, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (announcements) => {
          const sortedAnnouncements = this.translationService.translateAndSortAnnouncementsByDescription(
            announcements,
          );
          this.eventDispatchService.dispatchEvent('inventoryAnnouncementsUpdated', sortedAnnouncements);
          this.inventoryAnnouncementsList$.next(sortedAnnouncements);
        },
        (error) => {
          throw error;
        },
      );
  }
}
