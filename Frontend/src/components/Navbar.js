import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isActiveParent = (path) => {
    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview'
    },
    {
      path: '/workout',
      label: 'Workout',
      icon: '💪',
      description: 'Training'
    },
    {
      path: '/nutrition-tracker',
      label: 'Nutrition',
      icon: '🥗',
      description: 'Meal Tracking'
    },
    {
      path: '/ai-assistant',
      label: 'AI Assistant',
      icon: '🤖',
      description: 'Get Help'
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-lg font-bold">AI</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800 leading-tight">FitAI Trainer</span>
              <span className="text-xs text-gray-500 font-medium">AI Fitness</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive(item.path) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </Link>
                ))}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl font-medium transition-all duration-300 group ${
                      isProfileDropdownOpen
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold leading-tight">
                        {user.name || 'User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.fitnessGoal ? user.fitnessGoal.replace('_', ' ') : ''}
                      </span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/60 py-2 overflow-hidden">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200/60">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-4 py-3 border-b border-gray-200/60">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {user.bmi ? user.bmi.toFixed(1) : '--'}
                            </div>
                            <div className="text-gray-500">BMI</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {user.dailyCalories || '2000'}
                            </div>
                            <div className="text-gray-500">Calories</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                          <span>👤</span>
                        </div>
                        <div>
                          <div className="font-medium">Profile Settings</div>
                          <div className="text-xs text-gray-500">Manage your account</div>
                        </div>
                      </Link>

                      

                      {/* Logout */}
                      <div className="border-t border-gray-200/60 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                            <span>🚪</span>
                          </div>
                          <div>
                            <div className="font-medium">Sign Out</div>
                           
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive('/login')
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/60 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? 'text-blue-600 bg-blue-50 border border-blue-200'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  ))}

                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <span className="text-xl">👤</span>
                    <div className="flex flex-col">
                      <span>Profile</span>
                      <span className="text-xs text-gray-500 font-normal">
                        Account settings
                      </span>
                    </div>
                  </Link>

                  <div className="border-t border-gray-200/60 pt-2 mt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                    >
                      <span className="text-xl">🚪</span>
                      <div className="flex flex-col">
                        <span>Sign Out</span>
                        <span className="text-xs text-red-500 font-normal">
                          End session
                        </span>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <span className="text-xl">🔑</span>
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-200"
                  >
                    <span className="text-xl">✨</span>
                    <span>Start Free Trial</span>
                  </Link>
                </>
              )}
            </div>

            {/* User info in mobile menu */}
            {user && (
              <div className="border-t border-gray-200/60 px-4 py-3 bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="font-semibold text-gray-900 text-sm">
                      {user.bmi ? user.bmi.toFixed(1) : '--'}
                    </div>
                    <div className="text-xs text-gray-500">BMI</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="font-semibold text-gray-900 text-sm">
                      {user.dailyCalories || '2000'}
                    </div>
                    <div className="text-xs text-gray-500">Calories</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;