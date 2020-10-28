import { async, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { AdesaAnnouncementsViewComponent } from './adesa-announcements-view.component';
import { AppService } from './app.service';
import { AuctionService } from '@adesa/component-authorization';
import { VehicleAnnouncementService } from './announcements/vehicle/vehicle-announcement.service';
import { InventoryAnnouncementService } from './announcements/inventory/inventory-announcement.service';
import { CustomAnnouncementService } from './announcements/custom/custom-announcement.service';
import { MvdaAnnouncementService } from './announcements/mvda/mvda-announcement.service';
import { ExternalContextService } from './shared/external-context.service';
import { getTranslocoModule } from './transloco-testing.module';
import { TranslocoService } from '@ngneat/transloco';

describe('AdesaAnnouncementsViewComponent', () => {
  let component: AdesaAnnouncementsViewComponent;
  const appServiceMock = jasmine.createSpyObj('AppService', ['setInventoryId']);
  const auctionServiceMock = jasmine.createSpyObj('AuctionService', ['setAuctionSiteId']);
  const externalContextServiceMock = jasmine.createSpyObj('ExternalContextService', ['setToken']);
  const translocoServiceMock = jasmine.createSpyObj('TranslocoService', ['setActiveLang']);
  const vehicleAnnouncementServiceMock = jasmine.createSpyObj('VehicleAnnouncementService', [
    'vehicleAnnouncementsList$',
    'clearList',
  ]);
  const inventoryAnnouncementServiceMock = jasmine.createSpyObj('InventoryAnnouncementService', [
    'inventoryAnnouncementsList$',
    'clearList',
  ]);
  const customAnnouncementServiceMock = jasmine.createSpyObj('CustomAnnouncementService', [
    'customAnnouncementsList$',
    'clearList',
  ]);
  const mvdaAnnouncementServiceMock = jasmine.createSpyObj('MvdaAnnouncementService', [
    'mvdaAnnouncementsList$',
    'clearList',
  ]);

  beforeEach(async(() => {
    customAnnouncementServiceMock.customAnnouncementsList$ = of([]);
    inventoryAnnouncementServiceMock.inventoryAnnouncementsList$ = of([]);
    mvdaAnnouncementServiceMock.mvdaAnnouncementsList$ = of([]);
    vehicleAnnouncementServiceMock.vehicleAnnouncementsList$ = of([]);

    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [
        AdesaAnnouncementsViewComponent,
        { provide: AppService, useValue: appServiceMock },
        { provide: AuctionService, useValue: auctionServiceMock },
        { provide: ExternalContextService, useValue: externalContextServiceMock },
        { provide: TranslocoService, useValue: translocoServiceMock },
        { provide: VehicleAnnouncementService, useValue: vehicleAnnouncementServiceMock },
        { provide: InventoryAnnouncementService, useValue: inventoryAnnouncementServiceMock },
        { provide: CustomAnnouncementService, useValue: customAnnouncementServiceMock },
        { provide: MvdaAnnouncementService, useValue: mvdaAnnouncementServiceMock },
      ],
    }).compileComponents();

    component = TestBed.inject(AdesaAnnouncementsViewComponent);

    appServiceMock.setInventoryId.calls.reset();
    auctionServiceMock.setAuctionSiteId.calls.reset();
    externalContextServiceMock.setToken.calls.reset();
    translocoServiceMock.setActiveLang.calls.reset();
    vehicleAnnouncementServiceMock.clearList.calls.reset();
    inventoryAnnouncementServiceMock.clearList.calls.reset();
    customAnnouncementServiceMock.clearList.calls.reset();
    mvdaAnnouncementServiceMock.clearList.calls.reset();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inventoryId property tests', () => {
    it('should call setInventoryId on appService', () => {
      const value = '123';
      component.inventoryId = value;
      expect(appServiceMock.setInventoryId).toHaveBeenCalledWith(Number(value));
    });
  });

  describe('auctionSiteId property tests', () => {
    it('should call setAuctionSiteId on auctionService', () => {
      const value = '123';
      component.auctionSiteId = value;
      expect(auctionServiceMock.setAuctionSiteId).toHaveBeenCalledWith(Number(value));
    });
  });

  describe('externalContextToken property tests', () => {
    it('should call setToken on externalContextService', () => {
      const value = 'token';
      component.externalContextToken = value;
      expect(externalContextServiceMock.setToken).toHaveBeenCalledWith(value);
    });
  });

  describe('adesaLocale property tests', () => {
    it('should call setActiveLang on translocoService', () => {
      const value = 'en-us';
      component.adesaLocale = value;
      expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(value);
    });
  });

  describe('ngOnInit tests', () => {
    it('should call services if properties are set', () => {
      component.inventoryId = '123';
      component.externalContextToken = 'token';

      component.ngOnInit();

      expect(appServiceMock.setInventoryId).toHaveBeenCalled();
      expect(externalContextServiceMock.setToken).toHaveBeenCalled();
    });

    it('should set announcement lists', () => {
      component.ngOnInit();

      expect(component.vehicleAnnouncements).toBeDefined();
      expect(component.inventoryAnnouncements).toBeDefined();
      expect(component.customAnnouncements).toBeDefined();
      expect(component.mvdaAnnouncements).toBeDefined();
    });
  });

  describe('ngOnDestroy tests', () => {
    it('should call clearList on announcement services', () => {
      component.ngOnDestroy();

      expect(vehicleAnnouncementServiceMock.clearList).toHaveBeenCalled();
      expect(inventoryAnnouncementServiceMock.clearList).toHaveBeenCalled();
      expect(customAnnouncementServiceMock.clearList).toHaveBeenCalled();
      expect(mvdaAnnouncementServiceMock.clearList).toHaveBeenCalled();
    });
  });
});
