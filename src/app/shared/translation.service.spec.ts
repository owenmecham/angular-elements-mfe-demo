import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { TranslocoService } from '@ngneat/transloco';
import { AnnouncementOption } from '../announcements/announcement-option';

describe('TranslationService', () => {
  let subject: TranslationService;

  const translocoServiceMock = jasmine.createSpyObj('TranslocoService', ['translate', 'getActiveLang']);
  translocoServiceMock.getActiveLang.and.returnValue('en-us');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationService, { provide: TranslocoService, useValue: translocoServiceMock }],
    });

    subject = TestBed.inject(TranslationService);
  });

  describe('translateAndSortAnnouncementOptions tests', () => {
    it('should translate announcement option descriptions', () => {
      translocoServiceMock.translate.withArgs('AAA').and.returnValue('Translated Text');

      const result = subject.translateAndSortAnnouncementsByDescription([
        { description: 'AAA' } as AnnouncementOption,
      ]);

      expect(result[0].description).toBe('Translated Text');
    });

    it('should sort translated text', () => {
      translocoServiceMock.translate.withArgs('AAA').and.returnValue('AAA');
      translocoServiceMock.translate.withArgs('BBB').and.returnValue('BBB');

      const result = subject.translateAndSortAnnouncementsByDescription([
        { description: 'BBB' } as AnnouncementOption,
        { description: 'AAA' } as AnnouncementOption,
      ]);

      expect(result[0].description).toBe('AAA');
      expect(result[1].description).toBe('BBB');
    });
  });

  describe('sortAnnouncementsByDescription tests', () => {
    it('should sort announcements by description', () => {
      translocoServiceMock.getActiveLang.and.returnValue('en-us');

      const announcements = [{ description: 'BBB' }, { description: 'AAA' }];

      const result = subject.sortAnnouncementsByDescription(announcements);

      expect(result[0].description).toBe('AAA');
      expect(result[1].description).toBe('BBB');
    });
  });

  describe('translate tests', () => {
    it('should call transloco translate', () => {
      const translationResult = 'Translated Text';
      translocoServiceMock.translate.and.returnValue(translationResult);
      const textToTranslate = 'Translate Me';

      const result = subject.translate(textToTranslate);

      expect(translocoServiceMock.translate).toHaveBeenCalledWith(textToTranslate);
      expect(result).toBe(translationResult);
    });
  });
});
