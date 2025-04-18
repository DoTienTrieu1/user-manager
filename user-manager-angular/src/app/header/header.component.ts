import { Component } from '@angular/core';
import { AuthService } from '../service/ath.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loggedIn = false;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$.subscribe(status => {
      this.loggedIn = status;
    });
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }
}
