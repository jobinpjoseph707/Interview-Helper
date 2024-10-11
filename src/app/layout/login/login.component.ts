import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private fb: FormBuilder,private router: Router) {}

  loginForm!:FormGroup;
  signupForm!: FormGroup;
  isFlipped = false; // Variable to track the card flip state

  ngOnInit(): void {
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Flip the card to switch between login and signup forms
  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login successful');
      // Logic to handle login submission
      this.router.navigate(['/interview-helper/candidate-form']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      console.log('Signup successful');
      // Logic to handle signup submission
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
