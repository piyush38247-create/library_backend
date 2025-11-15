import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  companyId : {
    type : mongoose.Schema.Types.ObjectId, 
    ref : "company"
  },
  libraryId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "library"
  },
  category: {
    type: String,
    enum: ['utilities', 'maintenance', 'supplies', 'staff', 'marketing', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  type: {
    type: String,
    enum: ['one-time', 'recurring'],
    default: 'one-time'
  }
}, {
  timestamps: true
});


export const Expense = mongoose.model('Expense',expenseSchema)
