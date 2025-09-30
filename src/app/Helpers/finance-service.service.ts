
// src/app/core/services/finance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Finance } from './models/finance.model';
import { BaseApiService } from './base-api-service.service';

@Injectable({ providedIn: 'root' })
export class FinanceService extends BaseApiService<Finance> {
  protected baseUrl = '/api/finance';

  constructor(http: HttpClient) {
    super(http);
  }
}

