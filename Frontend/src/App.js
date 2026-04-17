import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Workout from './pages/Workout';
import Nutrition from './pages/Nutrition';
import AIAssistant from './pages/AIAssistant';
import PrivateRoute from './components/PrivateRoute';
import NutritionTracker from './pages/NutritionTracker';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/workout" 
                element={
                  <PrivateRoute>
                    <Workout />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/nutrition" 
                element={
                  <PrivateRoute>
                    <Nutrition />
                  </PrivateRoute>
                } 
              />

              <Route 
                path="/nutrition-tracker" 
                element={
                  <PrivateRoute>
                    <NutritionTracker />
                  </PrivateRoute>
                } 
              />


              <Route 
                path="/ai-assistant" 
                element={
                  <PrivateRoute>
                    <AIAssistant />
                  </PrivateRoute>
                } 
              />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto py-8 px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <span className="text-2xl">💪</span>
                  <span className="font-bold text-xl text-gray-800">FitAI Trainer</span>
                </div>
                <div className="text-gray-600 text-sm">
                  <p>© 2025 FitAI Trainer.</p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <a href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
                    Privacy
                  </a>
                  <a href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                    Terms
                  </a>
                  <a href="/contact" className="text-gray-500 hover:text-gray-700 text-sm">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;