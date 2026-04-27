// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.models';
import { BaseApiService } from './base-api-service.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService<User> {
  protected baseUrl = 'http://localhost:3000/users';

  constructor(http: HttpClient) {
    super(http);
  }
  
  register(data: { name: string; email: string; phone: string; password: string }) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }
}
