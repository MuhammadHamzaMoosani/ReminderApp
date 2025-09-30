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

  setTheme(value: 'light' | 'dark') {
    this.themeService.setTheme(value);
    this.theme = value; // update local display
  }
}
