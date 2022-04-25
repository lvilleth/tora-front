import { TestBed } from '@angular/core/testing';

import { ToraService } from './tora.service';

describe('ToraService', () => {
  let service: ToraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
