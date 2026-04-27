import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { UserService } from '../Helpers/user-service.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

constructor(private auth:AuthService,private router:Router,private userService: UserService) {}

ngOnInit() {
  document.body.style.overflow = 'hidden';
}

ngOnDestroy() {
  document.body.style.overflow = '';
}

 loading = false;
  error: string | null = null;
toast = { message: '', type: 'success' as 'success' | 'error', visible: false };

private showToast(message: string, type: 'success' | 'error') {
  this.toast = { message, type, visible: true };
  setTimeout(() => (this.toast.visible = false), 3000);
}
 
  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.loading = true;
    this.error = null;


    this.userService.login(form.value).subscribe({
      next: (res: any) => {
        this.auth.login(res.token);
        this.showToast('✅ Login Successful!', 'success');

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Login failed';
        this.showToast('❌ Login Failed!', 'error');

        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}
