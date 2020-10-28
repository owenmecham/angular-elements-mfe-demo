import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

import { ApiUrlType, SettingsService } from '../../shared/settings.service';
import { AnnouncementOption } from '../announcement-option';
import { filterAvailableAnnouncements } from '../announcements-functions';
import { EventDispatchService } from '../../shared/event-dispatch.service';
import { VehicleAnnouncement } from './vehicle-announcement';
import { TranslationService } from '../../shared/translation.service';

@Injectable()
export class VehicleAnnouncementService implements OnDestroy {
  vehicleAnnouncementsList$: BehaviorSubject<VehicleAnnouncement[]> = new BehaviorSubject(null);
  filteredAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(null);
  availableAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(null);

  private vehicleId: number;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private httpClient: HttpClient,
    private settingsService: SettingsService,
    private appService: AppService,
    private eventDispatchService: EventDispatchService,
    private translationService: TranslationService,
  ) {
    this.appService.vehicleId$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (vehicleId) => {
        if (!vehicleId) {
          return;
        }
        this.vehicleId = vehicleId;
        this.refreshVehicleAnnouncements(vehicleId);
        this.refreshAvailableAnnouncements();
      },
      (error) => {
        throw error;
      },
    );

    combineLatest([this.vehicleAnnouncementsList$, this.availableAnnouncementOptions$])
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

  addVehicleAnnouncement(announcement: AnnouncementOption): void {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.vehicleId}/announcements`,
      ApiUrlType.Vehicle,
    );

    const announcementId = announcement.id;

    this.httpClient
      .post<VehicleAnnouncement>(url, { announcementId }, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (resp) => {
          this.eventDispatchService.dispatchEvent('vehicleAnnouncementAdded', resp);
          this.refreshVehicleAnnouncements(this.vehicleId);
          this.refreshAvailableAnnouncements();
        },
        (error) => {
          announcement.isBeingAdded = false;
          throw error;
        },
      );
  }

  deleteVehicleAnnouncement(announcementId: number, announcementSequence: number): void {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.vehicleId}/announcements/${announcementId}`,
      ApiUrlType.Vehicle,
    );
    this.httpClient
      .delete(
        url,
        this.settingsService.createRequestOptions({ ['announcementSequence']: announcementSequence }),
      )
      .pipe(take(1))
      .subscribe(
        (_) => {
          this.eventDispatchService.dispatchEvent('vehicleAnnouncementDeleted', {
            id: announcementId,
          });

          this.refreshVehicleAnnouncements(this.vehicleId);
          this.refreshAvailableAnnouncements();
        },
        (error) => {
          throw error;
        },
      );
  }

  refreshAvailableAnnouncements() {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.vehicleId}/availableAnnouncements`,
      ApiUrlType.Vehicle,
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

  refreshVehicleAnnouncements(vehicleId: number): void {
    const url = this.settingsService.createUrl(`vehicles/v1/${vehicleId}/announcements`, ApiUrlType.Vehicle);
    this.httpClient
      .get<VehicleAnnouncement[]>(url, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (announcements) => {
          const sortedAnnouncements = this.translationService.translateAndSortAnnouncementsByDescription(
            announcements,
          );

          this.eventDispatchService.dispatchEvent('vehicleAnnouncementsUpdated', sortedAnnouncements);

          sortedAnnouncements.forEach((ann) => {
            ann.displayStatus = 'loaded';
          });
          this.vehicleAnnouncementsList$.next(sortedAnnouncements);
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
    this.vehicleAnnouncementsList$.next(null);
    this.filteredAnnouncementOptions$.next(null);
    this.availableAnnouncementOptions$.next(null);
  }
}
