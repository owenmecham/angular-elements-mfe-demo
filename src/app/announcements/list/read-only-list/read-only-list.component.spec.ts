import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyListComponent } from './read-only-list.component';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomAnnouncementService } from '../../custom/custom-announcement.service';
import { InventoryAnnouncementService } from '../../inventory/inventory-announcement.service';
import { MvdaAnnouncementService } from '../../mvda/mvda-announcement.service';
import { VehicleAnnouncementService } from '../../vehicle/vehicle-announcement.service';
import { getTranslocoModule } from '../../../transloco-testing.module';

describe('ReadOnlyListComponent', () => {
  let component: ReadOnlyListComponent;
  let fixture: ComponentFixture<ReadOnlyListComponent>;
  const customAnnouncementServiceMock = jasmine.createSpyObj('CustomAnnouncementService', [
    'customAnnouncementsList$',
  ]);
  const inventoryAnnouncementServiceMock = jasmine.createSpyObj('InventoryAnnouncementService', [
    'inventoryAnnouncementsList$',
  ]);
  const mvdaAnnouncementServiceMock = jasmine.createSpyObj('MvdaAnnouncementService', [
    'mvdaAnnouncementsList$',
  ]);
  const vehicleAnnouncementServiceMock = jasmine.createSpyObj('VehicleAnnouncementService', [
    'vehicleAnnouncementsList$',
  ]);

  beforeEach(async(() => {
    customAnnouncementServiceMock.customAnnouncementsList$ = of([]);
    inventoryAnnouncementServiceMock.inventoryAnnouncementsList$ = of([]);
    mvdaAnnouncementServiceMock.mvdaAnnouncementsList$ = of([]);
    vehicleAnnouncementServiceMock.vehicleAnnouncementsList$ = of([]);

    TestBed.configureTestingModule({
      declarations: [ReadOnlyListComponent],
      imports: [
        FormsModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatTooltipModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: VehicleAnnouncementService, useValue: vehicleAnnouncementServiceMock },
        { provide: InventoryAnnouncementService, useValue: inventoryAnnouncementServiceMock },
        { provide: CustomAnnouncementService, useValue: customAnnouncementServiceMock },
        { provide: MvdaAnnouncementService, useValue: mvdaAnnouncementServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
