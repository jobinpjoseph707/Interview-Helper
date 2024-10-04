import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InterviewReportService } from '../../services/interview-report.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { jsPDF } from 'jspdf';
import { StackService } from '../../services/stack.service';

@Component({
  selector: 'app-interview-summary',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule
  ],
  templateUrl: './interview-summary.component.html',
  styleUrls: ['./interview-summary.component.scss']
})
export class InterviewSummaryComponent implements OnInit {
  interviewForm: FormGroup;
  reports: any[] = [];
  pagedReports: any[] = [];
  roleOptions: any[] = [];
  pageSize = 4;
  currentPage = 0;

  constructor(
    private fb: FormBuilder,
    private reportService: InterviewReportService,
    private stackService: StackService
  ) {
    this.interviewForm = this.fb.group({
      name: ['', [this.noSpecialCharsValidator]],
      role: ['', [this.noSpecialCharsValidator]],
      fromDate: [''],
      toDate: ['']
    }, { validator: this.dateRangeValidator });

    this.interviewForm.get('fromDate')?.valueChanges.subscribe(() => this.updateDateValidations());
    this.interviewForm.get('toDate')?.valueChanges.subscribe(() => this.updateDateValidations());

    this.interviewForm.valueChanges.subscribe(() => this.onSubmit());
  }

  ngOnInit(): void {
    this.fetchReports();
    this.fetchRoles();
  }

  fetchReports(queryParams: any = {}): void {
    this.reportService.getFilteredInterviewReports(queryParams).subscribe({
      next: (data) => {
        console.log('Fetched interview reports:', data);
        this.reports = data;
        this.updatePagedReports();
      },
      error: (error) => {
        console.error('Error fetching interview reports:', error);
      }
    });
  }

  fetchRoles() {
    this.stackService.getRoles().subscribe(
      (roles) => {
        this.roleOptions = roles;
        console.log('Fetched Role Options:', this.roleOptions);
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  onSubmit() {
    console.log('onSubmit method called');
    console.log('Current Form State:', this.interviewForm.value);
    console.log('Is Form Valid:', this.interviewForm.valid);

    if (this.interviewForm.valid) {
      const queryParams: any = {};

      const name = this.interviewForm.get('name')?.value;
      if (name) queryParams.name = name;

      const selectedRoleName = this.interviewForm.get('role')?.value;

      if (selectedRoleName) {

        const selectedRole = this.roleOptions.find(role => role.name === selectedRoleName);

        if (selectedRole) {
          queryParams.roleId = selectedRole.applicationRoleId; 
        }
      }

      const fromDate = this.interviewForm.get('fromDate')?.value;
      if (fromDate) queryParams.fromDate = fromDate.toISOString();

      const toDate = this.interviewForm.get('toDate')?.value;
      if (toDate) queryParams.toDate = toDate.toISOString();

      console.log('Query Params for search:', queryParams);
      this.fetchReports(queryParams);
    } else {
      console.log('Form is invalid', this.interviewForm.errors);
      Object.keys(this.interviewForm.controls).forEach(key => {
        const control = this.interviewForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  resetForm() {
    this.interviewForm.reset();
    this.fetchReports();
  }

  updatePagedReports() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedReports = this.reports.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedReports();
  }

  noSpecialCharsValidator(control: any) {
    if (!control.value) {
      return null; // Allow empty values
    }
    const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces
    const valid = regex.test(control.value);
    return valid ? null : { invalidChars: true };
  }

  updateDateValidations() {
    const fromDate = this.interviewForm.get('fromDate');
    const toDate = this.interviewForm.get('toDate');

    if (fromDate?.value && toDate?.value) {
      if (new Date(fromDate.value) > new Date(toDate.value)) {
        toDate.setErrors({ dateRangeInvalid: true });
      } else {
        toDate.setErrors(null);
      }
    } else {
      toDate?.setErrors(null);
    }
  }

  dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;

    if (!fromDate && !toDate) {
      return null; // No date validation required if both are empty
    }

    if (fromDate && !toDate) {
      return { toDateRequired: true }; // To date is required when from date is provided
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      return { dateRangeInvalid: true }; // To date must be after from date
    }

    return null; // Valid date range
  }

  downloadExpandedReport(report: any) {
    const doc = new jsPDF();

    // Add report details to PDF
    doc.setFontSize(16);
    doc.text('Interview Report', 10, 10);
    doc.setFontSize(12);
    doc.text(`Name: ${report.name}`, 10, 20);
    doc.text(`Date: ${report.interviewDate}`, 10, 30);
    doc.text(`Role: ${report.applicationRoleName}`, 10, 40);
    doc.text(`Overall Score: ${report.overallScore}%`, 10, 50);
    doc.text('Technology Details:', 10, 60);

    // Adding technology details to PDF
    let yOffset = 70;
    report.technologies.forEach((tech: any) => {
      doc.text(`Technology: ${tech.technologyName}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Experience Level: ${tech.experienceLevelName}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Score: ${tech.score}%`, 10, yOffset);
      yOffset += 15;
    });

    // Save PDF file
    doc.save(`${report.name}-report.pdf`);
  }
}
