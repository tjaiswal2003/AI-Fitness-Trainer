const mongoose = require('mongoose');

const nutritionEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodItem: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unit: {
    type: String,
    required: true,
    default: 'serving'
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number, // in grams
    required: true
  },
  carbs: {
    type: Number, // in grams
    required: true
  },
  fats: {
    type: Number, // in grams
    required: true
  },
  fiber: {
    type: Number, // in grams
    default: 0
  },
  sugar: {
    type: Number, // in grams
    default: 0
  },
  sodium: {
    type: Number, // in mg
    default: 0
  },
  calcium: {
    type: Number, // in mg
    default: 0
  },
  iron: {
    type: Number, // in mg
    default: 0
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Nutrition', nutritionEntrySchema);