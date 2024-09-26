import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { StackService } from '../../services/stack.service';
import { RoleService } from '../../services/role.service'; // Import RoleService
import { Stack } from '../../Models/stack';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-page',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './candidate-page.component.html',
  styleUrls: ['./candidate-page.component.scss'],
})
export class CandidatePageComponent implements OnInit {
  candidateForm: FormGroup;
  stackOptions: Stack[] = [];
  roleOptions: any[] = []; // To store role options
  addedStacks!: FormArray;

  constructor(private fb: FormBuilder, private stackService: StackService, private roleService: RoleService) {
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      role: ['', [Validators.required]],
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
      // Additional logic can be implemented here if needed
    }
  }

  ngOnInit(): void {
    this.loadStacks();
    this.loadRoles(); // Load roles on component initialization
    this.addInitialStack();
    const today = new Date();
    const formattedDate = this.formatDate(today);
    this.candidateForm.patchValue({
      interviewDate: formattedDate
    }); // Add one initial stack on component load
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

  // Load role options from the service
  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roleOptions = roles; // Assign the fetched role data
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  // Adds the initial stack (cannot be removed)
  addInitialStack() {
    const stackGroup = this.createStackGroup();
    this.stacks.push(stackGroup);
  }

  // Get experience levels for a selected stack
  getExperienceOptions(stackName: string): string[] {
    const selectedStack = this.stackOptions.find(stack => stack.technology === stackName);
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
