const express = require('express');
const auth = require('../middleware/auth');
const Nutrition = require('../models/Nutrition');
const Food = require('../models/FoodDatabase');
const User = require('../models/User');
const router = express.Router();

// Initialize food database
router.get('/init-foods', async (req, res) => {
  try {
    await Food.initializeFoodDatabase();
    res.json({ message: 'Food database initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all foods from database
router.get('/foods', auth, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { commonNames: { $regex: search, $options: 'i' } }
      ];
    }
    
    const foods = await Food.find(query).sort({ name: 1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add nutrition entry
router.post('/', auth, async (req, res) => {
  try {
    const nutrition = new Nutrition({
      userId: req.user.id,
      ...req.body
    });
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's nutrition entries with meal slots
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nutrition = await Nutrition.find({
      userId: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ mealType: 1, date: 1 });

    // Group by meal type
    const meals = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };

    nutrition.forEach(entry => {
      meals[entry.mealType].push(entry);
    });

    // Calculate totals
    const totals = nutrition.reduce((acc, entry) => ({
      totalCalories: acc.totalCalories + entry.calories,
      totalProtein: acc.totalProtein + entry.protein,
      totalCarbs: acc.totalCarbs + entry.carbs,
      totalFats: acc.totalFats + entry.fats,
      totalFiber: acc.totalFiber + entry.fiber,
      totalSugar: acc.totalSugar + entry.sugar,
      totalSodium: acc.totalSodium + entry.sodium,
      totalCalcium: acc.totalCalcium + entry.calcium,
      totalIron: acc.totalIron + entry.iron
    }), {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0,
      totalSugar: 0,
      totalSodium: 0,
      totalCalcium: 0,
      totalIron: 0
    });

    // Get user's daily calorie target
    const user = await User.findById(req.user.id);
    const dailyTarget = user.dailyCalories || 2000;

    res.json({
      meals,
      totals,
      dailyTarget,
      remainingCalories: dailyTarget - totals.totalCalories,
      progress: {
        calories: (totals.totalCalories / dailyTarget) * 100,
        protein: (totals.totalProtein / (user.weight * 1.6)) * 100, // 1.6g per kg body weight
        carbs: (totals.totalCarbs / 300) * 100, // Standard 300g target
        fats: (totals.totalFats / 70) * 100 // Standard 70g target
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nutrition entries for specific date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const nutrition = await Nutrition.find({
      userId: req.user.id,
      date: {
        $gte: date,
        $lt: nextDay
      }
    }).sort({ mealType: 1, date: 1 });

    res.json(nutrition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete nutrition entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }
    
    res.json({ message: 'Nutrition entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;