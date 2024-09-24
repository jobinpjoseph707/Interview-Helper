import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-page',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule], 
  templateUrl: './candidate-page.component.html',
  styleUrls: ['./candidate-page.component.scss']
})
export class CandidatePageComponent {
  candidateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      role: ['', Validators.required],
      candidateId: ['', Validators.required],
      stack: ['', Validators.required],
      interviewDate: ['', Validators.required],
      experience: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }
    console.log(this.candidateForm.value);
  }
}
