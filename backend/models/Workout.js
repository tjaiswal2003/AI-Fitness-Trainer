const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'hiit'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    required: true
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    duration: Number
  }],
  caloriesBurned: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', workoutSchema);