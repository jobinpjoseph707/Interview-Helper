import { TestBed } from '@angular/core/testing';

import { InterviewReportService } from './interview-report.service';

describe('InterviewReportService', () => {
  let service: InterviewReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterviewReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
