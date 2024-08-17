import { TestBed } from '@angular/core/testing';

import { LoginServerService } from './login-server.service';

describe('LoginServerService', () => {
  let service: LoginServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
