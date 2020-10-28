import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MvdaSelectComponent } from './mvda-select.component';
import { AnnouncementOptionsFilterPipe } from '../../announcement-options-filter.pipe';
import { MvdaAnnouncementService } from '../mvda-announcement.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MvdaAnnouncementOption } from '../mvda-announcement-option';
import { MvdaAddComponent } from './mvda-add.component';
import { ConvertFormatToMaskPipe } from './convert-format-to-mask.pipe';
import { NgxMaskModule } from 'ngx-mask';
import { getTranslocoModule } from 'src/app/transloco-testing.module';

@NgModule({
  imports: [
    FormsModule,
    NgxMaskModule.forRoot({}),
    CommonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    getTranslocoModule(),
  ],
  declarations: [MvdaAddComponent, ConvertFormatToMaskPipe],
  entryComponents: [MvdaAddComponent],
})
export class FakeTestDialogModule {}

describe('MvdaSelectComponent', () => {
  let component: MvdaSelectComponent;
  let fixture: ComponentFixture<MvdaSelectComponent>;
  const mvdaAnnounceServiceMock = jasmine.createSpyObj('MvdaAnnouncementService', ['addMvdaAnnouncement']);

  beforeEach(async(() => {
    mvdaAnnounceServiceMock.announcementOptions$ = of([]);
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        NgxMaskModule.forRoot({}),
        MatDividerModule,
        MatDatepickerModule,
        BrowserAnimationsModule,
        MatDialogModule,
        FakeTestDialogModule,
      ],
      declarations: [MvdaSelectComponent, AnnouncementOptionsFilterPipe],
      providers: [{ provide: MvdaAnnouncementService, useValue: mvdaAnnounceServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvdaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addAnnouncement Tests', () => {
    it('should null searchValue on select', () => {
      component.searchValue = 'ABC';
      const mockData: MvdaAnnouncementOption = {
        id: 1,
        description: 'foobar',
        code: '1234',
        customFields: [],
      };
      component.addAnnouncement(mockData);
      expect(component.searchValue).toBeNull();
    });
  });
});
