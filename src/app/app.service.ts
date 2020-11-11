import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable()
export class AppService {
  inventoryId$: BehaviorSubject<number> = new BehaviorSubject(null);
  vehicleId$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor() {}

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
    return of(inventoryId + 1000);
  }
}
