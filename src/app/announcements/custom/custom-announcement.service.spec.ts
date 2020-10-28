import { AppService } from 'src/app/app.service';
import { of, BehaviorSubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { SettingsService } from 'src/app/shared/settings.service';
import { HttpClient } from '@angular/common/http';
import { CustomAnnouncementService } from './custom-announcement.service';
import { TranslationService } from '../../shared/translation.service';

describe('CustomAnnouncementServiceTests', () => {
  let subject: CustomAnnouncementService;

  const appServiceStub: Partial<AppService> = {
    inventoryId$: new BehaviorSubject(1),
    vehicleId$: new BehaviorSubject(1),
  };

  const httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const settingsServiceMock = jasmine.createSpyObj('SettingsService', [
    'createUrl',
    'createGetOptions',
    'createRequestOptions',
  ]);

  const translationServiceMock = jasmine.createSpyObj('TranslationService', [
    'sortAnnouncementsByDescription',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomAnnouncementService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: AppService, useValue: appServiceStub },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: TranslationService, useValue: translationServiceMock },
      ],
    });

    httpClientMock.get.and.returnValue(of([]));
    httpClientMock.post.and.returnValue(of({}));
    httpClientMock.delete.and.returnValue(of({}));

    subject = TestBed.inject(CustomAnnouncementService);
  });

  describe('addCustomAnnouncement Tests', () => {
    it('should raise customAnnouncementAdded event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('customAnnouncementAdded', eventSpy);

      subject.addCustomAnnouncement('test');

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('deleteCustomAnnouncement Tests', () => {
    it('should raise customAnnouncementDeleted event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('customAnnouncementDeleted', eventSpy);

      subject.deleteCustomAnnouncement(1);

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('refreshCustomAnnouncements Tests', () => {
    it('should raise custom announcements updated event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('customAnnouncementsUpdated', eventSpy);

      subject.refreshCustomAnnouncements();

      expect(eventSpy).toHaveBeenCalled();
    });

    it('should sort custom announcements alphabetically', () => {
      const announcements = [{ description: 'ZZZ' }, { description: 'AAA' }];
      httpClientMock.get.and.returnValue(of(announcements));
      translationServiceMock.sortAnnouncementsByDescription.and.returnValue([]);

      subject.refreshCustomAnnouncements();

      expect(translationServiceMock.sortAnnouncementsByDescription).toHaveBeenCalledWith(announcements);
    });
  });

  describe('clearList Tests', () => {
    it('should emit null after call to clearList', () => {
      subject.clearList();

      subject.customAnnouncementsList$.subscribe(
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
