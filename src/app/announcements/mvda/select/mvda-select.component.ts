import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MvdaAddComponent } from './mvda-add.component';
import { MvdaAnnouncementOption } from '../mvda-announcement-option';
import { MvdaAnnouncementService } from '../mvda-announcement.service';
import { ThemeService } from '../../../../theme/theme.service';

@Component({
  selector: 'adesa-mvda-select',
  templateUrl: './mvda-select.component.html',
  styleUrls: ['./mvda-select.component.scss'],
})
export class MvdaSelectComponent implements OnInit, OnDestroy {
  announcements: MvdaAnnouncementOption[];
  searchValue: string;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private mvdaAnnouncementService: MvdaAnnouncementService,
    private dialog: MatDialog,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.mvdaAnnouncementService.announcementOptions$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (announcements) => {
        this.announcements = announcements;
      },
      (error) => {
        throw error;
      },
    );
  }

  addAnnouncement(announcement: MvdaAnnouncementOption): void {
    const dialogRef = this.dialog.open(MvdaAddComponent, { data: announcement, disableClose: true });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.mvdaAnnouncementService.addMvdaAnnouncement(announcement, result);
        }
      },
      (error) => {
        throw error;
      },
    );
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
