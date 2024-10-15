import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private fb: FormBuilder,private router: Router,    private authService: AuthService,    private snackBar: MatSnackBar

  ) {}

  loginForm!:FormGroup;
  signupForm!: FormGroup;
  isFlipped = false; // Variable to track the card flip state



  ngOnInit(): void {
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
    });

    // Initialize the signup form with validators
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
    });
  }

// Custom validator for username
usernameValidator(control: AbstractControl): ValidationErrors | null {
  const username = control.value;

  // The first character must be a letter (a-zA-Z)
  // After the first character, letters (a-zA-Z), dots (.), and spaces are allowed
  const validUsername = /^[a-zA-Z][a-zA-Z. ]*$/.test(username);

  return validUsername ? null : { invalidUsername: true };
}


  // Custom validator for password
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
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
        noSpace: !hasNoSpace
      }
    };
  }

  // Flip the card to switch between login and signup forms
  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log(credentials);
      
      this.authService.login(credentials).subscribe({
        next: () => {
          console.log('Login successful');
          this.router.navigate(['/interview-helper/candidate-form']); // Navigate after login
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid login credentials.');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.showSnackbar('Please correct the errors in the form.', 'error');
    }
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      const newUser = this.signupForm.value;
      console.log(newUser);
      
      this.authService.register(newUser).subscribe({
        next: () => {
          console.log('Signup successful');
          this.flipCard(); // Flip back to login form after signup
        },
        error: (err) => {
          console.error('Signup failed:', err);
          alert('User registration failed.');
        },
      });
    } else {
      this.signupForm.markAllAsTouched();
      this.showSnackbar('Please correct the errors in the form.', 'error');
    }
  }

  showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
