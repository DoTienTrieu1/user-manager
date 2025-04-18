import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { NgIf } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { AuthService, User } from '../service/ath.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule, RouterModule, NgIf
  ],
  templateUrl: 'register.component.html',
  styleUrl: 'register.component.css'
})
export class RegisterComponent {
  user: User = { id: 0, username: '', email: '', password: '', phone: '', gender: '', role: '' };
  errorMessage: string = '';
  validationErrors: { [key: string]: string } = {};

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.user).subscribe({
      next: (message: string) => {
        this.errorMessage = '';
        this.validationErrors = {};
        setTimeout(() => this.router.navigate(['/login']));
      },
      error: (err: any) => {
        console.error('Lỗi chi tiết:', err);
        this.validationErrors = {};
        if (err.status === 400 && err.error && typeof err.error === 'object') {
          this.validationErrors = err.error;
        } else {
          this.errorMessage = err.error?.message || 'Có lỗi xảy ra!';
        }
      }
    });
  }
}
