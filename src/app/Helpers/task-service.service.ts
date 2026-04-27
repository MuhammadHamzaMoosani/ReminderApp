import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApiService } from './base-api-service.service';
import { Task } from './models/task.model';
import { Workspace } from './models/workspaces.model';
import { Stats } from './models/stats.model';

@Injectable({ providedIn: 'root' })
export class TaskService extends BaseApiService<Task> {
  // 👇 this matches your backend base resource
  protected baseUrl = 'workspace'; 

  constructor(http: HttpClient) {
    super(http);
  }

  // 🔹 Workspaces
  getWorkspaces(userId: string): Observable<Workspace[]> {
    return this.customGet(`${this.baseUrl}/All/${userId}`) as Observable<Workspace[]>;
  }

  addWorkspace(data: any) {
    return this.customPost(`${this.baseUrl}`, data);
  }

  // 🔹 Stats
  getStats(workspaceId: string): Observable<Stats> {
    return this.customGet(`${this.baseUrl}/${workspaceId}/stats`) as Observable<Stats>;
  }

  getUserStats(userId: string): Observable<Stats> {
    return this.customGet(`stats/${userId}`) as Observable<Stats>;
  }

  // 🔹 Tasks
  addTask(workspaceId: string, task: Task) {
    return this.customPost(`${this.baseUrl}/${workspaceId}/tasks`, task);
  }

  getTask(workspaceId: string, taskId: string) {
    return this.customGet(`${this.baseUrl}/${workspaceId}/tasks/${taskId}`);
  }

  getUpcomingTasks(userId: string, days: number) {
    return this.customGet(`${this.baseUrl}/${userId}/upcoming?days=${days}`) as Observable<Task[]>;
  }

  updateTask(workspaceId: string, taskId: string, task: any) {
    return this.customPut(`${this.baseUrl}/${workspaceId}/tasks/${taskId}`, task);
  }

  deleteTask(workspaceId: string, taskId: string) {
    return this.customDelete(`${this.baseUrl}/${workspaceId}/tasks/${taskId}`);
  }

  // 🔹 Subtasks
  addSubtask(workspaceId: string, taskId: string, subtask: any) {
    return this.customPost(`${this.baseUrl}/${workspaceId}/tasks/${taskId}/subtasks`, subtask);
  }
}
