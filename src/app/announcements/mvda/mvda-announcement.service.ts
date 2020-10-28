import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { EventDispatchService } from '../../shared/event-dispatch.service';
import { SettingsService, ApiUrlType } from '../../shared/settings.service';
import { MvdaAnnouncement } from './mvda-announcement';
import { MvdaAnnouncementOption } from './mvda-announcement-option';
import { AppService } from 'src/app/app.service';
import { MvdaTextHelper } from './mvda-text-helper';
import { ApiMvdaAnnouncement } from './api-mvda-announcement';
import { TranslationService } from '../../shared/translation.service';

@Injectable()
export class MvdaAnnouncementService implements OnDestroy {
  mvdaAnnouncementsList$: BehaviorSubject<MvdaAnnouncement[]> = new BehaviorSubject(null);
  announcementOptions$: BehaviorSubject<MvdaAnnouncementOption[]> = new BehaviorSubject(null);

  inventoryId: number;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private httpClient: HttpClient,
    private settingsService: SettingsService,
    private appService: AppService,
    private eventDispatchService: EventDispatchService,
    private translationService: TranslationService,
    private mvdaTextHelper: MvdaTextHelper,
  ) {
    this.appService.inventoryId$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (inventoryId) => {
        if (!inventoryId) {
          return;
        }
        this.inventoryId = inventoryId;
        this.initializeAnnouncements();
      },
      (error) => {
        throw error;
      },
    );
  }

  private initializeAnnouncements(): void {
    const mvdaAnnouncements$ = forkJoin([this.getMvdaOptions(), this.getAssignedAnnouncements()]);

    mvdaAnnouncements$.pipe(take(1)).subscribe(
      (value) => {
        const mvdaOptions = value[0];
        this.setAnnouncementOptions(mvdaOptions);

        const assignedMvdas = value[1];
        this.setAssignedAnnouncements(assignedMvdas, mvdaOptions);
      },
      (error) => {
        throw error;
      },
    );
  }

  private getMvdaOptions(): Observable<MvdaAnnouncementOption[]> {
    const url = this.settingsService.createUrl('mvdaAnnouncements/v1', ApiUrlType.Inventory);
    return this.httpClient.get<MvdaAnnouncementOption[]>(url, this.settingsService.createRequestOptions());
  }

  private getAssignedAnnouncements(): Observable<ApiMvdaAnnouncement[]> {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.inventoryId}/mvdaAnnouncements/`,
      ApiUrlType.Inventory,
    );

    return this.httpClient.get<ApiMvdaAnnouncement[]>(url, this.settingsService.createRequestOptions());
  }

  setAnnouncementOptions(announcements: MvdaAnnouncementOption[]) {
    const sortedAnnouncements = this.translationService.translateAndSortAnnouncementsByDescription(
      announcements,
    );
    this.announcementOptions$.next(sortedAnnouncements);
  }

  setAssignedAnnouncements(
    assignedAnnouncements: ApiMvdaAnnouncement[],
    availableAnnouncements: MvdaAnnouncementOption[],
  ): void {
    const announcements = assignedAnnouncements.map((announcement) => {
      const mvdaOption = (availableAnnouncements || []).find(
        (option) => option.id === announcement.mvdaAnnouncementId,
      );

      return {
        customAnnouncementId: announcement.customAnnouncementId,
        displayStatus: announcement.displayStatus,
        description: announcement.display,
        longDescription: this.mvdaTextHelper.buildMvdaDisclosureText(mvdaOption, announcement),
        fieldValues: this.mvdaTextHelper.getMvdaDisclosureValues(mvdaOption, announcement.disclosureDetails),
      };
    });

    const translatedAnnouncements = this.translationService.translateAndSortAnnouncementsByDescription(
      announcements,
    );

    this.eventDispatchService.dispatchEvent('mvdaAnnouncementsUpdated', translatedAnnouncements);
    this.mvdaAnnouncementsList$.next(translatedAnnouncements);
  }

  addMvdaAnnouncement(announcement: MvdaAnnouncementOption, customFields: { [fieldName: string]: string }) {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.inventoryId}/mvdaAnnouncements`,
      ApiUrlType.Inventory,
    );

    const body = {
      mvdaAnnouncementId: announcement.id,
      mvdaDetails: {},
    };

    for (const field of Object.keys(customFields)) {
      body.mvdaDetails[field] = customFields[field];
    }

    this.httpClient
      .post(url, body, this.settingsService.createRequestOptions())
      .pipe(take(1))
      .subscribe(
        (resp) => {
          this.eventDispatchService.dispatchEvent('mvdaAnnouncementAdded', resp);
          this.refreshMvdaAnnouncements();
        },
        (error) => {
          if (error instanceof HttpErrorResponse && error.status === 409) {
            error.error.message = 'An announcement with those specifications already exists.';
          }
          throw error;
        },
      );
  }

  deleteMvdaAnnouncement(announcementId: number, deleteReason: string) {
    const url = this.settingsService.createUrl(
      `vehicles/v1/${this.inventoryId}/mvdaAnnouncements/${announcementId}`,
      ApiUrlType.Inventory,
    );

    this.httpClient
      .delete(url, this.settingsService.createRequestOptions({ invalidationReason: deleteReason }))
      .pipe(take(1))
      .subscribe(
        (_) => {
          this.eventDispatchService.dispatchEvent('mvdaAnnouncementDeleted', { id: announcementId });
          this.refreshMvdaAnnouncements();
        },
        (error) => {
          throw error;
        },
      );
  }

  private refreshMvdaAnnouncements(): void {
    const announcements$ = forkJoin([
      this.getAssignedAnnouncements(),
      this.announcementOptions$.pipe(take(1)),
    ]);

    announcements$.pipe(take(1)).subscribe(
      (value) => {
        this.setAssignedAnnouncements(value[0], value[1]);
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
    this.mvdaAnnouncementsList$.next(null);
    this.announcementOptions$.next(null);
  }
}
