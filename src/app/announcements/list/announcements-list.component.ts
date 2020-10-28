import { NgZone, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CustomAnnouncement } from '../custom/custom-announcement';
import { CustomAnnouncementService } from '../custom/custom-announcement.service';
import { InventoryAnnouncement } from '../inventory/inventory-announcement';
import { InventoryAnnouncementService } from '../inventory/inventory-announcement.service';
import { VehicleAnnouncement } from '../vehicle/vehicle-announcement';
import { VehicleAnnouncementService } from '../vehicle/vehicle-announcement.service';
import { MvdaAnnouncementService } from '../mvda/mvda-announcement.service';
import { MvdaAnnouncement } from '../mvda/mvda-announcement';
import { ThemeService } from '../../../theme/theme.service';
import { MvdaDeleteComponent } from '../mvda/mvda-delete.component';

@Component({
  selector: 'adesa-announcements-list',
  templateUrl: './announcements-list.component.html',
  styleUrls: ['./announcements-list.component.scss'],
})
export class AnnouncementsListComponent implements OnInit, OnDestroy {
  vehicleAnnouncements: VehicleAnnouncement[];
  inventoryAnnouncements: InventoryAnnouncement[];
  customAnnouncements: CustomAnnouncement[];
  mvdaAnnouncements: MvdaAnnouncement[];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private vehicleAnnouncementService: VehicleAnnouncementService,
    private inventoryAnnouncementService: InventoryAnnouncementService,
    private customAnnouncementService: CustomAnnouncementService,
    private mvdaAnnouncementService: MvdaAnnouncementService,
    public themeService: ThemeService,
    private dialog: MatDialog,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.vehicleAnnouncementService.vehicleAnnouncementsList$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (vehicleAnnouncements) => {
        this.zone.run(() => (this.vehicleAnnouncements = vehicleAnnouncements));
      },
      (error) => {
        throw error;
      },
    );

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

    this.customAnnouncementService.customAnnouncementsList$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (customAnnouncements) => {
        this.zone.run(() => (this.customAnnouncements = customAnnouncements));
      },
      (error) => {
        throw error;
      },
    );

    this.mvdaAnnouncementService.mvdaAnnouncementsList$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (mvdaAnnouncements) => {
        this.zone.run(() => (this.mvdaAnnouncements = mvdaAnnouncements));
      },
      (error) => {
        throw error;
      },
    );
  }

  removeVehicleAnnouncement(announcement: VehicleAnnouncement): void {
    announcement.displayStatus = 'deleting';
    this.vehicleAnnouncementService.deleteVehicleAnnouncement(
      announcement.announcementId,
      announcement.announcementSequence,
    );
  }

  removeMvdaAnnouncement(announcement: MvdaAnnouncement): void {
    const dialogRef = this.dialog.open(MvdaDeleteComponent, { data: announcement });

    dialogRef.afterClosed().subscribe(
      (deleteReason) => {
        if (deleteReason) {
          announcement.displayStatus = 'deleting';
          this.mvdaAnnouncementService.deleteMvdaAnnouncement(
            announcement.customAnnouncementId,
            deleteReason,
          );
        }
      },
      (error) => {
        throw error;
      },
    );
  }

  removeCustomAnnouncement(announcement: CustomAnnouncement) {
    announcement.displayStatus = 'deleting';
    this.customAnnouncementService.deleteCustomAnnouncement(announcement.announcementId);
  }

  removeInventoryAnnouncement(announcement: InventoryAnnouncement): void {
    announcement.displayStatus = 'deleting';
    this.inventoryAnnouncementService.deleteInventoryAnnouncement(
      announcement.announcementId,
      announcement.announcementSequence,
    );
  }

  trackFnc(index) {
    return index;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
