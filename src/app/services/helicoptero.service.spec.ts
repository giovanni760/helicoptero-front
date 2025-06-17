import { TestBed } from '@angular/core/testing';

import { HelicopteroService } from './helicoptero.service';

describe('HelicopteroService', () => {
  let service: HelicopteroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelicopteroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
