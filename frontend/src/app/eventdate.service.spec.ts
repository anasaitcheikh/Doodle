import { TestBed } from '@angular/core/testing';

import { EventdateService } from './eventdate.service';

describe('EventdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventdateService = TestBed.get(EventdateService);
    expect(service).toBeTruthy();
  });
});
