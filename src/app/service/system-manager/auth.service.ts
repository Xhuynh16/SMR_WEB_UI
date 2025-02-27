import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private defaultUser = {
    username: 'admin',
    password: 'admin123',
    fullName: 'Chuyên viên Phòng họp thông minh'
  };

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    if (username === this.defaultUser.username && password === this.defaultUser.password) {
      localStorage.setItem('currentUser', JSON.stringify(this.defaultUser));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
}
