import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MvdaAnnouncement } from './mvda-announcement';
import { ThemeService } from '../../../theme/theme.service';

@Component({
  selector: 'adesa-mvda-delete',
  templateUrl: './mvda-delete.component.html',
  styleUrls: ['./mvda-delete.component.scss'],
})
export class MvdaDeleteComponent {
  selectedReason: string;
  otherReason: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public announcement: MvdaAnnouncement,
    public themeService: ThemeService,
  ) {}

  getDeleteReason(): string {
    return this.selectedReason === 'Other' ? this.otherReason : this.selectedReason;
  }
}
