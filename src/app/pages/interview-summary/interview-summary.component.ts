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
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator'; // Import PageEvent for paginator
import { MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginatorModule
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
    HttpClientModule,
    MatPaginatorModule // Add MatPaginatorModule to imports
  ],
  templateUrl: './interview-summary.component.html',
  styleUrls: ['./interview-summary.component.scss']
})
export class InterviewSummaryComponent implements OnInit {
  interviewForm: FormGroup;
  reports: any[] = []; // Holds the fetched interview reports
  pagedReports: any[] = []; // Reports for the current page
  roleOptions: any[] = [];
  pageSize = 4; // Default page size
  currentPage = 0; // Current page index

  constructor(private fb: FormBuilder, private reportService: InterviewReportService, private stackService: StackService) {
    this.interviewForm = this.fb.group({
      name: ['', [this.noSpecialCharsValidator]],
      role: ['', [Validators.required,this.noSpecialCharsValidator]],
      fromDate: [''],
      toDate: [''],
    });

    // Add listeners to update date validations
    this.interviewForm.get('fromDate')?.valueChanges.subscribe(() => this.updateDateValidations());
    this.interviewForm.get('toDate')?.valueChanges.subscribe(() => this.updateDateValidations());
  }

  // Custom validator to check for special characters
  noSpecialCharsValidator(control: any) {
    if (!control.value) {
      return null; // Allow empty values
    }
    const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces
    const valid = regex.test(control.value);
    return valid ? null : { invalidChars: true };
  }

  // Update date validations based on current values
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

  // Fetch reports on component initialization
  ngOnInit(): void {
    this.reportService.getInterviewReports().subscribe((data) => {
      this.reports = data;
      this.updatePagedReports(); // Initialize paged reports after fetching data
      this.fetchRoles();
    });
  }
  fetchRoles() {
    this.stackService.getRoles().subscribe(
      (roles) => {
        this.roleOptions = roles;
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }
  // Handle form submission
  onSubmit(): void {
    if (this.interviewForm.valid) {
      const formValues = this.interviewForm.value;
      this.searchReports(formValues);
    }
  }

  // Function to search reports based on filters
  searchReports(queryParams: any): void {
    // Filter reports based on search criteria
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

    this.updatePagedReports(); // Update paged reports after filtering
  }

  // Update paged reports based on current page and page size
  updatePagedReports() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedReports = this.reports.slice(startIndex, endIndex);
  }

  // Handle paginator page change event
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedReports(); // Update displayed reports based on new page
  }
  downloadExpandedReport(report: any) {
    const doc = new jsPDF();

    // Add report details to PDF
    doc.setFontSize(16);
    doc.text('Interview Report', 10, 10);
    doc.setFontSize(12);
    doc.text(`Name: ${report.name}`, 10, 20);
    doc.text(`Date: ${report.date}`, 10, 30);
    doc.text(`Role: ${report.role}`, 10, 40);
    doc.text(`Overall Percentage: ${report.overallPercentage}%`, 10, 50);
    doc.text('Stack Details:', 10, 60);

    // Adding stack details to PDF
    let yOffset = 70;
    report.stacks.forEach((stack: any) => {
      doc.text(`Technology: ${stack.technology}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Experience Level: ${stack.experience}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Percentage: ${stack.percentage}%`, 10, yOffset);
      yOffset += 15;
    });

    // Save PDF file
    doc.save(`${report.name}-report.pdf`);
  }
}
