import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('flipState', [
      state('front', style({
        transform: 'rotateY(0)'
      })),
      state('back', style({
        transform: 'rotateY(180deg)'
      })),
      transition('front => back', animate('400ms ease-out')),
      transition('back => front', animate('400ms ease-in'))
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isFlipped = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
    });

    this.signupForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
    });
  }

  usernameValidator(control: AbstractControl): ValidationErrors | null {
    const username = control.value;
    if (!username) return null;
    const validUsername = /^[a-zA-Z][^\s]*$/.test(username);
    return validUsername ? null : { invalidUsername: true };
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasNoSpace = !/\s/.test(password);

    const valid = hasMinLength && hasSpecialChar && hasNumber && hasNoSpace;

    if (valid) {
      return null;
    }

    return {
      invalidPassword: {
        minLength: !hasMinLength,
        specialChar: !hasSpecialChar,
        number: !hasNumber,
        noSpace: !hasNoSpace,
      },
    };
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
    this.resetForm(this.isFlipped ? this.loginForm : this.signupForm);
  }

  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/interview-helper/candidate-form']);
        },
        error: (err) => {
          this.snackBar.open('Login failed. Please try again.', 'Close', { duration: 3000 });
          console.error('Login failed:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      const newUser = this.signupForm.value;

      this.authService.register(newUser).subscribe({
        next: () => {
          this.snackBar.open('Sign up successful! Please login.', 'Close', { duration: 3000 });
          this.flipCard();
        },
        error: (err) => {
          this.snackBar.open('Sign up failed. Please try again.', 'Close', { duration: 3000 });
          console.error('Signup failed:', err);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
