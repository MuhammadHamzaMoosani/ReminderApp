const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔑 added password field

  wantsTaskReminders: { type: Boolean, default: true },
  wantsFinancialReminders: { type: Boolean, default: true },
  financialReminderFrequency: { type: String, enum: ["daily", "weekly","Monthly"], default: "weekly" },
  financialReminderStart: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
