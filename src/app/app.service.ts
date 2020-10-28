import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { InventoriedVehicle } from './inventoried-vehicle';
import { ApiUrlType, SettingsService } from './shared/settings.service';

@Injectable()
export class AppService {
  inventoryId$: BehaviorSubject<number> = new BehaviorSubject(null);
  vehicleId$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient, private settingsService: SettingsService) {}

  setInventoryId(inventoryId: number): void {
    if (!inventoryId) {
      return;
    }

    this.getVehicleId(inventoryId).subscribe(
      (vehicleId) => {
        this.vehicleId$.next(vehicleId);
        this.inventoryId$.next(inventoryId);
      },
      (error) => {
        throw error;
      },
    );
  }

  private getVehicleId(inventoryId: number): Observable<number> {
    const url = this.settingsService.createUrl('vehicles/v1/' + inventoryId, ApiUrlType.Inventory);

    return this.httpClient
      .get<InventoriedVehicle>(url, this.settingsService.createRequestOptions())
      .pipe(map((vehicle) => vehicle.vehicleId));
  }
}
