import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventDispatchService } from '../../shared/event-dispatch.service';
import { TranslationService } from '../../shared/translation.service';
import { AnnouncementOption } from '../announcement-option';
import { filterAvailableAnnouncements } from '../announcements-functions';
import { InventoryAnnouncement } from './inventory-announcement';

@Injectable()
export class InventoryAnnouncementService implements OnDestroy {
  sampleJson: InventoryAnnouncement[] = [
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
  ];

  inventoryAnnouncementsList$: BehaviorSubject<InventoryAnnouncement[]> = new BehaviorSubject(
    this.sampleJson,
  );
  filteredAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(
    this.availableJson,
  );
  availableAnnouncementOptions$: BehaviorSubject<AnnouncementOption[]> = new BehaviorSubject(
    this.availableJson,
  );
  // private inventoryId = 1;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private eventDispatchService: EventDispatchService,
    private translationService: TranslationService,
  ) {
    // this.inventoryId = 1;
    this.refreshAnnouncements();

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
    this.eventDispatchService.dispatchEvent('inventoryAnnouncementAdded', announcement);
    this.refreshAnnouncements();
  }

  deleteInventoryAnnouncement(announcementId: number, announcementSequence: number): void {
    this.eventDispatchService.dispatchEvent('inventoryAnnouncementDeleted', {
      id: announcementId,
      sequence: announcementSequence,
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
    of(this.availableJson).subscribe(
      (announcements) => {
        const translatedAndSortedAnnouncements = announcements;
        this.availableAnnouncementOptions$.next(translatedAndSortedAnnouncements);
      },
      (error) => {
        throw error;
      },
    );
  }

  refreshInventoryAnnouncements() {
    return of(this.sampleJson).subscribe(
      (announcements) => {
        const sortedAnnouncements = announcements;
        this.eventDispatchService.dispatchEvent('inventoryAnnouncementsUpdated', sortedAnnouncements);
        this.inventoryAnnouncementsList$.next(sortedAnnouncements);
      },
      (error) => {
        throw error;
      },
    );
  }
}
