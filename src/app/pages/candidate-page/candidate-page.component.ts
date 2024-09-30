import { CandidateFormService } from './../../services/candidate-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StackService } from '../../services/stack.service';
import { Stack } from '../../Models/stack';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-candidate-page',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatTableModule, MatCheckboxModule],
  templateUrl: './candidate-page.component.html',
  styleUrls: ['./candidate-page.component.scss'],
})
export class CandidatePageComponent implements OnInit {
  candidateForm: FormGroup;
  stackOptions: Stack[] = [];
  roleOptions: any[] = [];
  addedStacks: Array<{ technology: string; experienceLevel: string }> = [];
  isStackAdded: boolean = false;



  displayedColumns: string[] = ['select', 'technology', 'experienceLevel', 'actions'];

  // Define dataSource as a MatTableDataSource instead of an array
  dataSource = new MatTableDataSource<{ technology: string; experienceLevel: string }>([]);
  selection = new SelectionModel<{ technology: string; experienceLevel: string }>(true, []);

  constructor(private fb: FormBuilder, private stackService: StackService, private candidateFormService: CandidateFormService) {
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      role: ['', [Validators.required]],
      interviewDate: ['', Validators.required],
      stackName: ['', Validators.required],
      experienceLevel: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadStacks();
    this.loadRoles();
    const today = new Date();
    const formattedDate = this.formatDate(today);
    this.candidateForm.patchValue({
      interviewDate: formattedDate
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadStacks() {
    this.stackService.getStacks().subscribe({
      next: (data) => {
        this.stackOptions = data;
      },
      error: (error) => {
        console.error('Error loading stacks:', error);
      }
    });
  }

  loadRoles() {
    this.stackService.getRoles().subscribe({
      next: (roles) => {
        this.roleOptions = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  getExperienceOptions(stackName: string): string[] {
    const selectedStack = this.stackOptions.find(stack => stack.technology === stackName);
    return selectedStack ? selectedStack.experienceLevels : [];
  }

  addStack() {
    const stackName = this.candidateForm.get('stackName')?.value;
    const experienceLevel = this.candidateForm.get('experienceLevel')?.value;

    if (stackName && experienceLevel) {
      // Add the new stack to the addedStacks array
      this.addedStacks.push({ technology: stackName, experienceLevel: experienceLevel });

      // Update the dataSource using the setter method
      this.dataSource.data = this.addedStacks; // This line correctly updates the table's data

      this.isStackAdded = true;

      // Clear stack fields after adding
      // this.candidateForm.patchValue({
      //   stackName: '',
      //   experienceLevel: ''
      // });
    }
  }



  removeRow(element: { technology: string; experienceLevel: string }) {
    const index = this.addedStacks.indexOf(element);
    if (index >= 0) {
      this.addedStacks.splice(index, 1);

      // Update the dataSource data to reflect the removed row
      this.dataSource.data = [...this.addedStacks];
      this.selection.deselect(element);
    }
  }

  removeSelectedStacks() {
    this.addedStacks = this.addedStacks.filter(row => !this.selection.isSelected(row));

    // Update the dataSource data with the filtered rows
    this.dataSource.data = [...this.addedStacks];
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data);
  }

  onSubmit() {
    console.log('Candidate Form Values:', this.candidateForm.value); // Log the current form values
    console.log('Is Form Valid:', this.candidateForm.valid); // Log the form validity
    console.log('Added Stacks:', this.addedStacks); // Log the added stacks to see their contents

    if (this.candidateForm.valid && this.addedStacks.length > 0) {
      const formData = this.candidateForm.value;

      const candidateData = {
        name: formData.name,
        role: formData.role,
        interview_date: formData.interviewDate,
        technologies: this.addedStacks.map(stack => ({
          technology: stack.technology,
          experience_level: stack.experienceLevel
        }))
      };

      this.candidateFormService.submitCandidate(candidateData).subscribe(
        (response) => {
          console.log('Candidate submitted successfully', response);
          this.resetForm(); // Reset the form after successful submission
        },
        (error) => {
          console.error('Error submitting candidate:', error);
        }
      );
    } else {
      console.error('Form is invalid or no stacks added');
      // Mark all form controls as touched to display validation messages
      Object.values(this.candidateForm.controls).forEach(control => {
        control.markAsTouched();
      });

      // Optionally: You could log which specific controls are invalid
      Object.entries(this.candidateForm.controls).forEach(([key, control]) => {
        if (control.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
    }
  )}
  }


  resetForm() {
    this.candidateForm.reset();
    this.addedStacks = [];
    this.dataSource.data = [];
    this.isStackAdded = false;
    this.selection.clear();
  }
}
