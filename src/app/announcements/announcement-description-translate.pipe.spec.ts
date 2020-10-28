import { async, TestBed } from '@angular/core/testing';
import { AnnouncementDescriptionTranslatePipe } from './announcement-description-translate.pipe';
import { getTranslocoModule } from '../transloco-testing.module';
import { TranslocoService } from '@ngneat/transloco';

describe('AnnouncementDescriptionTranslatePipe', () => {
  let translatePipe: AnnouncementDescriptionTranslatePipe;
  const translocoServiceMock = jasmine.createSpyObj('TranslocoService', ['translate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [{ provide: TranslocoService, useValue: translocoServiceMock }],
    });

    translatePipe = new AnnouncementDescriptionTranslatePipe(translocoServiceMock);
  }));

  it('should return description as is when description is falsy', () => {
    const description = '';
    const type = 'Vehicle';

    const result = translatePipe.transform(description, type);

    expect(result).toEqual(description);
  });

  it('should return description as is when type is falsy', () => {
    const description = 'Hello world!';
    const type = '';

    const result = translatePipe.transform(description, type);

    expect(result).toEqual(description);
  });

  it('should return description as is when type is Custom', () => {
    const description = 'Hello world!';
    const type = 'Custom';

    const result = translatePipe.transform(description, type);

    expect(result).toEqual(description);
  });

  it('should call translation service when type is NOT Custom', () => {
    const description = 'Hello world!';
    const type = 'Vehicle';

    translatePipe.transform(description, type);

    expect(translocoServiceMock.translate).toHaveBeenCalledWith(description);
  });
});
