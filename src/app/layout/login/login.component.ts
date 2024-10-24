import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isFlipped = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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
    const validUsername = /^[a-zA-Z][a-zA-Z. ]*$/.test(username);
    return validUsername ? null : { invalidUsername: true };
  }

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
      console.log(credentials);

      this.authService.login(credentials).subscribe({
        next: () => {
          console.log('Login successful');
          this.router.navigate(['/candidate-form']);
        },
        error: (err) => {
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
      console.log(newUser);

      this.authService.register(newUser).subscribe({
        next: () => {
          console.log('Signup successful');
          this.flipCard();
        },
        error: (err) => {
          console.error('Signup failed:', err);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
