import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehicleSelectComponent } from './vehicle-select.component';
import { AnnouncementOptionsFilterPipe } from '../../announcement-options-filter.pipe';
import { VehicleAnnouncementService } from '../vehicle-announcement.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoModule } from 'src/app/transloco-testing.module';

describe('VehicleSelectComponent', () => {
  let component: VehicleSelectComponent;
  let fixture: ComponentFixture<VehicleSelectComponent>;
  const vehicleAnnounceServiceMock = jasmine.createSpyObj('VehicleAnnouncementService', [
    'addVehicleAnnouncement',
  ]);

  beforeEach(async(() => {
    vehicleAnnounceServiceMock.filteredAnnouncementOptions$ = of([]);
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatDividerModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        getTranslocoModule(),
      ],
      declarations: [VehicleSelectComponent, AnnouncementOptionsFilterPipe],
      providers: [{ provide: VehicleAnnouncementService, useValue: vehicleAnnounceServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addAnnouncement Tests', () => {
    it('should null searchValue on select', () => {
      component.searchValue = 'ABC';
      component.addAnnouncement({ id: 2, description: 'test', isBeingAdded: false });
      expect(component.searchValue).toBeNull();
    });
  });
});
