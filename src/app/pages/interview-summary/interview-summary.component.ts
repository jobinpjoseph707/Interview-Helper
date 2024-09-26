import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
      fromDate: [null],
      toDate: [null],
    }, { validators: this.dateRangeValidator });
  }

  // Custom validator to check for special characters
  noSpecialCharsValidator(control: any) {
    const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces
    const valid = regex.test(control.value);
    return valid ? null : { invalidChars: true };
  }

  // Validator to check if either fromDate or toDate is selected and handle date range logic
  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup.get('fromDate')?.value;
    const toDate = formGroup.get('toDate')?.value;

    if ((!fromDate && toDate) || (fromDate && !toDate)) {
      return { bothDatesRequired: true }; // One date selected but not the other
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      return { dateRangeInvalid: true }; // fromDate is after toDate
    }

    return null;
  }

  // Fetch reports on component initialization
  ngOnInit(): void {
    this.reportService.getInterviewReports().subscribe((data) => {
      this.reports = data;
    });
  }

  // Handle form submission
  onSubmit(): void {
    const formValues = this.interviewForm.value;

    // Prepare query parameters based on form values
    const queryParams: any = {};

    if (formValues.name) {
      queryParams.name = formValues.name;
    }
    if (formValues.role) {
      queryParams.role = formValues.role;
    }
    if (formValues.fromDate) {
      queryParams.fromDate = formValues.fromDate;
    }
    if (formValues.toDate) {
      queryParams.toDate = formValues.toDate;
    }

    // Perform search using the query parameters
    this.searchReports(queryParams);
  }

  // Mock function to search reports based on filters
  searchReports(queryParams: any): void {
    // Implement search logic here, which could involve calling a service to filter data
    this.reports = this.reports.filter(report => {
      let matches = true;

      if (queryParams.name && !report.name.toLowerCase().includes(queryParams.name.toLowerCase())) {
        matches = false;
      }
      if (queryParams.role && !report.role.toLowerCase().includes(queryParams.role.toLowerCase())) {
        matches = false;
      }
      if (queryParams.fromDate && new Date(report.date) < new Date(queryParams.fromDate)) {
        matches = false;
      }
      if (queryParams.toDate && new Date(report.date) > new Date(queryParams.toDate)) {
        matches = false;
      }

      return matches;
    });
  }
}
