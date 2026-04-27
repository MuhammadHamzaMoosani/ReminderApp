import { Component } from '@angular/core';
import { ThemeServiceService } from '../theme-service.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  theme: 'light' | 'dark';
  isDarkTheme = true; // default


activeTab = 'info';

  profile = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    reminder: 'whatsapp',
    remindersEnabled: true
  };

  saveProfile() {
    alert('Profile updated! (hook up API here)');
  }

  deleteAccount() {
    if (confirm('Are you sure? This cannot be undone.')) {
      alert('Account deleted (hook up API here)');
    }
  }
  

  constructor(private themeService: ThemeServiceService) {
    this.theme = this.themeService.getTheme();
  }

  toggleTheme() {
    const newTheme: 'light' | 'dark' = this.isDarkTheme ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
   this.theme = newTheme;
  }
}
