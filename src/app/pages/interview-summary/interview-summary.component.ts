import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InterviewReportService } from '../../services/interview-report.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-interview-summary',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './interview-summary.component.html',
  styleUrls: ['./interview-summary.component.scss']
})
export class InterviewSummaryComponent implements OnInit {
  interviewForm: FormGroup;
  reports: any[] = []; // Holds the fetched interview reports

  constructor(private fb: FormBuilder, private reportService: InterviewReportService) {
    this.interviewForm = this.fb.group({
      name: ['', [Validators.required, this.noSpecialCharsValidator]],
      role: ['', [Validators.required, this.noSpecialCharsValidator]],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    }, { validators: this.dateRangeValidator });
  }

  // Custom validator to check for special characters
  noSpecialCharsValidator(control: any) {
    const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces
    const valid = regex.test(control.value);
    return valid ? null : { invalidChars: true };
  }

  // Validator to check if the fromDate is before the toDate
  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup.get('fromDate')?.value;
    const toDate = formGroup.get('toDate')?.value;
    return fromDate && toDate && new Date(fromDate) > new Date(toDate)
      ? { dateRangeInvalid: true } : null;
  }

  // Fetch reports on component initialization
  ngOnInit(): void {
    this.reportService.getInterviewReports().subscribe((data) => {
      this.reports = data;
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.interviewForm.valid) {
      console.log(this.interviewForm.value);
      console.log("Successfully submitted");
      // Handle form submission here
    } else {
      console.log("Form is invalid");
      this.interviewForm.markAllAsTouched();
    }
  }
}
