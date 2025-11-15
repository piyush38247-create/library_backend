import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    default: 'regular'
  },
  seatOcupiedTiming: {
    type: String,
    enum: ['none', 'half', 'full'],
    default: 'none'
  },
  occupied: {
    type: Boolean,
    default: false
  },
  position: {
    row: { type: Number, default: 1 },
    column: { type: Number, default: 1 }
  },
  libraryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'libraries',
  required: true
},
  student: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null
    }
  }]
}, {
  timestamps: true
});

export const Seat = mongoose.model('Seat', seatSchema);
