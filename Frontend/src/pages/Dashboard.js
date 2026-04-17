import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [todayNutrition, setTodayNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user data
      const userResponse = await axios.get('https://aifitness-hnby.onrender.com/api/user/profile');
      setUserData(userResponse.data);

      // Fetch workouts with error handling
      try {
        const workoutsResponse = await axios.get('https://aifitness-hnby.onrender.com/api/workout');
        setWorkouts(workoutsResponse.data);
      } catch (error) {
        console.log('Workouts endpoint not available yet');
        setWorkouts([]);
      }

      // Fetch today's nutrition with error handling
      try {
        const nutritionResponse = await axios.get('https://aifitness-hnby.onrender.com/api/nutrition/today');
        setTodayNutrition(nutritionResponse.data);
      } catch (error) {
        console.log('Nutrition endpoint not available yet');
        setTodayNutrition(null);
      }

      // Fetch nutrition history with error handling
      try {
        const nutritionHistoryResponse = await axios.get('https://aifitness-hnby.onrender.com/api/nutrition');
        setNutrition(nutritionHistoryResponse.data);
      } catch (error) {
        console.log('Nutrition history endpoint not available yet');
        setNutrition([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { category: 'Not calculated', color: 'text-gray-600', description: 'Update your profile' };
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-yellow-600', description: 'Focus on strength training and nutrition' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600', description: 'Great! Maintain healthy habits' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600', description: 'Focus on cardio and balanced diet' };
    return { category: 'Obese', color: 'text-red-600', description: 'Consult professional for guidance' };
  };

  const getWorkoutIntensity = (workouts) => {
    const thisWeekWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return workoutDate >= oneWeekAgo;
    });

    const totalDuration = thisWeekWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    
    if (totalDuration >= 300) return { level: 'High', color: 'text-green-600', icon: '🔥' };
    if (totalDuration >= 150) return { level: 'Moderate', color: 'text-yellow-600', icon: '💪' };
    return { level: 'Light', color: 'text-blue-600', icon: '🚶' };
  };

  const getNutritionScore = (nutritionData) => {
    if (!nutritionData || !nutritionData.totals) return { score: 0, label: 'No data', color: 'text-gray-500' };
    
    const { totals, dailyTarget } = nutritionData;
    const calorieScore = Math.min((totals.totalCalories / dailyTarget) * 100, 100);
    const proteinScore = Math.min((totals.totalProtein / 50) * 100, 100); // Assuming 50g protein target
    const balanceScore = 80; // Placeholder for macro balance
    
    const totalScore = (calorieScore + proteinScore + balanceScore) / 3;
    
    if (totalScore >= 80) return { score: totalScore, label: 'Excellent', color: 'text-green-600' };
    if (totalScore >= 60) return { score: totalScore, label: 'Good', color: 'text-yellow-600' };
    return { score: totalScore, label: 'Needs Improvement', color: 'text-red-600' };
  };

  // Chart data
  const weeklyProgressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Burned',
        data: [320, 450, 280, 600, 520, 380, 420],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Calories Consumed',
        data: [1800, 2200, 1900, 2100, 2300, 2000, 1850],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const nutritionDistributionData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: todayNutrition ? [
          todayNutrition.totals.totalProtein * 4,
          todayNutrition.totals.totalCarbs * 4,
          todayNutrition.totals.totalFats * 9
        ] : [30, 50, 20],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const workoutFrequencyData = {
    labels: ['Cardio', 'Strength', 'Flexibility', 'HIIT'],
    datasets: [
      {
        label: 'Workouts This Month',
        data: [
          workouts.filter(w => w.type === 'cardio').length,
          workouts.filter(w => w.type === 'strength').length,
          workouts.filter(w => w.type === 'flexibility').length,
          workouts.filter(w => w.type === 'hiit').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading Your Fitness Dashboard</h2>
          <p className="text-gray-600">Preparing your personalized insights...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Data</h2>
          <p className="text-gray-600 mb-4">Please check your connection and try again</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const bmiInfo = getBMICategory(userData.bmi);
  const workoutIntensity = getWorkoutIntensity(workouts);
  const nutritionScore = getNutritionScore(todayNutrition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome back, <span className="text-blue-600">{userData.name}</span>!
              </h1>
              <p className="text-gray-600 text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/workout"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                + Log Workout
              </Link>
              <Link
                to="/nutrition-tracker"
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                + Add Meal
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚖️</span>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${bmiInfo.color} bg-opacity-20`}>
                {bmiInfo.category}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">BMI Score</h3>
            <p className={`text-3xl font-bold ${bmiInfo.color} mb-2`}>
              {userData.bmi ? userData.bmi.toFixed(1) : '--'}
            </p>
            <p className="text-sm text-gray-600">{bmiInfo.description}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                {workoutIntensity.icon} {workoutIntensity.level}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Activity Level</h3>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {workouts.length}
            </p>
            <p className="text-sm text-gray-600">Workouts this month</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${nutritionScore.color} bg-opacity-20`}>
                {nutritionScore.label}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nutrition Score</h3>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {nutritionScore.score.toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600">Daily nutrition quality</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {userData.dailyCalories ? 'Custom' : 'Standard'}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Calorie Target</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {userData.dailyCalories || '2000'}
            </p>
            <p className="text-sm text-gray-600">Daily calorie intake</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Weekly Progress</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg font-medium">
                  Calories
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg font-medium">
                  Workouts
                </button>
              </div>
            </div>
            <div className="h-80">
              <Line
                data={weeklyProgressData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Nutrition & Workout Charts */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Distribution</h3>
              <div className="h-48">
                <Doughnut
                  data={nutritionDistributionData}
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
              {todayNutrition && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  {todayNutrition.remainingCalories > 0 
                    ? `${todayNutrition.remainingCalories} calories remaining`
                    : `${Math.abs(todayNutrition.remainingCalories)} calories over target`
                  }
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Workout Frequency</h3>
              <div className="h-48">
                <Bar
                  data={workoutFrequencyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Workouts */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Workouts</h3>
              <Link to="/workout" className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {workouts.slice(0, 3).map((workout) => (
                <div key={workout._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      workout.type === 'cardio' ? 'bg-red-100 text-red-600' :
                      workout.type === 'strength' ? 'bg-blue-100 text-blue-600' :
                      workout.type === 'hiit' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {workout.type === 'cardio' ? '🏃' :
                       workout.type === 'strength' ? '💪' :
                       workout.type === 'hiit' ? '🔥' : '🧘'}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">{workout.type} Workout</div>
                      <div className="text-sm text-gray-600">
                        {workout.duration}min • {new Date(workout.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{workout.caloriesBurned || '0'} cal</div>
                    <div className="text-sm text-gray-600 capitalize">{workout.intensity}</div>
                  </div>
                </div>
              ))}
              {workouts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💪</div>
                  <p>No workouts recorded yet</p>
                  <Link to="/workout" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                    Log your first workout
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Goals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/ai-assistant"
                className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl text-center hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-semibold">AI Assistant</div>
                <div className="text-sm opacity-90">Get personalized advice</div>
              </Link>
              
              <Link
                to="/profile"
                className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl text-center hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="text-2xl mb-2">👤</div>
                <div className="font-semibold">Update Profile</div>
                <div className="text-sm opacity-90">Edit health metrics</div>
              </Link>
              
              <Link
                to="/nutrition-tracker"
                className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl text-center hover:from-purple-600 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">Nutrition</div>
                <div className="text-sm opacity-90">Track meals</div>
              </Link>
              
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold">Set Goals</div>
                <div className="text-sm opacity-90">Coming soon</div>
              </div>
            </div>

            {/* Daily Motivation */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <div className="font-semibold text-yellow-800">Daily Tip</div>
                  <div className="text-sm text-yellow-700">
                    {userData.fitnessGoal === 'weight_loss' 
                      ? "Stay hydrated! Drinking water before meals can help reduce calorie intake."
                      : userData.fitnessGoal === 'muscle_gain'
                      ? "Remember to consume protein within 30 minutes after your workout for optimal muscle recovery."
                      : "Consistency is key! Even short daily workouts are better than occasional long sessions."
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;