import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { SettingsService } from 'src/app/shared/settings.service';
import { VehicleAnnouncementService } from './vehicle-announcement.service';
import { TranslationService } from '../../shared/translation.service';
import { VehicleAnnouncement } from './vehicle-announcement';

describe('VehicleAnnouncementServiceTests', () => {
  let subject: VehicleAnnouncementService;
  const httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['createUrl', 'createRequestOptions']);
  const appServiceMock = jasmine.createSpyObj('AppService', ['setInventoryId']);

  const translationServiceMock = jasmine.createSpyObj('TranslationService', [
    'translateAndSortAnnouncementsByDescription',
  ]);
  translationServiceMock.translateAndSortAnnouncementsByDescription.and.returnValue([]);

  beforeEach(() => {
    appServiceMock.vehicleId$ = of(1);

    TestBed.configureTestingModule({
      providers: [
        VehicleAnnouncementService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: AppService, useValue: appServiceMock },
        { provide: TranslationService, useValue: translationServiceMock },
      ],
    });

    httpClientMock.get.and.returnValue(of([]));
    httpClientMock.post.and.returnValue(of({}));
    httpClientMock.delete.and.returnValue(of({}));

    subject = TestBed.inject(VehicleAnnouncementService);
  });

  describe('addVehicleAnnouncement Tests', () => {
    it('should raise vehicle announcement added event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('vehicleAnnouncementAdded', eventSpy);

      subject.addVehicleAnnouncement({ id: 1, description: 'test', isBeingAdded: true });

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('deleteVehicleAnnouncement Tests', () => {
    it('should raise vehicle announcement deleted event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('vehicleAnnouncementDeleted', eventSpy);

      subject.deleteVehicleAnnouncement(1, 1);

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('refreshAvailableAnnouncements Tests', () => {
    it('should translate and sort available announcements alphabetically', () => {
      httpClientMock.get.and.returnValue(of([{ description: 'ZZZ' }, { description: 'AAA' }]));

      subject.refreshAvailableAnnouncements();

      expect(translationServiceMock.translateAndSortAnnouncementsByDescription).toHaveBeenCalled();
    });
  });

  describe('refreshVehicleAnnouncements Tests', () => {
    it('should raise vehicle announcements updated event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('vehicleAnnouncementsUpdated', eventSpy);

      subject.refreshVehicleAnnouncements(1);

      expect(eventSpy).toHaveBeenCalled();
    });

    it('should translate and sort announcements', () => {
      const announcements: VehicleAnnouncement[] = [
        { description: 'Announcement 1' } as VehicleAnnouncement,
        { description: 'Announcement 2' } as VehicleAnnouncement,
      ];

      httpClientMock.get.and.returnValue(of(announcements));
      translationServiceMock.translateAndSortAnnouncementsByDescription.and.returnValue(announcements);

      subject.refreshVehicleAnnouncements(1);

      expect(translationServiceMock.translateAndSortAnnouncementsByDescription).toHaveBeenCalledWith(
        announcements,
      );
    });
  });

  describe('clearList Tests', () => {
    it('should emit null after call to clearList', () => {
      subject.clearList();

      subject.vehicleAnnouncementsList$.subscribe(
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
