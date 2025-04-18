import {Component, OnInit} from '@angular/core';
import {AuthService, User} from '../service/ath.service';
import { CommonModule } from '@angular/common';
import {UserFormModalComponent} from '../user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-user-manager',
  imports: [CommonModule, UserFormModalComponent],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err: any) => {
        console.error('Lỗi khi lấy danh sách:', err);
      }
    });
  }

  deleteUser(id: number): void {
    this.authService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Lỗi khi xóa:', err);
      }
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = { ...user };
  }

  openCreateModal(): void {
    this.selectedUser = { id: 0, username: '', email: '', password: '', phone: '', gender: '', role: '' };
  }
}
