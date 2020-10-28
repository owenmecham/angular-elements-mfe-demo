import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs/operators';

import { AppService } from './app.service';
import { InventoriedVehicle } from './inventoried-vehicle';
import { SettingsService } from './shared/settings.service';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;

  const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['createUrl', 'createRequestOptions']);

  const inventoriedVehicle: InventoriedVehicle = {
    inventoryId: 1,
    vehicleId: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppService, { provide: SettingsService, useValue: settingsServiceMock }],
    });

    settingsServiceMock.createUrl.and.returnValue('expectedUrl');

    service = TestBed.inject(AppService);
    httpTestingController = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setInventoryId tests', () => {
    it('should set inventory id given inventory id and successfull http call', (done: DoneFn) => {
      service.inventoryId$
        .pipe(skip(1)) // skip initial value of behavior subject
        .subscribe(
          (inventoryId) => {
            expect(inventoryId).toEqual(1);
            done();
          },
          (error) => {
            throw error;
          },
        );

      service.setInventoryId(1);

      httpTestingController.expectOne('expectedUrl').flush(inventoriedVehicle);
    });

    it('should set vehicle id given inventory id and successfull http call', (done: DoneFn) => {
      service.vehicleId$
        .pipe(skip(1)) // skip initial value of behavior subject
        .subscribe(
          (vehicleId) => {
            expect(vehicleId).toEqual(2);
            done();
          },
          (error) => {
            throw error;
          },
        );

      service.setInventoryId(1);

      httpTestingController.expectOne('expectedUrl').flush(inventoriedVehicle);
    });
  });
});
