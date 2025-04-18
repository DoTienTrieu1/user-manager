import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string = 'http://localhost:8080/user';
  private loggedInUser: User | null = null;
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginFromStorage());

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  register(user: User): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, user);
  }

  login(username: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, { username, password }, { responseType: 'text' as 'json' });
  }

  setLoggedInUser(user: User): void {
    this.loggedInUser = user;
    localStorage.setItem('token', 'true');
    this.loggedIn.next(true);
  }

  logout(): void {
    this.loggedInUser = null;
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  getLoggedInUser(): User | null {
    return this.loggedInUser;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  private checkLoginFromStorage(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Các hàm CRUD khác
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add`, user);
  }

  updateUser(id: number, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, updatedUser);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
