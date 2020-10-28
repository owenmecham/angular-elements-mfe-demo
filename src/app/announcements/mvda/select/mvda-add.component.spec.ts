import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MvdaAddComponent } from './mvda-add.component';
import { ConvertFormatToMaskPipe } from './convert-format-to-mask.pipe';
import { NgxMaskModule } from 'ngx-mask';
import { MvdaAnnouncementOption } from '../mvda-announcement-option';

describe('MvdaAddComponent', () => {
  let component: MvdaAddComponent;
  let fixture: ComponentFixture<MvdaAddComponent>;
  const mockData: MvdaAnnouncementOption = {
    id: 2,
    description: 'foobar2',
    code: 'abc',
    customFields: [
      {
        name: 'field2',
        label: 'lblField2',
        format: 'abc',
        controlType: 'textbox',
        dataType: 'dType',
        length: 10,
        sortOrder: 2,
        options: [
          { key: 'key3', value: 'value3', sortOrder: 3 },
          { key: 'key2', value: 'value2', sortOrder: 2 },
        ],
      },
      {
        name: 'field1',
        label: 'lblField1',
        format: 'abc',
        controlType: 'textbox',
        dataType: 'dType',
        length: 10,
        sortOrder: 1,
        options: [{ key: 'key1', value: 'value1', sortOrder: 1 }],
      },
    ],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        NgxMaskModule.forRoot({}),
        MatDatepickerModule,
        MatSelectModule,
        MatDividerModule,
      ],
      declarations: [MvdaAddComponent, ConvertFormatToMaskPipe],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvdaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('constructor tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should sort customfields based on their sort order', () => {
      expect(component.data.customFields[0].name).toBe('field1');
      expect(component.data.customFields[1].name).toBe('field2');
    });

    it('should sort options of field2 based on their sort order', () => {
      const field2 = component.data.customFields.filter((x) => x.name === 'field2')[0];
      expect(field2.options[0].key).toBe('key2');
      expect(field2.options[1].key).toBe('key3');
    });
  });
});
