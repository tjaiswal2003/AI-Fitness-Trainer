import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Nutrition = () => {
  const { user } = useAuth();
  const [nutrition, setNutrition] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    foodItem: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    mealType: 'breakfast'
  });

  useEffect(() => {
    fetchNutrition();
    fetchTodaySummary();
  }, []);

  const fetchNutrition = async () => {
    try {
      const response = await axios.get('https://aifitness-hnby.onrender.com/api/nutrition');
      setNutrition(response.data);
    } catch (error) {
      console.error('Error fetching nutrition:', error);
    }
  };

  const fetchTodaySummary = async () => {
    try {
      const response = await axios.get('https://aifitness-hnby.onrender.com/api/nutrition/today');
      setTodaySummary(response.data);
    } catch (error) {
      console.error('Error fetching today summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://aifitness-hnby.onrender.com/api/nutrition', formData);
      setShowForm(false);
      setFormData({
        foodItem: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        mealType: 'breakfast'
      });
      fetchNutrition();
      fetchTodaySummary();
    } catch (error) {
      console.error('Error adding nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMacroPercentages = (summary) => {
    if (!summary) return { protein: 0, carbs: 0, fats: 0 };
    
    const total = summary.totalProtein * 4 + summary.totalCarbs * 4 + summary.totalFats * 9;
    if (total === 0) return { protein: 0, carbs: 0, fats: 0 };
    
    return {
      protein: ((summary.totalProtein * 4) / total) * 100,
      carbs: ((summary.totalCarbs * 4) / total) * 100,
      fats: ((summary.totalFats * 9) / total) * 100
    };
  };

  const macros = calculateMacroPercentages(todaySummary);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Nutrition Tracker</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            + Add Food
          </button>
        </div>

        {/* Today's Summary */}
        {todaySummary && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Today's Nutrition Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{todaySummary.totalCalories}</p>
                <p className="text-gray-600">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{todaySummary.totalProtein}g</p>
                <p className="text-gray-600">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{todaySummary.totalCarbs}g</p>
                <p className="text-gray-600">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{todaySummary.totalFats}g</p>
                <p className="text-gray-600">Fats</p>
              </div>
            </div>

            {/* Macro Progress Bars */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Protein: {macros.protein.toFixed(1)}%</span>
                <span>{todaySummary.totalProtein}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${macros.protein}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Carbs: {macros.carbs.toFixed(1)}%</span>
                <span>{todaySummary.totalCarbs}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${macros.carbs}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Fats: {macros.fats.toFixed(1)}%</span>
                <span>{todaySummary.totalFats}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${macros.fats}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Add Food Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Item</label>
                  <input
                    type="text"
                    value={formData.foodItem}
                    onChange={(e) => setFormData({ ...formData, foodItem: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Grilled Chicken Breast"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                  <select
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fats (g)</label>
                  <input
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Food'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Nutrition History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Nutrition History</h2>
          {nutrition.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No nutrition entries yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Add Your First Food Entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {nutrition.map((entry) => (
                <div key={entry._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold capitalize">{entry.foodItem}</h3>
                      <p className="text-gray-600 capitalize">{entry.mealType} • {new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{entry.calories} cal</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{entry.protein}g</p>
                      <p className="text-gray-600">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-yellow-600">{entry.carbs}g</p>
                      <p className="text-gray-600">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-red-600">{entry.fats}g</p>
                      <p className="text-gray-600">Fats</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;