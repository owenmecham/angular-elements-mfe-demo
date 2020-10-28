import { async, TestBed } from '@angular/core/testing';

import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AuctionService } from '@adesa/component-authorization';
import { VehicleAnnouncementService } from './announcements/vehicle/vehicle-announcement.service';
import { InventoryAnnouncementService } from './announcements/inventory/inventory-announcement.service';
import { CustomAnnouncementService } from './announcements/custom/custom-announcement.service';
import { MvdaAnnouncementService } from './announcements/mvda/mvda-announcement.service';
import { ExternalContextService } from './shared/external-context.service';
import { ThemeService } from '../theme/theme.service';
import { getTranslocoModule } from './transloco-testing.module';
import { TranslocoService } from '@ngneat/transloco';

describe('AppComponent', () => {
  let component: AppComponent;

  const appServiceMock = jasmine.createSpyObj('AppService', ['setInventoryId']);
  const auctionServiceMock = jasmine.createSpyObj('AuctionService', ['setAuctionSiteId']);
  const externalContextServiceMock = jasmine.createSpyObj('ExternalContextService', ['setToken']);
  const themeServiceMock = jasmine.createSpyObj('ThemeService', ['setActiveTheme']);
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
    vehicleAnnouncementServiceMock.vehicleAnnouncementsList$ = new BehaviorSubject([]);

    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [
        AppComponent,
        { provide: AppService, useValue: appServiceMock },
        { provide: AuctionService, useValue: auctionServiceMock },
        { provide: ExternalContextService, useValue: externalContextServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: TranslocoService, useValue: translocoServiceMock },
        { provide: VehicleAnnouncementService, useValue: vehicleAnnouncementServiceMock },
        { provide: InventoryAnnouncementService, useValue: inventoryAnnouncementServiceMock },
        { provide: CustomAnnouncementService, useValue: customAnnouncementServiceMock },
        { provide: MvdaAnnouncementService, useValue: mvdaAnnouncementServiceMock },
      ],
    }).compileComponents();

    component = TestBed.inject(AppComponent);

    appServiceMock.setInventoryId.calls.reset();
    auctionServiceMock.setAuctionSiteId.calls.reset();
    externalContextServiceMock.setToken.calls.reset();
    themeServiceMock.setActiveTheme.calls.reset();
    translocoServiceMock.setActiveLang.calls.reset();
    vehicleAnnouncementServiceMock.clearList.calls.reset();
    inventoryAnnouncementServiceMock.clearList.calls.reset();
    customAnnouncementServiceMock.clearList.calls.reset();
    mvdaAnnouncementServiceMock.clearList.calls.reset();
  }));

  it('should create the component', () => {
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

  describe('siteThemeName property tests', () => {
    it('should call setActiveTheme on themeService', () => {
      const value = 'theme';

      component.siteThemeName = value;

      expect(themeServiceMock.setActiveTheme).toHaveBeenCalledWith(value);
    });
  });

  describe('adesaLocale property tests', () => {
    it('should call setActiveLang on translocoService', () => {
      const value = 'en-us';

      component.adesaLocale = value;

      expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(value);
    });
  });

  describe('toggleReadOnlyMode tests', () => {
    it('should toggle the current value of readOnlyMode field', () => {
      component.readOnlyMode = true;

      component.toggleReadOnlyMode();
      expect(component.readOnlyMode).toBeFalsy('after 1st toggle');

      component.toggleReadOnlyMode();
      expect(component.readOnlyMode).toBeTruthy('after 2nd toggle');
    });
  });

  describe('ngOnInit tests', () => {
    it('should call services and update field if properties are set', () => {
      component.auctionSiteId = '9'; // Canadian auction site
      component.inventoryId = '123';
      component.externalContextToken = 'token';
      component.siteThemeName = 'theme';

      component.ngOnInit();

      expect(component.canadianSite).toBeTruthy();
      expect(appServiceMock.setInventoryId).toHaveBeenCalled();
      expect(externalContextServiceMock.setToken).toHaveBeenCalled();
      expect(themeServiceMock.setActiveTheme).toHaveBeenCalled();
    });

    it('should set readOnlyMode to false if announcements exist', () => {
      vehicleAnnouncementServiceMock.vehicleAnnouncementsList$.next({
        announcementId: 1,
        announcementSequence: 1,
        description: 'string',
        displayStatus: 'string',
      });

      component.ngOnInit();

      expect(component.readOnlyMode).toBeFalsy();
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
