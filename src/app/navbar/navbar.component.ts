import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  isSidenavVisible = false;
  isLoggedIn = false;
  constructor(private auth: AuthService,private router:Router) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(val => this.isLoggedIn = val);
    this.auth.checkLogin();
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleSidenav() {
    this.isSidenavVisible = !this.isSidenavVisible;
  }

  closeSidenav() {
    this.isSidenavVisible = false;
  }
 toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }
  
}
