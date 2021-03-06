import { Component } from '@angular/core';
import { ThemeService } from '../../../theme/theme.service';
import { CustomAnnouncementService } from './custom-announcement.service';

@Component({
  selector: 'mrclean-custom-announcement',
  templateUrl: './custom-announcement.component.html',
  styleUrls: ['./custom-announcement.component.scss'],
})
export class CustomAnnouncementComponent {
  newCustomAnnouncement: string;

  constructor(
    private customAnnouncementService: CustomAnnouncementService,
    public themeService: ThemeService,
  ) {}

  addCustomAnnouncement() {
    if (this.newCustomAnnouncement) {
      this.customAnnouncementService.addCustomAnnouncement(this.newCustomAnnouncement);
      this.newCustomAnnouncement = '';
    }
  }
}
