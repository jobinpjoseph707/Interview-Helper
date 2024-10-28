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
import { Router } from '@angular/router';
import { QuestionRequest, TechnologyExperience } from '../../Models/questions.interface';
import {MatSnackBar} from '@angular/material/snack-bar'

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
  availableStackOptions: Stack[] = [];
  roleOptions: any[] = [];
  addedStacks: Array<{ technology: string; experienceLevel: string }> = [];
  isStackAdded: boolean = false;

  technologiesData:TechnologyExperience[]=[];

  displayedColumns: string[] = ['select', 'technology', 'experienceLevel', 'actions'];
  dataSource = new MatTableDataSource<{ technology: string; experienceLevel: string }>([]);
  selection = new SelectionModel<{ technology: string; experienceLevel: string }>(true, []);

  constructor(
    private fb: FormBuilder,
    private stackService: StackService,
    private candidateFormService: CandidateFormService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.candidateForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z. ]*$')]],
      role: ['', [Validators.required]],
      interviewDate: ['', Validators.required],
      stackName: [''],
      experienceLevel: ['']
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
    this.candidateFormService.loager;
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
        // Sort the stacks alphabetically by technology name
        this.stackOptions = data.sort((a, b) => a.technology.localeCompare(b.technology));
        this.availableStackOptions = [...this.stackOptions];
        console.log('Fetched and sorted stack options:', this.stackOptions);
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
        console.log('Loaded Roles:', this.roleOptions);
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  getExperienceOptions(stackName: string): string[] {
    const selectedStack = this.availableStackOptions.find(stack => stack.technology === stackName);
    return selectedStack ? selectedStack.experienceLevels.map(level => level.level) : [];
  }

  addStack() {
    const stackName = this.candidateForm.get('stackName')?.value;
    const experienceLevel = this.candidateForm.get('experienceLevel')?.value;

    if (stackName && experienceLevel) {
      this.addedStacks.push({ technology: stackName, experienceLevel: experienceLevel });
      this.dataSource.data = this.addedStacks;
      this.isStackAdded = true;

      // Remove the added technology from available options
      this.availableStackOptions = this.availableStackOptions.filter(stack => stack.technology !== stackName);

      // Clear stack fields after adding
      this.candidateForm.patchValue({
        stackName: '',
        experienceLevel: ''
      });
    }
  }

  removeRow(element: { technology: string; experienceLevel: string }) {
    const index = this.addedStacks.indexOf(element);
    if (index >= 0) {
      this.addedStacks.splice(index, 1);
      this.dataSource.data = [...this.addedStacks];
      this.selection.deselect(element);

      // Add the removed technology back to available options
      const removedStack = this.stackOptions.find(stack => stack.technology === element.technology);
      if (removedStack) {
        this.availableStackOptions.push(removedStack);

        // Sort the availableStackOptions in ascending order after adding
        this.availableStackOptions.sort((a, b) => a.technology.localeCompare(b.technology));
      }
    }
  }


  removeSelectedStacks() {
    this.selection.selected.forEach(selectedStack => {
      const removedStack = this.stackOptions.find(stack => stack.technology === selectedStack.technology);
      if (removedStack) {
        this.availableStackOptions.push(removedStack);
      }
    });

    this.addedStacks = this.addedStacks.filter(row => !this.selection.isSelected(row));
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

  isFormValid(): boolean {
    return !!(
      this.candidateForm.get('name')?.valid &&
      this.candidateForm.get('role')?.valid &&
      this.candidateForm.get('interviewDate')?.valid &&
      this.addedStacks.length > 0
    );
  }

  onSubmit() {
    if (this.isFormValid()) {
      const formData = this.candidateForm.value;

      console.log('Form Role:', formData.role);
      const selectedRole = this.roleOptions.find(role => role.name === formData.role);
      const roleId = selectedRole ? selectedRole.applicationRoleId : null;

      console.log('Selected Role:', selectedRole);
      console.log('Role ID:', roleId);

      const technologies = this.addedStacks.map(stack => {
        const selectedTechnology = this.stackOptions.find(opt => opt.technology === stack.technology);
        const selectedExperienceLevel = selectedTechnology?.experienceLevels.find(level => level.level === stack.experienceLevel);

        console.log('Selected Technology:', selectedTechnology);
        console.log('Experience Levels:', selectedTechnology?.experienceLevels);
        console.log('Selected Experience Level:', selectedExperienceLevel);

        if (selectedTechnology?.technologyId && selectedExperienceLevel?.id) {
          return {
            technologyId: selectedTechnology.technologyId,
            experienceLevelId: selectedExperienceLevel.id
          };
        } else {
          return null;
        }
      }).filter(tech => tech !== null); // Filter out nulls

      // Get the date from the form and set it to Indian Standard Time
      const interviewDate = new Date(formData.interviewDate);
      const currentTime = new Date(); // Get the current time
      interviewDate.setHours(currentTime.getHours() + 5, currentTime.getMinutes() + 30, currentTime.getSeconds());

      const formattedInterviewDate = interviewDate.toISOString(); // This will include both date and time in ISO format

      const candidateData = {
        name: formData.name,
        applicationRoleId: roleId,
        interviewDate: formattedInterviewDate,
        technologies: technologies
      };

      console.log('Candidate Data:', candidateData);

      // Call the service to submit
      this.candidateFormService.submitCandidate(candidateData).subscribe(
        (response) => {
          console.log('Candidate submitted successfully', response);
          const QuestionRequest: QuestionRequest = {
            candidateName: response.name,
            candidateId: response.candidateId,
            technologies: candidateData.technologies
          };
          console.log('Candidate submitted successfully', QuestionRequest);

          // Show success message
          this.showSnackBar('Candidate submitted successfully', 'success');

          // Navigate to the question page
          this.router.navigate(['question-page'], { state: { QuestionRequest } });
        },
        (error) => {
          console.error('Error submitting candidate:', error);
          // Show error message
          this.showSnackBar('Error submitting candidate. Please try again.', 'error');
        }
      );
    } else {
      console.error('Form is invalid or no stacks added');
      Object.values(this.candidateForm.controls).forEach(control => {
        control.markAsTouched();
      });
      // Show validation error message
      this.showSnackBar('Please fill out all required fields and add at least one technology stack.', 'error');
    }
  }





  // Helper method to show SnackBar
  private showSnackBar(message: string, action: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: action === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }








  resetForm() {
    this.candidateForm.reset();
    this.addedStacks = [];
    this.dataSource.data = [];
    this.isStackAdded = false;
    this.selection.clear();
    this.availableStackOptions = [...this.stackOptions]; // Reset available options
  }


}
