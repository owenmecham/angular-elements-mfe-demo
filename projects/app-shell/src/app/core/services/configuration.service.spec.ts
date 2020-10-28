import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [ConfigurationService], imports: [RouterTestingModule] }),
  );

  it('should be created', () => {
    const service: ConfigurationService = TestBed.inject(ConfigurationService);
    expect(service).toBeTruthy();
  });
});
