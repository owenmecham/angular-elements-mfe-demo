import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { EventDispatchService } from '../../shared/event-dispatch.service';
import { SettingsService } from '../../shared/settings.service';
import { TranslationService } from '../../shared/translation.service';
import { AnnouncementOption } from '../announcement-option';
import { filterAvailableAnnouncements } from '../announcements-functions';
import { VehicleAnnouncement } from './vehicle-announcement';

@Injectable()
export class VehicleAnnouncementService implements OnDestroy {
  announcements: VehicleAnnouncement[] = [
    {
      description: 'Frame/Unibody Damage',
      announcementId: 1,
      announcementSequence: 1,
      displayStatus: 'Frame/Unibody Damage',
    },
  ];

  availableJson: AnnouncementOption[] = [
    {
      id: 1,
      description: 'Frame/Unibody Damage',
      isBeingAdded: false,
    },
    {
      id: 2,
      description: 'Municipal Vehicle',
      isBeingAdded: false,
    },
    {
      id: 3,
      description: 'Salvage Vehicles',
      isBeingAdded: false,
    },
  ];

  vehicleAnnouncementsList$: BehaviorSubject<VehicleAnnouncement[]> = new BehaviorSubject(this.announcements);
  filteredAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(
    this.availableJson,
  );
  availableAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(
    this.availableJson,
  );

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
        this.refreshVehicleAnnouncements();
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
    this.announcements.push({
      description: announcement.description,
      announcementId: announcement.id,
      announcementSequence: 1,
      displayStatus: announcement.description,
    });
    announcement.isBeingAdded = false;
    this.eventDispatchService.dispatchEvent('vehicleAnnouncementAdded', announcement);

    this.refreshVehicleAnnouncements();
    this.refreshAvailableAnnouncements();
  }

  deleteVehicleAnnouncement(announcementId: number, announcementSequence: number): void {
    this.announcements = this.announcements.filter(function(value) {
      return value.announcementId !== announcementId;
    });
    this.eventDispatchService.dispatchEvent('vehicleAnnouncementDeleted', {
      id: announcementId,
      sequence: announcementSequence,
    });

    this.refreshVehicleAnnouncements();
    this.refreshAvailableAnnouncements();
  }

  refreshAvailableAnnouncements() {
    const translatedAndSortedAnnouncements = this.translationService.translateAndSortAnnouncementsByDescription(
      this.availableJson,
    );
    this.availableAnnouncementOptions$.next(translatedAndSortedAnnouncements);
  }

  refreshVehicleAnnouncements(): void {
    this.eventDispatchService.dispatchEvent('vehicleAnnouncementsUpdated', this.announcements);

    this.announcements.forEach((ann) => {
      ann.displayStatus = 'loaded';
    });
    this.vehicleAnnouncementsList$.next(this.announcements);
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
