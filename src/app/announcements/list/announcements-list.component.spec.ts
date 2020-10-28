import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AnnouncementsListComponent } from './announcements-list.component';
import { CustomAnnouncement } from '../custom/custom-announcement';
import { CustomAnnouncementService } from '../custom/custom-announcement.service';
import { InventoryAnnouncement } from '../inventory/inventory-announcement';
import { InventoryAnnouncementService } from '../inventory/inventory-announcement.service';
import { MvdaAnnouncement } from '../mvda/mvda-announcement';
import { MvdaAnnouncementService } from '../mvda/mvda-announcement.service';
import { VehicleAnnouncement } from '../vehicle/vehicle-announcement';
import { VehicleAnnouncementService } from '../vehicle/vehicle-announcement.service';
import { MvdaDeleteComponent } from '../mvda/mvda-delete.component';
import { getTranslocoModule } from '../../transloco-testing.module';

@NgModule({
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDividerModule,
    FormsModule,
    CommonModule,
  ],
  declarations: [MvdaDeleteComponent],
  entryComponents: [MvdaDeleteComponent],
})
export class FakeTestDialogModule {}

describe('AnnouncementsListComponent', () => {
  let component: AnnouncementsListComponent;
  let fixture: ComponentFixture<AnnouncementsListComponent>;
  const customAnnouncementServiceMock = jasmine.createSpyObj('CustomAnnouncementService', [
    'deleteCustomAnnouncement',
  ]);
  const inventoryAnnouncementServiceMock = jasmine.createSpyObj('InventoryAnnouncementService', [
    'deleteInventoryAnnouncement',
  ]);
  const mvdaAnnouncementServiceMock = jasmine.createSpyObj('MvdaAnnouncementService', [
    'deleteMvdaAnnouncement',
  ]);
  const vehicleAnnouncementServiceMock = jasmine.createSpyObj('VehicleAnnouncementService', [
    'deleteVehicleAnnouncement',
  ]);

  beforeEach(async(() => {
    customAnnouncementServiceMock.customAnnouncementsList$ = of([]);
    inventoryAnnouncementServiceMock.inventoryAnnouncementsList$ = of([]);
    mvdaAnnouncementServiceMock.mvdaAnnouncementsList$ = of([]);
    vehicleAnnouncementServiceMock.vehicleAnnouncementsList$ = of([]);
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatDividerModule,
        MatSelectModule,
        MatTooltipModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        NoopAnimationsModule,
        FakeTestDialogModule,
        getTranslocoModule(),
      ],
      declarations: [AnnouncementsListComponent],
      providers: [
        { provide: CustomAnnouncementService, useValue: customAnnouncementServiceMock },
        { provide: InventoryAnnouncementService, useValue: inventoryAnnouncementServiceMock },
        { provide: MvdaAnnouncementService, useValue: mvdaAnnouncementServiceMock },
        { provide: VehicleAnnouncementService, useValue: vehicleAnnouncementServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    customAnnouncementServiceMock.customAnnouncementsList$.next = of([]);
    fixture = TestBed.createComponent(AnnouncementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeVehicleAnnouncement Tests', () => {
    it('should set display status to deleting given an announcement to remove', () => {
      const announcement: VehicleAnnouncement = {
        announcementId: 1,
        announcementSequence: 1,
        description: 'asdf',
        displayStatus: 'asdf',
      };

      component.removeVehicleAnnouncement(announcement);

      expect(announcement.displayStatus).toBe('deleting');
    });
  });

  describe('removeMvdaAnnouncement Tests', () => {
    it('should NOT set display status given no modal interaction', () => {
      const announcement = {
        customAnnouncementId: 1,
        description: 'asdf',
        displayStatus: 'asdf',
        longDescription: 'asdf',
      } as MvdaAnnouncement;

      component.removeMvdaAnnouncement(announcement);

      expect(announcement.displayStatus).toBe('asdf');
    });
  });

  describe('removeCustomAnnouncement Tests', () => {
    it('should set display status to deleting given an announcement to remove', () => {
      const announcement: CustomAnnouncement = {
        announcementId: 1,
        description: 'asdf',
        inventoryId: 1,
        displayStatus: 'asdf',
      };

      component.removeCustomAnnouncement(announcement);

      expect(announcement.displayStatus).toBe('deleting');
    });
  });

  describe('removeInventoryAnnouncement Tests', () => {
    it('should set display status to deleting given an announcement to remove', () => {
      const announcement: InventoryAnnouncement = {
        announcementId: 1,
        announcementSequence: 1,
        description: 'asdf',
        inventoryId: 1,
        displayStatus: 'asdf',
      };

      component.removeInventoryAnnouncement(announcement);

      expect(announcement.displayStatus).toBe('deleting');
    });
  });
});
