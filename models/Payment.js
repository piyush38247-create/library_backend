import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  libraryId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "libraries"
  },
  companyId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "company"
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  method: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer'],
    default: null
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },

}, {
  timestamps: true
});

export const Payment  = mongoose.model('Payment', paymentSchema);
