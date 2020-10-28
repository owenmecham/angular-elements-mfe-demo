import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventorySelectComponent } from './inventory-select.component';
import { AnnouncementOptionsFilterPipe } from '../../announcement-options-filter.pipe';
import { InventoryAnnouncementService } from '../inventory-announcement.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoModule } from 'src/app/transloco-testing.module';

describe('InventorySelectComponent', () => {
  let component: InventorySelectComponent;
  let fixture: ComponentFixture<InventorySelectComponent>;
  const inventoryAnnounceServiceMock = jasmine.createSpyObj('InventoryAnnouncementService', [
    'addInventoryAnnouncement',
  ]);

  beforeEach(async(() => {
    inventoryAnnounceServiceMock.filteredAnnouncementOptions$ = of([]);
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        BrowserAnimationsModule,
        getTranslocoModule(),
      ],
      declarations: [InventorySelectComponent, AnnouncementOptionsFilterPipe],
      providers: [{ provide: InventoryAnnouncementService, useValue: inventoryAnnounceServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySelectComponent);
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
