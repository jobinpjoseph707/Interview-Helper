import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatePageComponent } from './candidate-page.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StackService } from '../../services/stack.service';
import { CandidateFormService } from '../../services/candidate-form.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CandidatePageComponent', () => {
  let component: CandidatePageComponent;
  let fixture: ComponentFixture<CandidatePageComponent>;
  let stackService: jest.Mocked<StackService>;
  let candidateFormService: jest.Mocked<CandidateFormService>;
  let router: jest.Mocked<Router>;
  let snackBar: jest.Mocked<MatSnackBar>;

  const mockStacks = [
    {
      technology: 'Angular',
      technologyId: 1,
      experienceLevels: [
        { id: 1, level: 'Fresher' },
        { id: 2, level: 'Mid' }
      ]
    },
    {
      technology: 'React',
      technologyId: 2,
      experienceLevels: [
        { id: 3, level: 'Fresher' },
        { id: 4, level: 'Senior' }
      ]
    }
  ];

  const mockRoles = [
    { name: 'Front End Developer', applicationRoleId: 1 },
    { name: 'Back End Developer', applicationRoleId: 2 }
  ];

  beforeEach(async () => {
    const stackServiceMock = {
      getStacks: jest.fn(),
      getRoles: jest.fn()
    };
    const candidateFormServiceMock = {
      submitCandidate: jest.fn()
    };
    const routerMock = {
      navigate: jest.fn()
    };
    const snackBarMock = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        MatTableModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        CandidatePageComponent
      ],
      providers: [
        FormBuilder,
        { provide: StackService, useValue: stackServiceMock },
        { provide: CandidateFormService, useValue: candidateFormServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    stackService = TestBed.inject(StackService) as jest.Mocked<StackService>;
    candidateFormService = TestBed.inject(CandidateFormService) as jest.Mocked<CandidateFormService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;

    stackService.getStacks.mockReturnValue(of(mockStacks));
    stackService.getRoles.mockReturnValue(of(mockRoles));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // Form Initialization Tests
  describe('Form Initialization', () => {
    test('should create the component', () => {
      expect(component).toBeTruthy();
    });

    test('should initialize the form with empty values', () => {
      expect(component.candidateForm.get('name')?.value).toBe('');
      expect(component.candidateForm.get('role')?.value).toBe('');
      expect(component.candidateForm.get('stackName')?.value).toBe('');
      expect(component.candidateForm.get('experienceLevel')?.value).toBe('');
    });

    test('should load stacks on init', () => {
      expect(stackService.getStacks).toHaveBeenCalled();
      expect(component.stackOptions).toEqual(mockStacks);
    });
  });

  // Form Validation Tests
  describe('Form Validation', () => {
    test('should validate required name field', () => {
      const nameControl = component.candidateForm.get('name');
      expect(nameControl?.valid).toBeFalsy();
      expect(nameControl?.errors?.['required']).toBeTruthy();

      nameControl?.setValue('John');
      expect(nameControl?.valid).toBeTruthy();
      expect(nameControl?.errors).toBeNull();
    });

    test('should validate name pattern', () => {
      const nameControl = component.candidateForm.get('name');
      nameControl?.setValue('John123');
      expect(nameControl?.errors?.['pattern']).toBeTruthy();

      nameControl?.setValue('John Doe');
      expect(nameControl?.valid).toBeTruthy();
    });
  });

  // Stack Management Tests
  describe('Stack Management', () => {
    test('should add stack when valid', () => {
      component.candidateForm.patchValue({
        stackName: 'Angular',
        experienceLevel: 'Fresher'
      });
      component.addStack();

      expect(component.addedStacks.length).toBe(1);
      expect(component.addedStacks[0]).toEqual({
        technology: 'Angular',
        experienceLevel: 'Fresher'
      });
    });

    test('should remove stack when removeRow is called', () => {
      // Add a stack first
      component.candidateForm.patchValue({
        stackName: 'Angular',
        experienceLevel: 'Fresher'
      });
      component.addStack();

      // Then remove it
      component.removeRow(component.addedStacks[0]);
      expect(component.addedStacks.length).toBe(0);
    });
  });

  // Form Submission Tests
  describe('Form Submission', () => {
    beforeEach(() => {
      component.candidateForm.patchValue({
        name: 'John Doe',
        role: 'Front EndDeveloper',
        interviewDate: '2024-11-01'
      });
      component.candidateForm.patchValue({
        stackName: 'Angular',
        experienceLevel: 'Fresher'
      });
      component.addStack();
    });

    test('should submit form when valid', async () => {
      const mockResponse = {
        name: 'John Doe',
        candidateId: 1
      };

      candidateFormService.submitCandidate.mockReturnValue(of(mockResponse));

      await component.onSubmit();

      expect(candidateFormService.submitCandidate).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Candidate submitted successfully',
        'Close',
        expect.any(Object)
      );
    });

    test('should show error when submission fails', async () => {
      candidateFormService.submitCandidate.mockReturnValue(
        throwError(() => new Error('Submit failed'))
      );

      await component.onSubmit();

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error submitting candidate. Please try again.',
        'Close',
        expect.any(Object)
      );
    });
  });
});
