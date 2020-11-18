import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemeService } from '../../../../theme/theme.service';
import { MvdaAnnouncementOption } from '../mvda-announcement-option';

@Component({
  selector: 'mrclean-mvda-add',
  templateUrl: './mvda-add.component.html',
  styleUrls: ['./mvda-add.component.scss'],
})
export class MvdaAddComponent implements OnInit {
  mvdaData: { [key: string]: any } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MvdaAnnouncementOption,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    // sort custom fields and their drop down options prior to displaying them
    this.data.customFields = [...this.data.customFields].sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });

    this.data.customFields = this.data.customFields.map((field) => {
      if (field.options) {
        field.options = [...field.options].sort((a, b) => {
          return a.sortOrder - b.sortOrder;
        });
      }
      return field;
    });
  }

  trackFnc(index) {
    return index;
  }
}
