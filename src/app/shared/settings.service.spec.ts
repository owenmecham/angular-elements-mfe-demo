import { ApiUrlType, SettingsService } from './settings.service';
import { TestBed } from '@angular/core/testing';
import { ExternalContextService } from './external-context.service';

describe('Settings Service', () => {
  let service: SettingsService;
  const externalContextServiceMock = jasmine.createSpyObj('ExternalContextService', ['getToken', 'setToken']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService, { provide: ExternalContextService, useValue: externalContextServiceMock }],
    });

    externalContextServiceMock.getToken.and.returnValue('theToken');
    service = TestBed.inject(SettingsService);
  });

  describe('createUrl tests', () => {
    it('should return a full url with query ? when missing', () => {
      const baseUrl = service.getApiUrlByType(ApiUrlType.Inventory);
      const relative = 'my/url';

      const result = service.createUrl(relative, ApiUrlType.Inventory);

      expect(result).toEqual(`${baseUrl}/${relative}?`);
    });

    it('should return a full url with query ? when not missing', () => {
      const baseUrl = service.getApiUrlByType(ApiUrlType.Inventory);
      const relative = 'my/url?';

      const result = service.createUrl(relative, ApiUrlType.Inventory);

      expect(result).toEqual(`${baseUrl}/${relative}`);
    });
  });

  describe('addTrailingSlashIfMissing tests', () => {
    it('should add trailing slash given url without trailing slash', () => {
      const result = service.addTrailingSlashIfMissing('someurl');

      expect(result).toEqual('someurl/');
    });

    it('should not add trailing slash given url with trailing slash', () => {
      const result = service.addTrailingSlashIfMissing('someurl/');

      expect(result).toEqual('someurl/');
    });
  });

  describe('createGetOptions', () => {
    it('should add authorization type header', () => {
      const result = service.createRequestOptions();

      expect(result.headers.get('ExternalContext')).toEqual('theToken');
    });

    it('should retun query params', () => {
      const params = {
        height: 1,
        width: 2,
      };

      const expected = {
        ['height']: '1',
        ['width']: '2',
      };

      const result = service.createRequestOptions(params);

      expect(result.params).toEqual(expected);
    });
  });
});
