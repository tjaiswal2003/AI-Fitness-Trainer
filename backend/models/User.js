const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
    minlength: 6
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  height: {
    type: Number, // in cm
    required: true
  },
  weight: {
    type: Number, // in kg
    required: true
  },
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'],
    required: true
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    required: true
  },
  medicalConditions: [String],
  allergies: [String],
  bmi: {
    type: Number
  },
  dailyCalories: {
    type: Number
  }
}, {
  timestamps: true
});

// Calculate BMI before saving
userSchema.pre('save', function(next) {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    this.bmi = this.weight / (heightInMeters * heightInMeters);
  }
  next();
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

module.exports = mongoose.model('User', userSchema);