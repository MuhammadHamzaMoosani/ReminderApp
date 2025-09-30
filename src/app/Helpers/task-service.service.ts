// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseApiService } from './base-api-service.service';
import { Task } from './models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService extends BaseApiService<Task> {
  protected baseUrl = '/api/tasks'; // ✅ task specific base url

  constructor(http: HttpClient) {
    super(http);
  }
}
