import { TestBed } from '@angular/core/testing';

import { EventDispatchService } from './event-dispatch.service';

describe('EventDispatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventDispatchService = TestBed.inject(EventDispatchService);
    expect(service).toBeTruthy();
  });
});
