import { TestBed } from '@angular/core/testing';
import { MvdaTextHelper } from './mvda-text-helper';
import { MvdaAnnouncementOption, MvdaCustomField } from './mvda-announcement-option';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { ApiMvdaAnnouncement } from './api-mvda-announcement';
import { TranslationService } from '../../shared/translation.service';
import { MvdaDisclosure } from './mvda-disclosure';

describe('MvdaTextHelper', () => {
  let subject: MvdaTextHelper;
  const translationServiceMock = jasmine.createSpyObj('TranslationService', ['translate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [CurrencyPipe, { provide: TranslationService, useValue: translationServiceMock }],
    });

    translationServiceMock.translate.and.returnValue('Default Translated Text');
    subject = TestBed.inject(MvdaTextHelper);
  });

  describe('getMvdaDisclosureValues', () => {
    it('should translate option field to human readable description', () => {
      const mvdaOption = {
        description: 'Major Repair',
        customFields: [
          {
            controlType: 'dropdown',
            label: 'Type of Major Repair',
            name: 'mvdaRepairDescriptionID',
            options: [
              {
                key: '1',
                value: 'Computer equipment',
              },
              {
                key: '2',
                value: 'Fuel operating system',
              },
            ],
          },
        ],
      } as MvdaAnnouncementOption;

      const disclosureDetails = {
        MvdaRepairDescriptionId: '1',
      } as MvdaDisclosure;

      translationServiceMock.translate
        .withArgs('custom-field-mvdaRepairDescriptionID')
        .and.returnValue('Type of Major Repair');

      translationServiceMock.translate
        .withArgs('custom-option-Computer equipment')
        .and.returnValue('Computer equipment');

      const disclosureValues = subject.getMvdaDisclosureValues(mvdaOption, disclosureDetails);

      expect(disclosureValues).toContain('Computer equipment');
    });

    it('should not include field values that are null', () => {
      const mvdaOption = {
        customFields: [
          {
            name: 'Field 1',
          } as MvdaCustomField,
          {
            name: 'Field 2',
          } as MvdaCustomField,
        ],
      } as MvdaAnnouncementOption;

      const disclosureValues = subject.getMvdaDisclosureValues(mvdaOption, {} as MvdaDisclosure);

      expect(disclosureValues).toEqual([]);
    });

    it('should format field values', () => {
      const mvdaOption = {
        customFields: [
          {
            controlType: 'Date',
            dataType: 'datetime',
            label: 'Disclosure Date',
            name: 'Date',
          },
          {
            controlType: 'textbox',
            dataType: 'money',
            label: '$ Amount',
            name: 'amount',
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        Date: '12/28/2019 12:00:00 AM',
        Amount: '123456.0000',
      } as MvdaDisclosure;

      const disclosureText = subject.getMvdaDisclosureValues(mvdaOption, mvdaAnnouncement);

      expect(disclosureText).toContain('12/28/2019');
      expect(disclosureText).toContain('$123,456.00');
    });
  });

  describe('buildMvdaDisclosureText', () => {
    it('should include translated custom field label when field is populated', () => {
      const mvdaOption = {
        description: 'ABS Defective',
        customFields: [
          {
            name: 'Comment',
            label: 'Test',
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        disclosureDetails: {
          Comment: 'Test comment',
        },
      } as ApiMvdaAnnouncement;

      const translatedField = 'Translated Comment Field';

      translationServiceMock.translate.withArgs('custom-field-Comment').and.returnValue(translatedField);

      const disclosureText = subject.buildMvdaDisclosureText(mvdaOption, mvdaAnnouncement);

      expect(disclosureText).toContain(translatedField);
    });

    it('should not include field labels for field that is not populated', () => {
      const mvdaOption = {
        description: 'ABS Defective',
        customFields: [
          {
            name: 'Name',
            label: 'Label',
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        disclosureDetails: {
          Comment: null,
        },
      } as ApiMvdaAnnouncement;

      translationServiceMock.translate.withArgs('Name').and.returnValue('Label');

      const disclosureText = subject.buildMvdaDisclosureText(mvdaOption, mvdaAnnouncement);

      expect(disclosureText).not.toContain('Label');
    });

    it('should include translated mvda announcement description', () => {
      const mvdaOption = {
        description: 'ABS Defective',
      } as MvdaAnnouncementOption;

      const translatedDescription = 'Translated ABS Defective';

      translationServiceMock.translate.withArgs('ABS Defective').and.returnValue(translatedDescription);

      const disclosureText = subject.buildMvdaDisclosureText(mvdaOption, {} as ApiMvdaAnnouncement);

      expect(disclosureText).toContain(translatedDescription);
    });

    it('should map properties with mismatching cases', () => {
      const mvdaOption = {
        id: 1,
        description: 'ABS Defective',
        customFields: [
          {
            name: 'comment',
            label: 'Label',
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        mvdaAnnouncementId: 1,
        disclosureDetails: {
          Comment: 'Test comment',
        },
      } as ApiMvdaAnnouncement;

      translationServiceMock.translate.withArgs('custom-field-comment').and.returnValue('Label');

      const disclosureText = subject.buildMvdaDisclosureText(mvdaOption, mvdaAnnouncement);

      expect(disclosureText).toContain('Label: Test comment');
    });

    it('should format date fields', () => {
      const mvdaOption = {
        customFields: [
          {
            controlType: 'Date',
            dataType: 'datetime',
            label: 'Disclosure Date',
            name: 'Date',
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        disclosureDetails: {
          Date: '12/28/2019 12:00:00 AM',
        },
      } as ApiMvdaAnnouncement;

      const disclosureText = subject.buildMvdaDisclosureText(mvdaOption, mvdaAnnouncement);

      expect(disclosureText).toContain('12/28/2019');
      expect(disclosureText).not.toContain('12:00:00');
    });

    it('should format dollar amount field', () => {
      const mvdaOption = {
        description: 'Accident Repair',
        customFields: [
          {
            controlType: 'textbox',
            dataType: 'money',
            label: '$ Amount',
            name: 'amount',
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        disclosureDetails: {
          Amount: '123456.0000',
        },
      } as ApiMvdaAnnouncement;

      const disclosureText = subject.buildMvdaDisclosureText(mvdaOption, mvdaAnnouncement);

      expect(disclosureText).toContain('$123,456.00');
    });

    it('should translate option field to human readable description', () => {
      const mvdaOption = {
        description: 'Major Repair',
        customFields: [
          {
            controlType: 'dropdown',
            label: 'Type of Major Repair',
            name: 'mvdaRepairDescriptionID',
            options: [
              {
                key: '1',
                value: 'Computer equipment',
              },
              {
                key: '2',
                value: 'Fuel operating system',
              },
            ],
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        disclosureDetails: {
          MvdaRepairDescriptionId: '1',
        },
      } as ApiMvdaAnnouncement;

      translationServiceMock.translate
        .withArgs('custom-field-mvdaRepairDescriptionID')
        .and.returnValue('Type of Major Repair');
      translationServiceMock.translate
        .withArgs('custom-option-Computer equipment')
        .and.returnValue('Computer equipment');

      const disclosureText = subject.buildMvdaDisclosureText(mvdaOption, mvdaAnnouncement);

      expect(disclosureText).toContain('Type of Major Repair: Computer equipment');
    });

    it('should not throw if field name is null', () => {
      const mvdaOption = {
        description: 'Major Repair',
        customFields: [
          {
            name: null,
          },
        ],
      } as MvdaAnnouncementOption;

      const mvdaAnnouncement = {
        disclosureDetails: {
          MvdaRepairDescriptionId: '1',
        },
      } as ApiMvdaAnnouncement;

      expect(function() {
        subject.buildMvdaDisclosureText(mvdaOption, mvdaAnnouncement);
      }).not.toThrow();
    });
  });
});
