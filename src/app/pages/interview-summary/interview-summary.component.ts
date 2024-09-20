import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      name: [''],
      role: [''],
      fromDate: [null],
      toDate: [null],

    });
  }

  onSubmit(): void {
    console.log(this.interviewForm.value);
    console.log("Successfully submitted");
    // Handle form submission
  }
}
