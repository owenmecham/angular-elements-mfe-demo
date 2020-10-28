import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AnnouncementOption } from './announcement-option';

@Pipe({
  name: 'announcementOptionsFilter',
})
export class AnnouncementOptionsFilterPipe implements PipeTransform {
  constructor(private service: TranslocoService) {}

  transform(announcementOptions: AnnouncementOption[], searchText: string): AnnouncementOption[] {
    if (!announcementOptions) {
      return [];
    }

    if (!searchText) {
      return announcementOptions;
    }

    searchText = searchText.toLowerCase();

    return announcementOptions.filter((option) => {
      if (option && option.description) {
        return this.service
          .translate(option.description)
          .toLowerCase()
          .includes(searchText);
      }

      return false;
    });
  }
}
