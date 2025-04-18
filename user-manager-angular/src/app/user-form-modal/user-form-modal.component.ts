import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService, User} from '../service/ath.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-user-form-modal',
  imports: [
    FormsModule, NgIf
  ],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.css'
})
export class UserFormModalComponent {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  errorMessage: string = '';
  successMessage: string = '';
  validationErrors: { [key: string]: string } = {};

  constructor(private authService: AuthService) {
  }

  save(): void {
    if (this.user) {
      const request = this.user.id === 0
        ? this.authService.createUser(this.user)
        : this.authService.updateUser(this.user.id, this.user);

      request.subscribe({
        next: (updatedUser: User) => {
          this.successMessage = this.user!.id === 0
            ? 'Thêm người dùng thành công!'
            : 'Cập nhật người dùng thành công!';
          this.errorMessage = '';
          this.validationErrors = {};
          setTimeout(() => {
            this.close.emit();
            this.successMessage = '';
          }, 2000);
        },
        error: (err: any) => {
          this.successMessage = '';
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


  closeModal(): void {
    this.close.emit();
  }
}
