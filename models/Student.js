import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName : {
    type : String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  joinDate: {
    type: Date,
    required: true
  },
  endDate : {
    type : Date,
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  seatingType : {
    type : String,
    enum : ['half', 'full'],
    default : 'full'
  },
  fee : {
    type : Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  libraryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'libraries',
  required: true
},

  
}, {
  timestamps: true
});

 export const Student = mongoose.model('Student', studentSchema);
