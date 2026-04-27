import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {

  constructor() { }
private themeSubject = new BehaviorSubject<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  theme$ = this.themeSubject.asObservable();

  setTheme(theme: 'light' | 'dark') {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
  }

  getTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }
}
