import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interview-summary',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './interview-summary.component.html',
  styleUrls: ['./interview-summary.component.scss']
})
export class InterviewSummaryComponent {
  interviewForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.interviewForm = this.fb.group({
      name: ['', [Validators.required, this.noSpecialCharsValidator]],
      role: ['', [Validators.required, this.noSpecialCharsValidator]],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    }, { validators: this.dateRangeValidator });
  }

  noSpecialCharsValidator(control: any) {
    const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces
    const valid = regex.test(control.value);
    return valid ? null : { invalidChars: true };
  }

  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup.get('fromDate')?.value;
    const toDate = formGroup.get('toDate')?.value;
    return fromDate && toDate && new Date(fromDate) > new Date(toDate)
      ? { dateRangeInvalid: true } : null;
  }

  onSubmit(): void {
    if (this.interviewForm.valid) {
      console.log(this.interviewForm.value);
      console.log("Successfully submitted");
      // Handle form submission
    } else {
      console.log("Form is invalid");
      this.interviewForm.markAllAsTouched();
    }
  }
}
