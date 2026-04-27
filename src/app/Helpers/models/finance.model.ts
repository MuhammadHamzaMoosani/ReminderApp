// src/app/core/models/finance.model.ts
export interface Finance {
  id: string;
  amount: number;
  kind: 'income' | 'expense';
  reason: string;
  date: Date;
}
