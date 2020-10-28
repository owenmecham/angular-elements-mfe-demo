import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomAnnouncementComponent } from './custom-announcement.component';
import { CustomAnnouncementService } from './custom-announcement.service';

describe('CustomAnnouncementComponent', () => {
  let component: CustomAnnouncementComponent;
  let fixture: ComponentFixture<CustomAnnouncementComponent>;
  let customAnnouncementServiceMock: any;

  beforeEach(async(() => {
    customAnnouncementServiceMock = jasmine.createSpyObj('CustomAnnouncementService', [
      'addCustomAnnouncement',
      'deleteCustomAnnouncement',
    ]);
    TestBed.configureTestingModule({
      imports: [FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      declarations: [CustomAnnouncementComponent],
      providers: [{ provide: CustomAnnouncementService, useValue: customAnnouncementServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addCustomAnnouncement', () => {
    it('should not call customAnnouncementService, given newCustomAnnouncement is empty', () => {
      component.newCustomAnnouncement = '';
      component.addCustomAnnouncement();
      expect(customAnnouncementServiceMock.addCustomAnnouncement).not.toHaveBeenCalled();
    });

    it('should call customAnnouncementService, given newCustomAnnouncement is not empty', () => {
      component.newCustomAnnouncement = 'new announcement';
      component.addCustomAnnouncement();
      expect(customAnnouncementServiceMock.addCustomAnnouncement).toHaveBeenCalled();
    });

    it('should reset newCustomAnnouncement, given newCustomAnnouncement is not empty', () => {
      component.newCustomAnnouncement = 'new announcement';
      component.addCustomAnnouncement();
      expect(component.newCustomAnnouncement).toBe('');
    });
  });
});
