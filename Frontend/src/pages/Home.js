import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Your AI-Powered Fitness Companion
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get personalized workout plans, nutrition guidance, and health monitoring 
          with our advanced AI fitness trainer.
        </p>
        <div className="space-x-4">
          <Link 
            to="/register" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Get Started Free
          </Link>
          <Link 
            to="/login" 
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything You Need for Your Fitness Journey
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Workout Plans</h3>
            <p className="text-gray-600">
              Personalized exercise routines based on your goals, fitness level, and available equipment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🥗</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Nutrition</h3>
            <p className="text-gray-600">
              Calorie tracking, meal suggestions, and dietary recommendations tailored to your needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Health Analytics</h3>
            <p className="text-gray-600">
              Track your BMI, progress, and health metrics with detailed analytics and insights.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;