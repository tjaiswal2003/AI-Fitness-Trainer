const express = require('express');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const router = express.Router();

// Get all workouts for user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new workout
router.post('/', auth, async (req, res) => {
  try {
    const workout = new Workout({
      userId: req.user.id,
      ...req.body
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;