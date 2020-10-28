import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AnnouncementOption } from '../../announcement-option';
import { VehicleAnnouncementService } from '../vehicle-announcement.service';
import { ThemeService } from '../../../../theme/theme.service';

@Component({
  selector: 'adesa-vehicle-select',
  templateUrl: './vehicle-select.component.html',
  styleUrls: ['./vehicle-select.component.scss'],
})
export class VehicleSelectComponent implements OnInit, OnDestroy {
  announcements: AnnouncementOption[];
  searchValue: string;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private vehicleAnnouncementService: VehicleAnnouncementService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.vehicleAnnouncementService.filteredAnnouncementOptions$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (announcements) => {
        this.announcements = announcements;
      },
      (error) => {
        throw error;
      },
    );
  }

  addAnnouncement(announcement: AnnouncementOption): void {
    this.vehicleAnnouncementService.addVehicleAnnouncement(announcement);
    this.searchValue = null;
    announcement.isBeingAdded = true;
  }

  trackFnc(index) {
    return index;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
