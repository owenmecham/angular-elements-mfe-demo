import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { EventDispatchService } from '../../shared/event-dispatch.service';
import { TranslationService } from '../../shared/translation.service';
import { CustomAnnouncement } from './custom-announcement';

@Injectable()
export class CustomAnnouncementService implements OnDestroy {
  announcements: CustomAnnouncement[] = [];
  customAnnouncementsList$: BehaviorSubject<CustomAnnouncement[]> = new BehaviorSubject(null);
  private unsubscribe$ = new Subject<void>();
  inventoryId: number;
  counter = 0;

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
        this.refreshCustomAnnouncements();
      },
      (error) => {
        throw error;
      },
    );
  }

  addCustomAnnouncement(description: string): void {
    this.announcements.push({
      description: description,
      inventoryId: this.inventoryId,
      displayStatus: description,
      announcementId: this.counter++,
    });
    this.eventDispatchService.dispatchEvent('customAnnouncementAdded', description);
    this.refreshCustomAnnouncements();
  }

  deleteCustomAnnouncement(announcementId: number): void {
    this.announcements = this.announcements.filter(function(value) {
      return value.announcementId !== announcementId;
    });
    this.eventDispatchService.dispatchEvent('customAnnouncementDeleted', { id: announcementId });
    this.refreshCustomAnnouncements();
  }

  refreshCustomAnnouncements(): void {
    const sortedAnnouncements = this.translationService.sortAnnouncementsByDescription(this.announcements);
    this.eventDispatchService.dispatchEvent('customAnnouncementsUpdated', sortedAnnouncements);
    this.customAnnouncementsList$.next(sortedAnnouncements);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  clearList(): void {
    this.customAnnouncementsList$.next(null);
  }
}
