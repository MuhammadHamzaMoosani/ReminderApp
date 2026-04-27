import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { ThemeServiceService } from './theme-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})



export class AppComponent implements OnInit {
  title = 'ReminderApp';
  theme: 'light' | 'dark' = 'dark';

  constructor(private themeService: ThemeServiceService) {}

  ngOnInit() {
      AOS.init({
      duration: 800,   // animation speed
      easing: 'ease-in-out',
      once: false,     // 👈 allow re-animation when scrolling back
      mirror: true     // 👈 animate out when scrolling past
    });

    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  toggleTheme() {
    this.themeService.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }
}
