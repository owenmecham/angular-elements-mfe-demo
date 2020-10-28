import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertFormatToMask',
})
export class ConvertFormatToMaskPipe implements PipeTransform {
  transform(data: string): string {
    if (!data) {
      return data;
    }

    if (data === '*,***,**0.00') {
      return 'separator.2';
    }

    if (data === '*,***,**0') {
      return 'separator';
    }

    console.warn('Unsupported format string: ', data);
    return null;
  }
}
