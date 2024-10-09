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
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ExcelServiceService } from '../../services/excel-service.service';
import {MatSnackBar} from '@angular/material/snack-bar'

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
    MatPaginatorModule,
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
    private stackService: StackService,
    private excelExportService: ExcelServiceService,
    private snackBar: MatSnackBar
  ) {
    this.interviewForm = this.fb.group({
      name: ['', [this.noSpecialCharsValidator]],
      role: ['', [this.noSpecialCharsValidator]],
      fromDate: [''],
      toDate: ['']
    }, { validator: this.dateRangeValidator });

    this.interviewForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.updateDateValidations();
        this.onSubmit(); // Only submit after debounce and form validation check
      });
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
    if (!this.interviewForm.valid) {
      this.snackBar.open('Form is invalid. Please correct the errors.', 'Close', { duration: 3000 });
      return;
    }

    console.log('onSubmit method called');
    console.log('Current Form State:', this.interviewForm.value);
    console.log('Is Form Valid:', this.interviewForm.valid);

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
    const toDate = this.interviewForm.get('toDate')?.value;
    if (fromDate && toDate) {
      queryParams.fromDate = fromDate.toISOString();
      queryParams.toDate = toDate.toISOString();
    }

    console.log('Query Params for search:', queryParams);
    this.fetchReports(queryParams);

  
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

  downloadExpandedReport(report: any) {
    this.snackBar.open('Generating PDF report...', 'Close', { duration: 3000 });

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

    this.snackBar.open('PDF report downloaded!', 'Close', { duration: 3000 });
  }


  downloadExpandedExcelReport(report: any): void {
    const reportData = report.technologies.map((stack: any) => ({
      'Technology': stack.technologyName,
      'Experience Level': stack.experienceLevelName,
      'Score (%)': stack.score
    }));

    this.excelExportService.exportToExcel(reportData, `Report_${report.name}`);
  }

  downloadAllReports(): void {
    this.snackBar.open('Downloading all reports...', 'Close', { duration: 3000 });

    const allReportsData = this.reports.flatMap(report => report.technologies.map((stack: any) => ({
      'Candidate Name': report.name,
      'Interview Date': report.interviewDate,
      'Application Role': report.applicationRoleName,
      'Overall Score (%)': report.overallScore,
      'Technology': stack.technologyName,
      'Experience Level': stack.experienceLevelName,
      'Score (%)': stack.score
    })));

    this.excelExportService.exportToExcel(allReportsData, 'All_Reports');

    this.snackBar.open('All reports downloaded successfully!', 'Close', { duration: 3000 });
  }


  dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      return { dateRangeInvalid: true };
    }

    return null;
  }
}

