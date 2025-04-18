import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgIf } from '@angular/common';
import {AuthService} from '../service/ath.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  validationErrors: { [key: string]: string } = {};

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (message: string) => {
        this.authService.setLoggedInUser({ id: 0, username: this.username, email: '', phone: '', gender: '', role: '' });
        setTimeout(() => this.router.navigate(['/user-manager']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Chi tiết lỗi:', err);
        if (err.status === 400 && typeof err.error === 'object') {
          this.validationErrors = err.error;
        } else {
          this.validationErrors = { general: 'Đăng nhập thất bại!' };
        }
      }
    });
  }

}

