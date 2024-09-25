import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { StackService } from '../../services/stack.service';
import { Stack } from '../../Models/stack';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-page',
  standalone:true,
  imports:[ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './candidate-page.component.html',
  styleUrls: ['./candidate-page.component.scss'],
})
export class CandidatePageComponent implements OnInit {
  candidateForm: FormGroup;
  stackOptions: Stack[] = []; // List of available stacks
  addedStacks!: FormArray; // FormArray to manage stacks

  constructor(private fb: FormBuilder, private stackService: StackService) {
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      role: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      interviewDate: ['', Validators.required],
      stacks: this.fb.array([])
    });
  }

  // Function to create a new stack FormGroup
  createStackGroup() {
    return this.fb.group({
      stackName: ['', Validators.required],
      experienceLevel: ['', Validators.required]
    });
  }

  // Adding a new stack to the FormArray
  addStack() {
    this.stacks.push(this.createStackGroup());
  }

  // Getter for the FormArray
  get stacks(): FormArray {
    return this.candidateForm.get('stacks') as FormArray;
  }

  // Removing a stack by index
  removeStack(index: number) {
    this.stacks.removeAt(index);
  }
  onStackChange(index: number): void {

    const lastStack = this.stacks.at(index);


    if (lastStack.get('stackName')?.value) {

    }
  }

  ngOnInit(): void {
    this.loadStacks();
    this.addInitialStack();
    const today = new Date();
    const formattedDate = this.formatDate(today);
    this.candidateForm.patchValue({
      interviewDate: formattedDate
    });// Add one initial stack on component load
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Load stack options from the service
  loadStacks() {
    this.stackService.getStacks().subscribe({
      next: (data) => {
        this.stackOptions = data; // Assign the fetched stack data
      },
      error: (error) => {
        console.error('Error loading stacks:', error);
      }
    });
  }


  // Adds the initial stack (cannot be removed)
  addInitialStack() {
    const stackGroup = this.fb.group({
      stackName: ['', Validators.required],
      experienceLevel: ['', Validators.required]
    });
    this.stacks.push(stackGroup);
  }


  // Get experience levels for a selected stack
  getExperienceOptions(stackName: string): string[] {
    const selectedStack = this.stackOptions.find(stack => stack.stackName === stackName);
    return selectedStack ? selectedStack.experienceLevels : [];
  }

  // Handle form submission
  onSubmit() {
    if (this.candidateForm.valid) {
      const formData = this.candidateForm.value;
      console.log('Form Data:', formData);

      const transformedData = {
        name: formData.name,
        role: formData.role,
        interviewDate: formData.interviewDate,
        stacks: formData.stacks // Use stacks from the form directly
      };

      console.log('Transformed Data:', transformedData);
    } else {
      console.error('Form is invalid');
    }
  }
}
