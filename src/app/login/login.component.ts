import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
onSubmit(_t6: NgForm) {
throw new Error('Method not implemented.');
}
constructor(private auth:AuthService,private router:Router) {}

ngOnInit() {
  document.body.style.overflow = 'hidden';
}

ngOnDestroy() {
  document.body.style.overflow = '';
}
login()
{
  this.auth.login();
  this.router.navigate(['/dashboard']);

}
}
