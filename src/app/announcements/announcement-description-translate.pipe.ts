import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'announcementDescriptionTranslate',
})
export class AnnouncementDescriptionTranslatePipe implements PipeTransform {
  constructor(private service: TranslocoService) {}

  transform(description: string, type: string): string {
    if (!description || !type) {
      return description;
    }

    return type === 'Custom' ? description : this.service.translate(description);
  }
}
