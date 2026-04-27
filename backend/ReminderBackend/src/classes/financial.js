class FinancialRecord {
  constructor(amount, kind, reason, date = new Date()) {
    this.amount = amount;
    this.kind = kind;
    this.reason = reason;
    this.date = date;
  }
}
module.exports = FinancialRecord;