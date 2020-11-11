import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../../../theme/theme.service';
import { AnnouncementOption } from '../../announcement-option';
import { InventoryAnnouncementService } from '../inventory-announcement.service';

@Component({
  selector: 'adesa-inventory-select',
  templateUrl: './inventory-select.component.html',
  styleUrls: ['./inventory-select.component.scss'],
})
export class InventorySelectComponent implements OnInit, OnDestroy {
  announcements: AnnouncementOption[];
  searchValue: string;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private inventoryAnnouncementService: InventoryAnnouncementService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.inventoryAnnouncementService.filteredAnnouncementOptions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (announcements) => {
          this.announcements = announcements;
        },
        (error) => {
          throw error;
        },
      );
  }

  addAnnouncement(announcement: AnnouncementOption): void {
    announcement.isBeingAdded = true;
    this.inventoryAnnouncementService.addInventoryAnnouncement(announcement);
    this.searchValue = null;
  }

  trackFnc(index) {
    return index;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
