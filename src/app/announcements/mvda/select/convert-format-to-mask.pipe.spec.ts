import { inject, TestBed } from '@angular/core/testing';

import { ConvertFormatToMaskPipe } from './convert-format-to-mask.pipe';

describe('ConvertFormatToMaskPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertFormatToMaskPipe],
    });
  });

  it('should return data if data is falsey', inject(
    [ConvertFormatToMaskPipe],
    (pipe: ConvertFormatToMaskPipe) => {
      const result = pipe.transform('');
      expect(result).toBe('');
    },
  ));

  it('should return separator.2 given *,***,**0.00', inject(
    [ConvertFormatToMaskPipe],
    (pipe: ConvertFormatToMaskPipe) => {
      const result = pipe.transform('*,***,**0.00');
      expect(result).toBe('separator.2');
    },
  ));

  it('should return separator given *,***,**0', inject(
    [ConvertFormatToMaskPipe],
    (pipe: ConvertFormatToMaskPipe) => {
      const result = pipe.transform('*,***,**0');
      expect(result).toBe('separator');
    },
  ));

  it('should return null given any other truths', inject(
    [ConvertFormatToMaskPipe],
    (pipe: ConvertFormatToMaskPipe) => {
      const result = pipe.transform('blah');
      expect(result).toBeNull();
    },
  ));
});
