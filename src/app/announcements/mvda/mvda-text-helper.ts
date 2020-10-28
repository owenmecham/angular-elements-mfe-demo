import { Injectable } from '@angular/core';
import { MvdaAnnouncementOption, MvdaCustomField, MvdaDropDownOption } from './mvda-announcement-option';
import { CurrencyPipe } from '@angular/common';
import { ApiMvdaAnnouncement } from './api-mvda-announcement';
import { MvdaDisclosure } from './mvda-disclosure';
import { TranslationService } from '../../shared/translation.service';

@Injectable({
  providedIn: 'root',
})
export class MvdaTextHelper {
  constructor(private currencyFormatter: CurrencyPipe, private translationService: TranslationService) {}

  buildMvdaDisclosureText(mvdaOption: MvdaAnnouncementOption, announcement: ApiMvdaAnnouncement): string {
    if (!mvdaOption) {
      return announcement.display;
    }

    const mvdaCustomFields = this.sortCustomFields(mvdaOption.customFields);

    const disclosureText = mvdaCustomFields
      .map((field) => this.getFieldDisclosureText(field, announcement.disclosureDetails))
      .filter((disclosure) => disclosure)
      .join('\n');

    const translatedDescription = this.translationService.translate(mvdaOption.description);

    return `${translatedDescription}\n${disclosureText}`;
  }

  getMvdaDisclosureValues(mvdaOption: MvdaAnnouncementOption, disclosureDetails: MvdaDisclosure): string[] {
    return mvdaOption.customFields
      .map((field) => this.getFieldDisclosureValue(field, disclosureDetails))
      .filter((disclosure) => disclosure);
  }

  private sortCustomFields(mvdaCustomFields: MvdaCustomField[]): MvdaCustomField[] {
    return (mvdaCustomFields || []).sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1));
  }

  private getFieldDisclosureText(field: MvdaCustomField, disclosureDetails: MvdaDisclosure): string {
    const fieldValue = this.getFieldDisclosureValue(field, disclosureDetails);

    if (!fieldValue) {
      return null;
    }

    const translatedLabel = this.translationService.translate(`custom-field-${field.name}`);

    return `${translatedLabel}: ${fieldValue}`;
  }

  private getFieldDisclosureValue(field: MvdaCustomField, disclosureDetails: MvdaDisclosure): string {
    let value = this.getFieldValue(disclosureDetails, field.name);

    if ((field.controlType || '').toLowerCase() === 'dropdown') {
      value = this.convertDropdownKeyToDescription(value, field.options);
    }

    if (value) {
      return this.formatValue(value, field.dataType);
    }

    return null;
  }

  private getFieldValue(disclosureDetails: MvdaDisclosure, fieldName: string): string {
    const key = Object.keys(disclosureDetails).find(
      (x) => x.toLowerCase() === (fieldName || '').toLowerCase(),
    );
    return disclosureDetails[key];
  }

  private convertDropdownKeyToDescription(value: string, options: MvdaDropDownOption[]) {
    const fieldOption = options.find((option) => option.key === value);
    const description = fieldOption ? fieldOption.value : value;
    return this.translationService.translate(`custom-option-${description}`);
  }

  private formatValue(value: string, dataType: string): string {
    if (dataType === 'datetime') {
      return new Date(value).toLocaleDateString();
    }

    if (dataType === 'money') {
      return this.currencyFormatter.transform(value);
    }

    return value;
  }
}
