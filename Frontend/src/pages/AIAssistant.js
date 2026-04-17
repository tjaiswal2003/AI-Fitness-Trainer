import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history on component mount
  useEffect(() => {
    if (user) {
      loadConversationHistory();
    }
  }, [user]);

  const loadConversationHistory = async () => {
    try {
      const response = await axios.get(`https://aifitness-1.onrender.com/api/ai-conversation-history?user_id=${user.id}`);
      if (response.data.conversation_history) {
        setMessages(response.data.conversation_history);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      // Start with welcome message if no history
      setMessages([{
        type: 'ai',
        message: `Hello ${user?.name}! I'm your enhanced AI fitness assistant! I can help you with detailed workout plans, nutrition advice, progress tracking, and much more. What would you like to work on today? 💪`,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('https://aifitness-1.onrender.com/api/ai-chat', {
        message: inputMessage,
        user_id: user?.id,
        user_context: {
          name: user?.name,
          bmi: user?.bmi,
          dailyCalories: user?.dailyCalories,
          fitnessGoal: user?.fitnessGoal
        }
      });

      const aiMessage = {
        type: 'ai',
        message: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation history
      if (response.data.conversation_history) {
        setConversationHistory(response.data.conversation_history);
      }
    } catch (error) {
      const errorMessage = {
        type: 'ai',
        message: 'Sorry, I encountered an error. Please try again later. If this persists, check if the ML service is running.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.post('https://aifitness-1.onrender.com/api/ai-clear-history', {
        user_id: user?.id
      });
      setMessages([{
        type: 'ai',
        message: `Conversation cleared! Hello ${user?.name}! I'm your AI fitness assistant. What would you like to discuss today? 🌟`,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const quickActions = [
    { 
      label: '💪 Workout Plan', 
      prompt: 'Can you create a personalized workout plan for me?',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: '🥗 Nutrition Advice', 
      prompt: 'What should I eat to support my fitness goals?',
      color: 'from-green-500 to-green-600'
    },
    { 
      label: '📊 Progress Tips', 
      prompt: 'I\'m not seeing results, what should I do?',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: '🔥 Motivation', 
      prompt: 'I need some motivation to workout today',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      label: '🏃 Cardio Help', 
      prompt: 'What are the best cardio exercises for beginners?',
      color: 'from-red-500 to-red-600'
    },
    { 
      label: '💡 General Tips', 
      prompt: 'Give me some general fitness tips',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const handleQuickAction = (prompt) => {
    setInputMessage(prompt);
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">AI Fitness Assistant</h1>
                    <p className="text-blue-100 text-sm sm:text-base mt-1">
                      Your 24/7 personal trainer, nutritionist & health coach
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClearHistory}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Chat
              </button>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-semibold text-gray-700">Quick Actions</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className={`bg-gradient-to-r ${action.color} text-white px-3 py-3 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-center min-h-[60px] flex items-center justify-center`}
                >
                  <span className="leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Section */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-gray-50/50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className="flex max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        AI
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 shadow-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200/60'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {formatMessage(message.message)}
                    </div>
                    <div className={`flex justify-end mt-3 pt-2 border-t ${
                      message.type === 'user' ? 'border-blue-500/30' : 'border-gray-200'
                    }`}>
                      <p className={`text-xs ${
                        message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        You
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] sm:max-w-[80%]">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      AI
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md p-4 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about fitness, nutrition, workouts, motivation, or health goals..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 resize-none pr-20 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  rows="2"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2 text-xs text-gray-400">
                  <kbd className="px-1.5 py-1 text-xs font-mono bg-gray-200 rounded-md">Shift</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-1 text-xs font-mono bg-gray-200 rounded-md">Enter</kbd>
                  <span>for new line</span>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={loading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-semibold flex items-center justify-center gap-2 min-w-[120px] hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            
            {/* Help Tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200/50">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">💡</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Try asking:</p>
                  <p className="text-sm text-blue-600 mt-1">
                    "Create a 4-week weight loss workout plan" • "What's the best pre-workout meal?" • 
                      "Suggest a healthy dinner recipe"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Context-Aware</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Remembers our entire conversation and provides personalized, consistent advice based on your fitness journey
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Personalized</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Uses your BMI, fitness goals, and calorie needs to create tailored workout and nutrition plans
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Expert Knowledge</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Comprehensive expertise in exercise science, nutrition planning, progress tracking, and fitness motivation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;