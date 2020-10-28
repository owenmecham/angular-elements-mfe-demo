import { InventoryAnnouncementService } from './inventory-announcement.service';
import { AppService } from 'src/app/app.service';
import { of, BehaviorSubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { SettingsService } from 'src/app/shared/settings.service';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../shared/translation.service';
import { InventoryAnnouncement } from './inventory-announcement';

describe('InventoryAnnouncementServiceTests', () => {
  let subject: InventoryAnnouncementService;

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
    'translateAndSortAnnouncementsByDescription',
  ]);

  translationServiceMock.translateAndSortAnnouncementsByDescription.and.returnValue([]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventoryAnnouncementService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: AppService, useValue: appServiceStub },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: TranslationService, useValue: translationServiceMock },
      ],
    });

    httpClientMock.get.and.returnValue(of([]));
    httpClientMock.post.and.returnValue(of({}));
    httpClientMock.delete.and.returnValue(of({}));

    subject = TestBed.inject(InventoryAnnouncementService);
  });

  describe('addInventoryAnnouncement Tests', () => {
    it('should raise inventory announcement added event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('inventoryAnnouncementAdded', eventSpy);

      subject.addInventoryAnnouncement({ id: 1, description: 'test', isBeingAdded: true });

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('deleteInventoryAnnouncement Tests', () => {
    it('should raise inventory announcement deleted event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('inventoryAnnouncementDeleted', eventSpy);

      subject.deleteInventoryAnnouncement(1, 1);

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('refreshAvailableAnnouncements Tests', () => {
    it('should translate and sort available announcement descriptions', () => {
      httpClientMock.get.and.returnValue(of([{ description: 'AAA' }]));

      subject.refreshAvailableAnnouncements();

      expect(translationServiceMock.translateAndSortAnnouncementsByDescription).toHaveBeenCalled();
    });
  });

  describe('refreshInventoryAnnouncements Tests', () => {
    it('should raise inventory announcements updated event', () => {
      const eventSpy = jasmine.createSpy('event');
      addEventListener('inventoryAnnouncementsUpdated', eventSpy);

      subject.refreshInventoryAnnouncements();

      expect(eventSpy).toHaveBeenCalled();
    });

    it('should translate and sort announcements', () => {
      const announcements: InventoryAnnouncement[] = [
        { description: 'Announcement 1' } as InventoryAnnouncement,
        { description: 'Announcement 2' } as InventoryAnnouncement,
      ];

      httpClientMock.get.and.returnValue(of(announcements));
      translationServiceMock.translateAndSortAnnouncementsByDescription.and.returnValue(announcements);

      subject.refreshInventoryAnnouncements();

      expect(translationServiceMock.translateAndSortAnnouncementsByDescription).toHaveBeenCalledWith(
        announcements,
      );
    });
  });

  describe('clearList Tests', () => {
    it('should emit null after call to clearList', () => {
      subject.clearList();

      subject.inventoryAnnouncementsList$.subscribe(
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
