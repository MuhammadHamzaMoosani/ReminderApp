// src/app/core/services/base-api.service.ts
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseApiService<T> {
  protected abstract baseUrl: string; // each model will provide its own
  private apiUrl = 'http://localhost:3000/'; // base API URL
  constructor(protected http: HttpClient) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}${this.baseUrl}`);
  }

  getById(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${this.baseUrl}/${id}`);
  }

  create(payload: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}this.baseUrl`, payload);
  }

  update(id: string | number, payload: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${this.baseUrl}/${id}`, payload);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.baseUrl}/${id}`);
  }
  customGet(path: string) {
  return this.http.get(`${this.apiUrl}${path}`);
}

customPost(path: string, body: any) {
  return this.http.post(`${this.apiUrl}${path}`, body);
}

customPut(path: string, body: any) {
  return this.http.put(`${this.apiUrl}${path}`, body);
}

customDelete(path: string) {
  return this.http.delete(`${this.apiUrl}${path}`);
}
}
