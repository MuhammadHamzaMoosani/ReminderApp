// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { BaseApiService } from './base-api-service.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService<User> {
  protected baseUrl = '/api/users';

  constructor(http: HttpClient) {
    super(http);
  }
}
