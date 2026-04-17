import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const NutritionTracker = () => {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayData();
    fetchFoods();
  }, []);

  const fetchTodayData = async () => {
    try {
      const response = await axios.get('https://aifitness-hnby.onrender.com/api/nutrition/today');
      setTodayData(response.data);
    } catch (error) {
      console.error('Error fetching today data:', error);
    }
  };

  const fetchFoods = async (category = 'all', search = '') => {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await axios.get(`https://aifitness-hnby.onrender.com/api/nutrition/foods?${params}`);
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const addFoodToMeal = async (food, quantity = 1) => {
    try {
      const nutritionEntry = {
        foodItem: food.name,
        quantity: quantity,
        unit: food.servingSize,
        calories: food.calories * quantity,
        protein: food.protein * quantity,
        carbs: food.carbs * quantity,
        fats: food.fats * quantity,
        fiber: food.fiber * quantity,
        sugar: food.sugar * quantity,
        sodium: food.sodium * quantity,
        calcium: food.calcium * quantity,
        iron: food.iron * quantity,
        mealType: selectedMeal
      };

      await axios.post('https://aifitness-hnby.onrender.com/api/nutrition', nutritionEntry);
      setShowFoodSearch(false);
      fetchTodayData();
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await axios.delete(`https://aifitness-hnby.onrender.com/api/nutrition/${entryId}`);
      fetchTodayData();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchFoods(selectedCategory, e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchFoods(category, searchTerm);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRemainingColor = (remaining) => {
    if (remaining > 500) return 'text-green-600';
    if (remaining > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!todayData) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const mealTypes = [
    { key: 'breakfast', label: '🍳 Breakfast', time: '7:00 - 9:00 AM' },
    { key: 'lunch', label: '🍲 Lunch', time: '12:00 - 2:00 PM' },
    { key: 'dinner', label: '🍽️ Dinner', time: '7:00 - 9:00 PM' },
    { key: 'snacks', label: '🍎 Snacks', time: 'Throughout day' }
  ];

  const foodCategories = [
    { key: 'all', label: 'All Foods' },
    { key: 'grains', label: 'Grains' },
    { key: 'proteins', label: 'Proteins' },
    { key: 'vegetables', label: 'Vegetables' },
    { key: 'fruits', label: 'Fruits' },
    { key: 'dairy', label: 'Dairy' },
    { key: 'fats', label: 'Fats & Oils' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nutrition Tracker</h1>
          <p className="text-gray-600">Track your daily food intake and nutrient balance</p>
        </div>

        {/* Daily Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {todayData.totals.totalCalories}
              <span className="text-sm font-normal text-gray-500"> / {todayData.dailyTarget}</span>
            </div>
            <div className="text-gray-600 mb-3">Calories</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(todayData.progress.calories)}`}
                style={{ width: `${Math.min(todayData.progress.calories, 100)}%` }}
              ></div>
            </div>
            <div className={`text-sm font-semibold mt-2 ${getRemainingColor(todayData.remainingCalories)}`}>
              {todayData.remainingCalories > 0 ? `${todayData.remainingCalories} remaining` : `${Math.abs(todayData.remainingCalories)} over`}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{(todayData.totals.totalProtein || 0).toFixed(2)}g</div>
            <div className="text-gray-600 mb-3">Protein</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${Math.min(todayData.progress.protein, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {(todayData.totals.totalCarbs || 0).toFixed(2)}g
            </div>
            <div className="text-gray-600 mb-3">Carbs</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-yellow-500"
                style={{ width: `${Math.min(todayData.progress.carbs, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">{(todayData.totals.totalFats || 0).toFixed(2)}g</div>
            <div className="text-gray-600 mb-3">Fats</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${Math.min(todayData.progress.fats, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meal Selection & Tracking */}
          <div className="lg:col-span-2">
            {/* Meal Type Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="flex overflow-x-auto">
                {mealTypes.map((meal) => (
                  <button
                    key={meal.key}
                    onClick={() => setSelectedMeal(meal.key)}
                    className={`flex-1 min-w-0 px-4 py-3 text-center border-b-2 transition-colors ${
                      selectedMeal === meal.key
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <div className="font-semibold">{meal.label.split(' ')[0]}</div>
                    <div className="text-xs text-gray-500">{meal.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Meal Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {mealTypes.find(m => m.key === selectedMeal)?.label}
                </h3>
                <button
                  onClick={() => setShowFoodSearch(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  + Add Food
                </button>
              </div>

              {/* Meal Items */}
              <div className="space-y-3">
                {todayData.meals[selectedMeal]?.length > 0 ? (
                  todayData.meals[selectedMeal].map((entry) => (
                    <div key={entry._id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-semibold">{entry.foodItem}</div>
                        <div className="text-sm text-gray-600">
                          {entry.quantity} {entry.unit} • {entry.calories} cal
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fats}g
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEntry(entry._id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p>No foods added for this meal yet</p>
                    <button
                      onClick={() => setShowFoodSearch(true)}
                      className="text-blue-600 hover:text-blue-800 mt-2"
                    >
                      Add your first food item
                    </button>
                  </div>
                )}
              </div>

              {/* Meal Total */}
              {todayData.meals[selectedMeal]?.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Meal Total:</span>
                    <span>
                      {todayData.meals[selectedMeal].reduce((sum, entry) => sum + entry.calories, 0)} calories
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nutrition Charts & Details */}
          <div className="space-y-6">
            {/* Macronutrient Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Macronutrient Split</h3>
              <div className="h-64">
                <Doughnut
                  data={{
                    labels: ['Protein', 'Carbs', 'Fats'],
                    datasets: [
                      {
                        data: [
                          todayData.totals.totalProtein * 4, // Protein calories
                          todayData.totals.totalCarbs * 4,   // Carb calories
                          todayData.totals.totalFats * 9     // Fat calories
                        ],
                        backgroundColor: [
                          '#10b981', // green
                          '#f59e0b', // yellow
                          '#ef4444'  // red
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Micronutrients */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Micronutrients</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fiber</span>
                  <span className="font-semibold">{todayData.totals.totalFiber}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sugar</span>
                  <span className="font-semibold">{todayData.totals.totalSugar}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sodium</span>
                  <span className="font-semibold">{todayData.totals.totalSodium}mg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calcium</span>
                  <span className="font-semibold">{todayData.totals.totalCalcium}mg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Iron</span>
                  <span className="font-semibold">{todayData.totals.totalIron}mg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Search Modal */}
      {showFoodSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add Food to {mealTypes.find(m => m.key === selectedMeal)?.label}</h3>
                <button
                  onClick={() => setShowFoodSearch(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Search and Filter */}
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Category Filters */}
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {foodCategories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryChange(category.key)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      selectedCategory === category.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Food List */}
            <div className="overflow-y-auto max-h-96">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => addFoodToMeal(food, 1)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{food.name}</div>
                      <div className="text-sm text-gray-600">{food.servingSize}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">{food.calories} cal</div>
                      <div className="text-xs text-gray-500">per serving</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {foods.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No foods found. Try a different search term.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionTracker;