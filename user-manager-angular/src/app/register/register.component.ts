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
        console.error('Chi tiết lỗi:', err);

        this.validationErrors = {};
        this.errorMessage = '';

        if (err.status === 400 && err.error) {
          // Nếu backend trả về lỗi theo từng trường
          if (typeof err.error === 'object') {
            this.validationErrors = err.error;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Lỗi không xác định';
          }
        } else {
          this.errorMessage = err.error?.message || 'Có lỗi hệ thống xảy ra!';
        }
      }
    });
  }
}
