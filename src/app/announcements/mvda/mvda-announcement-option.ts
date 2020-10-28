export interface MvdaAnnouncementOption {
  id: number;
  description: string;
  code: string;

  customFields: MvdaCustomField[];
}

export interface MvdaCustomField {
  name: string;
  label: string;
  format: string;
  controlType: string;
  dataType: string;
  length: number;
  sortOrder: number;

  options: MvdaDropDownOption[];
}

export interface MvdaDropDownOption {
  key: string;
  value: string;
  sortOrder: number;
}
