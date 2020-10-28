import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

import { EventDispatchService } from '../../shared/event-dispatch.service';
import { ApiUrlType, SettingsService } from '../../shared/settings.service';

import { CustomAnnouncement } from './custom-announcement';
import { TranslationService } from '../../shared/translation.service';

@Injectable()
export class CustomAnnouncementService implements OnDestroy {
  customAnnouncementsList$: BehaviorSubject<CustomAnnouncement[]> = new BehaviorSubject(null);
  private unsubscribe$ = new Subject<void>();
  inventoryId: number;

  constructor(
    private httpClient: HttpClient,
    private settingsService: SettingsService,
    private appService: AppService,
    private eventDispatchService: EventDispatchService,
    private translationService: TranslationService,
  ) {
    this.appService.inventoryId$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (inventoryId) => {
        if (!inventoryId) {
          return;
        }
        this.inventoryId = inventoryId;
        this.refreshCustomAnnouncements();
      },
      (error) => {
        throw error;
      },
    );
  }

  addCustomAnnouncement(description: string): void {
    const url = this.settingsService.createUrl(
      'vehicles/v1/' + this.inventoryId + '/customAnnouncements',
      ApiUrlType.Inventory,
    );
    this.httpClient
      .post<CustomAnnouncement>(url, { description }, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (resp) => {
          this.eventDispatchService.dispatchEvent('customAnnouncementAdded', resp);
          this.refreshCustomAnnouncements();
        },
        (error) => {
          throw error;
        },
      );
  }

  deleteCustomAnnouncement(announcementId: number): void {
    const url = this.settingsService.createUrl(
      'vehicles/v1/' + this.inventoryId + '/customAnnouncements/' + announcementId,
      ApiUrlType.Inventory,
    );
    this.httpClient
      .delete(url, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (_) => {
          this.eventDispatchService.dispatchEvent('customAnnouncementDeleted', { id: announcementId });
          this.refreshCustomAnnouncements();
        },
        (error) => {
          throw error;
        },
      );
  }

  refreshCustomAnnouncements(): void {
    const url = this.settingsService.createUrl(
      'vehicles/v1/' + this.inventoryId + '/customAnnouncements',
      ApiUrlType.Inventory,
    );
    this.httpClient
      .get<CustomAnnouncement[]>(url, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (announcements) => {
          const sortedAnnouncements = this.translationService.sortAnnouncementsByDescription(announcements);
          this.eventDispatchService.dispatchEvent('customAnnouncementsUpdated', sortedAnnouncements);
          this.customAnnouncementsList$.next(sortedAnnouncements);
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
    this.customAnnouncementsList$.next(null);
  }
}
