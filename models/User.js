import mongoose  from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
     libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "libraries",
      required: true,
    },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'super_admin', 'owner'],
    default: 'student'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  permissions: {
    students: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    payments: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    expenses: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    seats: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    alerts: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    dashboard: {
      read: { type: Boolean, default: false }
    },
    admin: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.role === 'super_admin') {
    // Super admin gets all permissions
    Object.keys(this.permissions).forEach(module => {
      Object.keys(this.permissions[module]).forEach(action => {
        this.permissions[module][action] = true;
      });
    });
  } else if (this.role === 'student') {
    // Students get no admin permissions, only read their own data
    this.permissions = {
      students: { create: false, read: true, update: false, delete: false },
      payments: { create: false, read: true, update: false, delete: false },
      expenses: { create: false, read: false, update: false, delete: false },
      seats: { create: false, read: true, update: false, delete: false },
      alerts: { create: false, read: true, update: false, delete: false },
      dashboard: { read: false },
      admin: { create: false, read: false, update: false, delete: false }
    };
  } 
  
  next();
});

 export const  User  = mongoose.model('users', userSchema);
