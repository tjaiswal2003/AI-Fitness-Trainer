const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['grains', 'proteins', 'vegetables', 'fruits', 'dairy', 'fats', 'beverages'],
    required: true
  },
  servingSize: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number, // grams per serving
    required: true
  },
  carbs: {
    type: Number, // grams per serving
    required: true
  },
  fats: {
    type: Number, // grams per serving
    required: true
  },
  fiber: {
    type: Number, // grams per serving
    default: 0
  },
  sugar: {
    type: Number, // grams per serving
    default: 0
  },
  sodium: {
    type: Number, // mg per serving
    default: 0
  },
  calcium: {
    type: Number, // mg per serving
    default: 0
  },
  iron: {
    type: Number, // mg per serving
    default: 0
  },
  commonNames: [String]
});

// Predefined Indian/common foods
const commonFoods = [
  // Grains
  {
    name: "Whole Wheat Roti",
    category: "grains",
    servingSize: "1 piece (40g)",
    calories: 120,
    protein: 3.5,
    carbs: 20,
    fats: 2,
    fiber: 3,
    commonNames: ["chapati", "phulka"]
  },
  {
    name: "Basmati Rice",
    category: "grains",
    servingSize: "1 cup cooked (150g)",
    calories: 205,
    protein: 4.2,
    carbs: 45,
    fats: 0.4,
    fiber: 0.6
  },
  {
    name: "Brown Rice",
    category: "grains",
    servingSize: "1 cup cooked (150g)",
    calories: 216,
    protein: 5,
    carbs: 45,
    fats: 1.6,
    fiber: 3.5
  },
  
  // Proteins
  {
    name: "Chicken Breast",
    category: "proteins",
    servingSize: "100g cooked",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6
  },
  {
    name: "Egg",
    category: "proteins",
    servingSize: "1 large (50g)",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fats: 5.3
  },
  {
    name: "Lentils (Dal)",
    category: "proteins",
    servingSize: "1 cup cooked (200g)",
    calories: 230,
    protein: 18,
    carbs: 40,
    fats: 0.8,
    fiber: 16
  },
  {
    name: "Paneer",
    category: "proteins",
    servingSize: "100g",
    calories: 265,
    protein: 18,
    carbs: 4,
    fats: 20,
    calcium: 480
  },
  
  // Vegetables
  {
    name: "Spinach",
    category: "vegetables",
    servingSize: "1 cup raw (30g)",
    calories: 7,
    protein: 0.9,
    carbs: 1.1,
    fats: 0.1,
    fiber: 0.7,
    iron: 0.8
  },
  {
    name: "Broccoli",
    category: "vegetables",
    servingSize: "1 cup chopped (90g)",
    calories: 31,
    protein: 2.6,
    carbs: 6,
    fats: 0.3,
    fiber: 2.4,
    calcium: 43
  },
  
  // Fruits
  {
    name: "Apple",
    category: "fruits",
    servingSize: "1 medium (180g)",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fats: 0.3,
    fiber: 4.4
  },
  {
    name: "Banana",
    category: "fruits",
    servingSize: "1 medium (120g)",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.4,
    fiber: 3.1
  },
  
  // Dairy
  {
    name: "Milk",
    category: "dairy",
    servingSize: "1 cup (240ml)",
    calories: 149,
    protein: 8,
    carbs: 12,
    fats: 8,
    calcium: 276
  },
  {
    name: "Yogurt",
    category: "dairy",
    servingSize: "1 cup (245g)",
    calories: 149,
    protein: 8.5,
    carbs: 11.4,
    fats: 8,
    calcium: 296
  }
];

// Method to initialize food database
foodSchema.statics.initializeFoodDatabase = async function() {
  try {
    const count = await this.countDocuments();
    if (count === 0) {
      await this.insertMany(commonFoods);
      console.log('✅ Food database initialized with common foods');
    } else {
      console.log('✅ Food database already contains', count, 'foods');
    }
  } catch (error) {
    console.log('⚠️ Food database initialization note:', error.message);
  }
};

module.exports = mongoose.model('Food', foodSchema);