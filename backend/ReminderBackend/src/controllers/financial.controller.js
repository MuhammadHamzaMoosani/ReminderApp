const Financial = require("../models/financial.model");
const User = require("../models/user.model");

/**
 * Add financial data for a user
 */
exports.BulkaddFinancial = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.wantsFinancialReminders)
      return res.status(403).json({ error: "User opted out of financial reminders" });
    if(!Array.isArray(req.body.financials) || req.body.financials.length === 0) {
      return res.status(400).json({ error: "No financial entries provided" });
    }
    const financialsToInsert = req.body.financials.map(financial => ({
      ...financial,
      user: req.body.user
    }));
    const insertedFinancials = await Financial.insertMany(financialsToInsert, { ordered: false });
    return res.status(201).json({
    messsage:"All Records Inserted Successfully",
    financials:insertedFinancials});
  }
  catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
exports.addFinancial = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.wantsFinancialReminders)
      return res.status(403).json({ error: "User opted out of financial reminders" });

    const financial = await Financial.create({ user: req.body.user, ...req.body });
    res.status(201).json(financial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get all financial entries for a user
 */
exports.getFinancials = async (req, res) => {
  try {
    const financials =  await Financial.find({user:req.params.userId}).sort({ date: -1 }).lean();
    console.log(financials);
    const totals =  calculateSavings(financials);
    // return both list and totals
    res.json({
      financials,
      income: totals.income,
      expenses: totals.expenses,
      savings: totals.savings
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get financial entry by ID
 */
exports.getFinancialById = async (req, res) => {
  try {
    const { id, taskId } = req.params; // id = userId
    const financial = await Financial.findOne({ _id: taskId, user: id });
    if (!financial) return res.status(404).json({ error: "Financial entry not found" });
    res.json(financial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update financial entry
 */
exports.updateFinancial = async (req, res) => {
  try {
    const { id, financialId } = req.params; // id = userId
    const financial = await Financial.findOneAndUpdate(
      { _id: financialId, user: id },   // ensure financial entry belongs to user
      req.body,
      { new: true, runValidators: true }
    );
    if (!financial) return res.status(404).json({ error: "Financial entry not found" });
    res.json(financial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete financial entry
 */
exports.deleteFinancial = async (req, res) => {
  try {
    const { id, financialId } = req.params; // id = userId
    const financial = await Financial.findOneAndDelete({ _id: financialId, user: id });
    if (!financial) return res.status(404).json({ error: "Financial entry not found" });
    res.json({ message: "Financial entry deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

function calculateSavings(financials) {
  try {
    //const { id } = req.params;
    //const financials = await Financial.find({ user: userid });

    let income = 0, expenses = 0;
    financials.forEach(entry => {
      if(entry.kind == "income")
        income += entry.amount || 0;
      else if(entry.kind == "expense")
       expenses += entry.amount || 0;
    });

    const savings = income - expenses;
    return {income, expenses, savings} ;
  } catch (err) {
    throw new Error(err.message);
  }
};
