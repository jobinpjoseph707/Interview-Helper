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
import { ExperienceLevel } from '../../Models/experience-level';  // Import as a type, not injected
import { Router } from '@angular/router';
import { QuestionRequest, TechnologyExperience } from '../../Models/questions.interface';

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

  technologiesData:TechnologyExperience[]=[];
  
  displayedColumns: string[] = ['select', 'technology', 'experienceLevel', 'actions'];
  dataSource = new MatTableDataSource<{ technology: string; experienceLevel: string }>([]);
  selection = new SelectionModel<{ technology: string; experienceLevel: string }>(true, []);

  constructor(
    private fb: FormBuilder,
    private stackService: StackService,
    private candidateFormService: CandidateFormService,
    private router: Router
  ) {
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
        this.stackOptions = data;  // Assign the data to stackOptions
        console.log('Fetched stack options:', this.stackOptions); // Log the fetched data
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
            console.log('Loaded Roles:', this.roleOptions); // Log role options for debugging
        },
        error: (error) => {
            console.error('Error loading roles:', error);
        }
    });
}


  getExperienceOptions(stackName: string): string[] {
    const selectedStack = this.stackOptions.find(stack => stack.technology === stackName);
    return selectedStack ? selectedStack.experienceLevels.map(level => level.level) : [];
  }

  addStack() {
    const stackName = this.candidateForm.get('stackName')?.value;
    const experienceLevel = this.candidateForm.get('experienceLevel')?.value;

    if (stackName && experienceLevel) {
      this.addedStacks.push({ technology: stackName, experienceLevel: experienceLevel });
      this.dataSource.data = this.addedStacks;
      this.isStackAdded = true;
      // Clear stack fields after adding if needed
    }
  }

  removeRow(element: { technology: string; experienceLevel: string }) {
    const index = this.addedStacks.indexOf(element);
    if (index >= 0) {
      this.addedStacks.splice(index, 1);
      this.dataSource.data = [...this.addedStacks];
      this.selection.deselect(element);
    }
  }

  removeSelectedStacks() {
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

  onSubmit() {
    if (this.candidateForm.valid && this.addedStacks.length > 0) {
        const formData = this.candidateForm.value;

        // Log form role
        console.log('Form Role:', formData.role);

        // Extract role ID
        // Change 'roleName' to 'name' to match the structure of roleOptions
        const selectedRole = this.roleOptions.find(role => role.name === formData.role);
        const roleId = selectedRole ? selectedRole.applicationRoleId : null; // Correct property used

        console.log('Selected Role:', selectedRole);
        console.log('Role ID:', roleId);

        // Prepare technologies
        const technologies = this.addedStacks.map(stack => {
            const selectedTechnology = this.stackOptions.find(opt => opt.technology === stack.technology);
            const selectedExperienceLevel = selectedTechnology?.experienceLevels.find(level => level.level === stack.experienceLevel);

            console.log('Selected Technology:', selectedTechnology);
            console.log('Experience Levels:', selectedTechnology?.experienceLevels);
            console.log('Selected Experience Level:', selectedExperienceLevel);

            if (selectedTechnology?.technologyId && selectedExperienceLevel?.id) {
              return {
                  technologyId: selectedTechnology.technologyId,  // Ensure it is a number
                  experienceLevelId: selectedExperienceLevel.id  // Ensure it is a number
              };
          } else {
              return null;  // Return null if the values are invalid
          }
      })
      .filter(tech => tech !== null);

        // Final candidate data
        const formattedInterviewDate = new Date(formData.interviewDate).toISOString().split('T')[0];
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
                const QuestionRequest:QuestionRequest={
                  candidateName:response.name,
                  candidateId:response.candidateId,
                  technologies:candidateData.technologies
                }
                // this.technologiesData=candidateData.technologies
                console.log('Candidate submitted successfully', QuestionRequest);
                // this.resetForm();
                this.router.navigate(['/question-page'], { state: { QuestionRequest } });
              },
            (error) => {
                console.error('Error submitting candidate:', error);
            }
        );
    } else {
        console.error('Form is invalid or no stacks added');
        Object.values(this.candidateForm.controls).forEach(control => {
            control.markAsTouched();
        });
    }
    // this.router.navigate(['/question-page']);
}





  resetForm() {
    this.candidateForm.reset();
    this.addedStacks = [];
    this.dataSource.data = [];
    this.isStackAdded = false;
    this.selection.clear();
  }
}
