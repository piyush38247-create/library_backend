import { Expense } from "../../models/Expense.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import mongoose from "mongoose";


// Get all expenses
export const getCompanyExpenses = async (req, res, next) => {
  try {
    const companyId = req.params.id
    const { category, type} = req.query;
    let query = {};
    
    if (category && category !== 'all') query.category = category;
    if (type && type !== 'all') query.type = type;
    if(companyId) query.companyId = companyId

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new expense
export const createCompanyExpenses = async (req, res, next) => {
  try {
    const {companyId, category, description, amount} = req.body
    if(!companyId || !category || !description || !amount){
      return next(new ErrorHandler("please all the fields", 400))
    }
    const expenseData = new Expense({
      companyId, category, description, amount
    });
    await expenseData.save();
    return res.status(200).json({
      success : true,
      message : "expense added successfully !",
      expenseData
    })
  } catch (error) {
    console.error(error)
    return next(new ErrorHandler("failed to add expense", 500))
  }
};

export const updateCompanyExpenses = async (req, res, next) => {
  try {
    const expenseId = req.params.id
    const {category, description, amount} = req.body

    if(!mongoose.Types.ObjectId.isValid(expenseId)){
      return next(new ErrorHandler("expense id is invalid", 400))
    }

    if(!category && !description && !amount){
      return next(new ErrorHandler("please at least one field", 400))
    }

    const filter = {}

    if(category) filter.category = category
    if(description) filter.description = description
    if(amount) filter.amount = amount 

   let expenseData = await Expense.findOneAndUpdate({_id : expenseId}, 
    {$set : filter},
    {new : true, runValidators : true}
   )

   if(!expenseData){
       return next(new ErrorHandler("expense not found !"), 404)
   }


    res.status(200).json({
      success : true,
      message : "expense updated successfully !",
      expenseData
    })
  } catch (error) {
    console.error(error)
    return next(new ErrorHandler("failed to update expense", 500))
  }
};

// Delete expense
export const deleteCompanyExpenses = async (req, res, next) => {
  try {

    const expenseId = req.params.id
    const expenseData = await Expense.findOneAndDelete({_id : expenseId});
    if (!expenseData) {
      return next(new ErrorHandler("expense data not found or already deleted !", 404))
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error)
    return next(new ErrorHandler("failed to delete expense", 500))
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


