import { TestBed } from '@angular/core/testing';

import { ExternalContextService } from './external-context.service';

describe('ExternalContextService', () => {
  let service: ExternalContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setToken tests', () => {
    it('should return provided token given non-empty string', () => {
      const value = 'token';
      service.setToken(value);
      expect(service.getToken()).toBe(value);
    });

    it('should return null given empty string', () => {
      const value = '';
      service.setToken(value);
      expect(service.getToken()).toBe(null);
    });
  });
});
