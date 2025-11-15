import mongoose  from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  libraryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'libraries'
},
 companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'company'
},
}, {
  timestamps: true
});

export const Alert = mongoose.model('Alert',alertSchema)