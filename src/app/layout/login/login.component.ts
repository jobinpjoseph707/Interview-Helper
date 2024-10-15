import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private fb: FormBuilder,private router: Router,    private authService: AuthService,
  ) {}

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
    }
  }
}
