import {Expense} from '../models/Expense.js';

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const { category, type } = req.query;
    let query = {};
    
    if (category && category !== 'all') query.category = category;
    if (type && type !== 'all') query.type = type;

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new expense
export const createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get expense statistics
export const getExpenseStats = async (req, res) => {
  try {
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const recurringExpenses = await Expense.aggregate([
      { $match: { type: 'recurring' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const categoryStats = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      totalExpenses: totalExpenses[0]?.total || 0,
      recurringExpenses: recurringExpenses[0]?.total || 0,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


