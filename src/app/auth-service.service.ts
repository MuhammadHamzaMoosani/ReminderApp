import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  login(token: string) {
    this.loggedIn.next(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', token);
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  }

  checkLogin() {
    const stored = localStorage.getItem('isLoggedIn') === 'true';
    this.loggedIn.next(stored);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
