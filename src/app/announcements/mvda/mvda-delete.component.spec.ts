import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MvdaDeleteComponent } from './mvda-delete.component';
import { MvdaAnnouncement } from './mvda-announcement';

describe('MvdaDeleteComponent', () => {
  let component: MvdaDeleteComponent;
  let fixture: ComponentFixture<MvdaDeleteComponent>;
  const dummyData = {
    customAnnouncementId: 1,
    description: '',
    displayStatus: '',
    longDescription: '',
  } as MvdaAnnouncement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSelectModule,
        MatDividerModule,
      ],
      declarations: [MvdaDeleteComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: dummyData }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvdaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getDeleteReason Tests', () => {
    it('should return selectedReason given selectedReason is NOT Other', () => {
      component.selectedReason = 'test';

      const result = component.getDeleteReason();

      expect(result).toBe(component.selectedReason);
    });

    it('should return otherReason given selectedReason is Other', () => {
      component.selectedReason = 'Other';
      component.otherReason = 'test';

      const result = component.getDeleteReason();

      expect(result).toBe(component.otherReason);
    });
  });
});
