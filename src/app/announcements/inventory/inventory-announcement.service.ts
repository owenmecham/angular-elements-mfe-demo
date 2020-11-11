import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { TranslationService } from 'src/app/shared/translation.service';
import { EventDispatchService } from '../../shared/event-dispatch.service';
import { AnnouncementOption } from '../announcement-option';
import { filterAvailableAnnouncements } from '../announcements-functions';
import { InventoryAnnouncement } from './inventory-announcement';

@Injectable()
export class InventoryAnnouncementService implements OnDestroy {
  announcements: InventoryAnnouncement[] = [
    {
      description: 'ABS Defective',
      announcementId: 1,
      announcementSequence: 1,
      displayStatus: 'ABS Defective',
      inventoryId: 1,
    },
  ];

  availableJson: AnnouncementOption[] = [
    {
      id: 1,
      description: 'ABS Defective',
      isBeingAdded: false,
    },
    {
      id: 2,
      description: 'Odo Replaced',
      isBeingAdded: false,
    },
    {
      id: 3,
      description: 'Odo Rollback',
      isBeingAdded: false,
    },
  ];

  inventoryAnnouncementsList$: BehaviorSubject<InventoryAnnouncement[]> = new BehaviorSubject(
    this.announcements,
  );
  filteredAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(
    this.availableJson,
  );
  availableAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(
    this.availableJson,
  );
  private inventoryId = 1;
  private unsubscribe$ = new Subject<void>();

  constructor(
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
    this.announcements.push({
      description: announcement.description,
      announcementId: announcement.id,
      announcementSequence: 1,
      displayStatus: announcement.description,
      inventoryId: this.inventoryId,
    });
    announcement.isBeingAdded = false;
    this.eventDispatchService.dispatchEvent('inventoryAnnouncementAdded', announcement);
    this.refreshAnnouncements();
  }

  deleteInventoryAnnouncement(announcementId: number, announcementSequence: number): void {
    this.eventDispatchService.dispatchEvent('inventoryAnnouncementDeleted', {
      id: announcementId,
      sequence: announcementSequence,
    });
    this.announcements = this.announcements.filter(function(value) {
      return value.announcementId !== announcementId;
    });
    this.refreshAnnouncements();
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
    const translatedAndSortedAnnouncements = this.translationService.translateAndSortAnnouncementsByDescription(
      this.availableJson,
    );
    this.availableAnnouncementOptions$.next(translatedAndSortedAnnouncements);
  }

  refreshInventoryAnnouncements() {
    this.eventDispatchService.dispatchEvent('inventoryAnnouncementsUpdated', this.announcements);
    this.inventoryAnnouncementsList$.next(this.announcements);
  }
}
