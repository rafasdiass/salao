import { TestBed } from '@angular/core/testing';

import { ServiceExecutedService } from '../../shared/services/service-executed.service';

describe('ServiceExecutedService', () => {
  let service: ServiceExecutedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceExecutedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
