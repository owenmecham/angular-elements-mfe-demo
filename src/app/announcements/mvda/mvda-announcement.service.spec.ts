import { AppService } from 'src/app/app.service';
import { of, BehaviorSubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { SettingsService } from 'src/app/shared/settings.service';
import { HttpClient } from '@angular/common/http';
import { MvdaAnnouncementService } from './mvda-announcement.service';
import { MvdaTextHelper } from './mvda-text-helper';
import { first } from 'rxjs/operators';
import { TranslationService } from '../../shared/translation.service';
import { MvdaAnnouncementOption } from './mvda-announcement-option';
import { ApiMvdaAnnouncement } from './api-mvda-announcement';
import { MvdaAnnouncement } from './mvda-announcement';

describe('MvdaAnnouncementServiceTests', () => {
  let subject: MvdaAnnouncementService;

  const appServiceStub: Partial<AppService> = {
    inventoryId$: new BehaviorSubject(1),
    vehicleId$: new BehaviorSubject(1),
  };

  const mvdaTextHelperStub = jasmine.createSpyObj('MvdaTextHelper', [
    'buildMvdaDisclosureText',
    'getMvdaDisclosureValues',
  ]);
  mvdaTextHelperStub.buildMvdaDisclosureText.and.returnValue(of(''));

  const httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const settingsServiceMock = jasmine.createSpyObj('SettingsService', [
    'createUrl',
    'createGetOptions',
    'createRequestOptions',
  ]);

  const translationServiceMock = jasmine.createSpyObj('TranslationService', [
    'translateAndSortAnnouncementsByDescription',
  ]);
  translationServiceMock.translateAndSortAnnouncementsByDescription.and.returnValue([]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MvdaAnnouncementService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: AppService, useValue: appServiceStub },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: MvdaTextHelper, useValue: mvdaTextHelperStub },
        { provide: TranslationService, useValue: translationServiceMock },
      ],
    });

    httpClientMock.get.and.returnValue(of([]));
    httpClientMock.post.and.returnValue(of({}));
    httpClientMock.delete.and.returnValue(of({}));

    subject = TestBed.inject(MvdaAnnouncementService);
  });

  describe('addMvdaAnnouncement Tests', () => {
    it('should raise mvda announcement added event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('mvdaAnnouncementAdded', eventSpy);

      subject.addMvdaAnnouncement({ id: 1, description: 'test', code: 'tst', customFields: [] }, {});

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('deleteMvdaAnnouncement Tests', () => {
    it('should raise mvda announcement deleted event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('mvdaAnnouncementDeleted', eventSpy);

      subject.deleteMvdaAnnouncement(1, 'testing');

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('setAnnouncementOptions Tests', () => {
    it('should translate and sort announcements alphabetically', () => {
      const translatedAndSortedAnnouncements: MvdaAnnouncementOption[] = [
        { description: 'XXX' } as MvdaAnnouncementOption,
        { description: 'YYY' } as MvdaAnnouncementOption,
      ];

      translationServiceMock.translateAndSortAnnouncementsByDescription.and.returnValue(
        translatedAndSortedAnnouncements,
      );

      const mvdaAnnouncements: MvdaAnnouncementOption[] = [
        { description: 'AAA' } as MvdaAnnouncementOption,
        { description: 'BBB' } as MvdaAnnouncementOption,
      ];

      subject.setAnnouncementOptions(mvdaAnnouncements);

      expect(translationServiceMock.translateAndSortAnnouncementsByDescription).toHaveBeenCalledWith(
        mvdaAnnouncements,
      );

      subject.announcementOptions$.pipe(first()).subscribe(
        (announcements) => {
          expect(announcements).toBe(translatedAndSortedAnnouncements);
        },
        (error) => {
          throw error;
        },
      );
    });
  });

  describe('setAssignedAnnouncements Tests', () => {
    it('should raise MVDA announcements updated event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('mvdaAnnouncementsUpdated', eventSpy);

      subject.setAssignedAnnouncements([], []);

      expect(eventSpy).toHaveBeenCalled();
    });

    it('should translate and sort mvda announcements alphabetically', () => {
      const translatedAndSortedAnnouncements: MvdaAnnouncement[] = [
        { description: 'XXX' } as MvdaAnnouncement,
        { description: 'YYY' } as MvdaAnnouncement,
      ];

      translationServiceMock.translateAndSortAnnouncementsByDescription.and.returnValue(
        translatedAndSortedAnnouncements,
      );

      const mvdaAnnouncements: ApiMvdaAnnouncement[] = [
        { description: 'TestA', display: 'Display A' } as ApiMvdaAnnouncement,
        { description: 'TestB', display: 'Display B' } as ApiMvdaAnnouncement,
      ];

      subject.setAssignedAnnouncements(mvdaAnnouncements, []);

      expect(translationServiceMock.translateAndSortAnnouncementsByDescription).toHaveBeenCalled();

      subject.mvdaAnnouncementsList$.pipe(first()).subscribe(
        (announcements) => {
          expect(announcements[0].description).toBe('XXX');
          expect(announcements[1].description).toBe('YYY');
        },
        (error) => {
          throw error;
        },
      );
    });
  });

  describe('clearList Tests', () => {
    it('should emit null after call to clearList', () => {
      subject.clearList();

      subject.mvdaAnnouncementsList$.subscribe(
        (announcements) => {
          expect(announcements).toBe(null);
        },
        (error) => {
          throw error;
        },
      );
    });
  });
});
