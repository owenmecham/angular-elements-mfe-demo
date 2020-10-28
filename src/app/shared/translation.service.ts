import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translocoService: TranslocoService) {}

  translateAndSortAnnouncementsByDescription(announcements: any[]): any[] {
    return announcements
      .map((announcement) => ({
        ...announcement,
        description: this.translocoService.translate(announcement.description),
      }))
      .sort((a, b) => a.description.localeCompare(b.description, this.translocoService.getActiveLang()));
  }

  sortAnnouncementsByDescription(announcements: any[]): any[] {
    return [...announcements].sort((a, b) =>
      a.description.localeCompare(b.description, this.translocoService.getActiveLang()),
    );
  }

  translate(text: string) {
    return this.translocoService.translate(text);
  }
}
