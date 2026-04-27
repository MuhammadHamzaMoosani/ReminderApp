const mongoose = require("mongoose");

/**
 * Financial schema to track income, expenses, and savings.
 */
const financialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  kind: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "PKR" },
  date: { type: Date, default: Date.now },
  category: { type: String },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Financial", financialSchema);
