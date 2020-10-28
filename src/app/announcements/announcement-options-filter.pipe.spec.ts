import { async, TestBed } from '@angular/core/testing';
import { AnnouncementOptionsFilterPipe } from './announcement-options-filter.pipe';
import { getTranslocoModule } from '../transloco-testing.module';
import { TranslocoService } from '@ngneat/transloco';

describe('AnnouncementOptionsFilterPipe', () => {
  let service: TranslocoService;
  let filterPipe: AnnouncementOptionsFilterPipe;

  const announcementOptions = [
    { id: 1, description: 'name', isBeingAdded: false },
    { id: 2, description: 'other name', isBeingAdded: false },
    { id: 3, description: 'something different', isBeingAdded: false },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
    });

    service = TestBed.inject(TranslocoService);
    filterPipe = new AnnouncementOptionsFilterPipe(service);
  }));

  it('should return all options when search text is null', () => {
    const searchText = null;

    const result = filterPipe.transform(announcementOptions, searchText);
    expect(result).toEqual(announcementOptions);
  });

  it('should return all options when search text is an empty string', () => {
    const searchText = '';

    const result = filterPipe.transform(announcementOptions, searchText);
    expect(result).toEqual(announcementOptions);
  });

  it('should return no options when search text does not match', () => {
    const searchText = 'zzz';

    const result = filterPipe.transform(announcementOptions, searchText);
    expect(result.length).toEqual(0);
  });

  it('should return matching options when search text matches', () => {
    const searchText = 'something different';

    const result = filterPipe.transform(announcementOptions, searchText);
    expect(result).toEqual([announcementOptions[2]]);
  });

  it('should return matching options when search text matches regardless of casing', () => {
    const searchText = 'SOMETHING DIFFERENT';

    const result = filterPipe.transform(announcementOptions, searchText);
    expect(result).toEqual([announcementOptions[2]]);
  });

  it('should return multiple matching options when search text matches', () => {
    const searchText = 'name';

    const result = filterPipe.transform(announcementOptions, searchText);
    expect(result).toEqual([announcementOptions[0], announcementOptions[1]]);
  });
});
