import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  private apiBaseUrl = 'https://localhost:7116';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const payload = {
      username: this.username,
      password: this.password
    };

    this.http.post(`${this.apiBaseUrl}/api/Auth/user-login`, payload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.message = response;
          alert('Login Successful');
          localStorage.setItem('isLoggedIn', 'true'); // <-- Set login flag
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.message = 'Invalid username or password.';
          } else {
            this.message = 'Login failed. Try again later.';
          }
        }
      });
  }
}