import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StackService } from '../../services/stack.service';
import { RoleService } from '../../services/role.service';
import { Stack } from '../../Models/stack';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

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

  displayedColumns: string[] = ['select', 'technology', 'experienceLevel', 'actions'];

  dataSource: any[] = [];
  selection = new SelectionModel<any>(true, []);

  constructor(private fb: FormBuilder, private stackService: StackService, private roleService: RoleService) {
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
    this.roleService.getRoles().subscribe({
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
    if (this.candidateForm.get('stackName')?.value && this.candidateForm.get('experienceLevel')?.value) {
      const newStack = {
        technology: this.candidateForm.get('stackName')?.value,
        experienceLevel: this.candidateForm.get('experienceLevel')?.value
      };

      // Add the new stack to the data source
      this.dataSource= [...this.dataSource, newStack];

      // Reset stackName and experienceLevel without triggering validation or displaying errors
      this.candidateForm.get('stackName')?.reset('', { emitEvent: false });
      this.candidateForm.get('experienceLevel')?.reset('', { emitEvent: false });

      // Clear the error state for stackName and experienceLevel
      this.candidateForm.get('stackName')?.markAsUntouched();
      this.candidateForm.get('experienceLevel')?.markAsUntouched();
    }
  }


  removeRow(element: any) {
    const index = this.dataSource.indexOf(element);
    if (index >= 0) {
      this.dataSource = this.dataSource.filter((_, i) => i !== index);
      this.selection.deselect(element);
    }
  }

  removeSelectedStacks() {
    this.selection.selected.forEach(item => {
      const index = this.dataSource.findIndex(stack => stack === item);
      if (index !== -1) {
        this.dataSource.splice(index, 1);
      }
    });
    this.dataSource = [...this.dataSource];
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.forEach(row => this.selection.select(row));
  }

  onSubmit() {
    if (this.candidateForm.valid) {
      const formData = this.candidateForm.value;
      const transformedData = {
        name: formData.name,
        role: formData.role,
        interviewDate: formData.interviewDate,
        stacks: this.dataSource
      };
      console.log('Transformed Data:', transformedData);
    } else {
      console.error('Form is invalid');
    }
  }
}
