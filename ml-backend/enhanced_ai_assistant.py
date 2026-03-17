import re
import random
import json
from datetime import datetime
import numpy as np

class EnhancedAIAssistant:
    def __init__(self):
        self.conversation_history = {}
        self.user_profiles = {}
        self.workout_knowledge = self._load_workout_knowledge()
        self.nutrition_knowledge = self._load_nutrition_knowledge()
        self.general_knowledge = self._load_general_knowledge()
        
    def _load_workout_knowledge(self):
        return {
            'exercises': {
                'cardio': ['running', 'cycling', 'swimming', 'jumping rope', 'elliptical', 'rowing'],
                'strength': ['push-ups', 'pull-ups', 'squats', 'deadlifts', 'bench press', 'shoulder press'],
                'flexibility': ['yoga', 'pilates', 'stretching', 'dynamic warm-up', 'static stretching'],
                'hiit': ['burpees', 'mountain climbers', 'jump squats', 'high knees', 'box jumps']
            },
            'workout_plans': {
                'beginner': {
                    'cardio': '20-30 minutes of brisk walking or cycling, 3 times weekly',
                    'strength': 'Bodyweight exercises: 2 sets of 10-12 reps, 2 times weekly',
                    'recommendation': 'Focus on form and consistency over intensity'
                },
                'intermediate': {
                    'cardio': '30-45 minutes of running or swimming, 4 times weekly',
                    'strength': 'Weight training: 3 sets of 8-12 reps, 3 times weekly',
                    'recommendation': 'Incorporate progressive overload and variety'
                },
                'advanced': {
                    'cardio': '45-60 minutes of intense cardio or HIIT, 5 times weekly',
                    'strength': 'Advanced weight training: 4 sets of 6-10 reps, 4-5 times weekly',
                    'recommendation': 'Focus on periodization and recovery'
                }
            }
        }
    
    def _load_nutrition_knowledge(self):
        return {
            'meal_timing': {
                'pre_workout': 'Eat a light meal 1-2 hours before workout with carbs and protein',
                'post_workout': 'Consume protein and carbs within 30 minutes after workout',
                'general': 'Eat every 3-4 hours to maintain energy levels'
            },
            'macros': {
                'weight_loss': 'Higher protein (30%), moderate carbs (40%), lower fats (30%)',
                'muscle_gain': 'High protein (35%), high carbs (45%), moderate fats (20%)',
                'maintenance': 'Balanced: Protein (25%), Carbs (50%), Fats (25%)'
            },
            'food_suggestions': {
                'protein': ['chicken breast', 'fish', 'eggs', 'tofu', 'lentils', 'greek yogurt'],
                'carbs': ['brown rice', 'sweet potatoes', 'oats', 'quinoa', 'whole wheat bread'],
                'fats': ['avocado', 'nuts', 'olive oil', 'seeds', 'nut butter']
            }
        }
    
    def _load_general_knowledge(self):
        return {
            'greetings': [
                "Hello! I'm your AI fitness assistant. How can I help you achieve your fitness goals today? 💪",
                "Hi there! Ready to crush your fitness goals? What can I assist you with? 🏋️‍♂️",
                "Hey! Great to see you. What fitness questions can I answer for you today? 🌟",
                "Welcome back! How's your fitness journey going? I'm here to help! 🎯"
            ],
            'motivational_quotes': [
                "The only bad workout is the one that didn't happen!",
                "Don't stop when you're tired. Stop when you're done!",
                "Your body can stand almost anything. It's your mind you have to convince.",
                "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
                "The hardest lift of all is lifting your butt off the couch!"
            ],
            'follow_up_questions': {
                'workout': [
                    "What type of equipment do you have available?",
                    "What's your current fitness level?",
                    "How many days per week can you commit to working out?",
                    "Do you have any injuries or limitations I should know about?"
                ],
                'nutrition': [
                    "What are your dietary preferences or restrictions?",
                    "How many meals do you typically eat per day?",
                    "Do you have any food allergies?",
                    "What's your current eating schedule like?"
                ],
                'general': [
                    "How are you feeling about your progress?",
                    "What's been your biggest challenge recently?",
                    "What fitness achievement are you most proud of?",
                    "How can I better support your fitness journey?"
                ]
            }
        }
    
    def process_message(self, user_id, message, user_context=None):
        """Main method to process user messages and generate responses"""
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        # Store user message
        self.conversation_history[user_id].append({
            'type': 'user',
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        # Generate AI response
        response = self._generate_response(user_id, message, user_context)
        
        # Store AI response
        self.conversation_history[user_id].append({
            'type': 'ai',
            'message': response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Keep only last 20 messages to prevent memory overload
        if len(self.conversation_history[user_id]) > 20:
            self.conversation_history[user_id] = self.conversation_history[user_id][-20:]
        
        return response
    
    def _generate_response(self, user_id, message, user_context):
        """Generate appropriate response based on message content"""
        message_lower = message.lower().strip()
        
        # Check for greetings
        if self._is_greeting(message_lower):
            return random.choice(self.general_knowledge['greetings'])
        
        # Check for workout-related queries
        if self._is_workout_related(message_lower):
            return self._handle_workout_query(message_lower, user_context)
        
        # Check for nutrition-related queries
        if self._is_nutrition_related(message_lower):
            return self._handle_nutrition_query(message_lower, user_context)
        
        # Check for progress tracking
        if self._is_progress_related(message_lower):
            return self._handle_progress_query(message_lower, user_context)
        
        # Check for motivational requests
        if self._is_motivational(message_lower):
            return self._handle_motivational_query()
        
        # Check for BMI/health queries
        if self._is_health_related(message_lower):
            return self._handle_health_query(message_lower, user_context)
        
        # Check for personal questions
        if self._is_personal_query(message_lower):
            return self._handle_personal_query()
        
        # Default response for unrecognized queries
        return self._handle_general_query(message_lower)
    
    def _is_greeting(self, message):
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup']
        return any(greeting in message for greeting in greetings)
    
    def _is_workout_related(self, message):
        workout_keywords = ['workout', 'exercise', 'train', 'gym', 'lift', 'cardio', 'strength', 'hiit', 'yoga', 'run', 'jog', 'squat', 'deadlift', 'bench']
        return any(keyword in message for keyword in workout_keywords)
    
    def _is_nutrition_related(self, message):
        nutrition_keywords = ['diet', 'food', 'eat', 'nutrition', 'calorie', 'protein', 'carb', 'fat', 'meal', 'breakfast', 'lunch', 'dinner', 'snack']
        return any(keyword in message for keyword in nutrition_keywords)
    
    def _is_progress_related(self, message):
        progress_keywords = ['progress', 'track', 'improve', 'better', 'results', 'gain', 'lose', 'weight', 'muscle']
        return any(keyword in message for keyword in progress_keywords)
    
    def _is_motivational(self, message):
        motivational_keywords = ['motivate', 'motivation', 'inspire', 'encourage', 'tired', 'lazy', 'demotivated']
        return any(keyword in message for keyword in motivational_keywords)
    
    def _is_health_related(self, message):
        health_keywords = ['bmi', 'health', 'body mass', 'weight', 'height', 'calorie', 'maintenance']
        return any(keyword in message for keyword in health_keywords)
    
    def _is_personal_query(self, message):
        personal_keywords = ['how are you', 'who are you', 'what are you', 'your name', 'you doing']
        return any(keyword in message for keyword in personal_keywords)
    
    def _handle_workout_query(self, message, user_context):
        """Handle workout-related queries"""
        responses = []
        
        # Check for specific exercise types
        if any(word in message for word in ['cardio', 'run', 'jog', 'cycle']):
            exercises = self.workout_knowledge['exercises']['cardio']
            responses.append(f"Great choice! For cardio, I recommend: {', '.join(exercises)}. 🏃‍♂️")
            responses.append("Start with 20-30 minutes and gradually increase duration and intensity.")
        
        elif any(word in message for word in ['strength', 'lift', 'weight', 'muscle']):
            exercises = self.workout_knowledge['exercises']['strength']
            responses.append(f"Strength training is awesome! Try these: {', '.join(exercises)}. 💪")
            responses.append("Focus on proper form and progressive overload for best results.")
        
        elif any(word in message for word in ['hiit', 'high intensity', 'interval']):
            exercises = self.workout_knowledge['exercises']['hiit']
            responses.append(f"HIIT is super effective! Consider: {', '.join(exercises)}. 🔥")
            responses.append("Do 20-30 seconds of intense exercise followed by 10-15 seconds rest.")
        
        elif any(word in message for word in ['beginner', 'start', 'new']):
            plan = self.workout_knowledge['workout_plans']['beginner']
            responses.append("Perfect for starting out! Here's a beginner plan:")
            responses.append(f"Cardio: {plan['cardio']}")
            responses.append(f"Strength: {plan['strength']}")
            responses.append(f"Tip: {plan['recommendation']}")
        
        else:
            # General workout advice
            responses.append("I'd love to help with your workout! 💪")
            responses.append("Could you tell me:")
            responses.append("• Your fitness level (beginner/intermediate/advanced)")
            responses.append("• Available equipment")
            responses.append("• Your main goal (weight loss/muscle gain/endurance)")
        
        # Add motivational element
        responses.append(random.choice(self.general_knowledge['motivational_quotes']))
        
        return "\n".join(responses)
    
    def _handle_nutrition_query(self, message, user_context):
        """Handle nutrition-related queries"""
        responses = []
        
        if any(word in message for word in ['lose weight', 'weight loss', 'slim']):
            macros = self.nutrition_knowledge['macros']['weight_loss']
            responses.append("For weight loss, focus on:")
            responses.append(f"Macro split: {macros}")
            responses.append("Create a calorie deficit of 300-500 calories daily.")
            responses.append("Include plenty of vegetables and lean proteins!")
        
        elif any(word in message for word in ['gain muscle', 'muscle growth', 'bulk']):
            macros = self.nutrition_knowledge['macros']['muscle_gain']
            responses.append("For muscle gain, consider:")
            responses.append(f"Macro split: {macros}")
            responses.append("Aim for 1.6-2.2g of protein per kg of body weight.")
            responses.append("Eat in a slight calorie surplus (200-300 calories).")
        
        elif any(word in message for word in ['protein', 'meat', 'eggs']):
            foods = self.nutrition_knowledge['food_suggestions']['protein']
            responses.append(f"Great protein sources: {', '.join(foods)}")
            responses.append("Aim to include protein in every meal for muscle repair!")
        
        elif any(word in message for word in ['meal', 'eat', 'food', 'diet']):
            responses.append("Here are some general nutrition tips: 🥗")
            responses.append("• Eat balanced meals with protein, carbs, and healthy fats")
            responses.append("• Stay hydrated - drink 2-3 liters of water daily")
            responses.append("• Include colorful vegetables for vitamins and minerals")
            responses.append("• Plan your meals ahead to avoid unhealthy choices")
        
        else:
            responses.append("I can help with nutrition advice! 🍎")
            responses.append("Tell me about your:")
            responses.append("• Current diet")
            responses.append("• Food preferences/allergies")
            responses.append("• Specific goals")
        
        return "\n".join(responses)
    
    def _handle_progress_query(self, message, user_context):
        """Handle progress and tracking queries"""
        responses = []
        
        if any(word in message for word in ['not seeing results', 'plateau', 'stuck']):
            responses.append("Plateaus are normal! Here's how to break through: 🔄")
            responses.append("1. Change your workout routine")
            responses.append("2. Increase intensity or volume")
            responses.append("3. Review your nutrition")
            responses.append("4. Ensure adequate rest and recovery")
            responses.append("5. Stay consistent and patient!")
        
        elif any(word in message for word in ['measure progress', 'track']):
            responses.append("Great question! Track your progress through: 📊")
            responses.append("• Weekly measurements (waist, arms, etc.)")
            responses.append("• Progress photos every 2-4 weeks")
            responses.append("• Strength improvements (lifting heavier)")
            responses.append("• How your clothes fit")
            responses.append("• Energy levels and overall well-being")
        
        else:
            responses.append("Tracking progress is key to success! 🎯")
            responses.append("Remember: Progress isn't always linear.")
            responses.append("Celebrate small wins and stay consistent!")
        
        responses.append(random.choice(self.general_knowledge['motivational_quotes']))
        return "\n".join(responses)
    
    def _handle_motivational_query(self):
        """Provide motivational responses"""
        responses = [
            "💪 " + random.choice(self.general_knowledge['motivational_quotes']),
            "Remember why you started! You've got this! 🌟",
            "Every rep, every healthy meal, every early morning - it all adds up! 🏆",
            "The pain you feel today will be the strength you feel tomorrow! 🔥",
            "Don't let temporary discomfort stop you from permanent results! 🚀"
        ]
        return random.choice(responses)
    
    def _handle_health_query(self, message, user_context):
        """Handle health and BMI related queries"""
        responses = []
        
        if 'bmi' in message and user_context and user_context.get('bmi'):
            bmi = user_context['bmi']
            if bmi < 18.5:
                category = "underweight"
                advice = "Focus on strength training and calorie surplus"
            elif bmi < 25:
                category = "normal weight"
                advice = "Great! Maintain with balanced diet and regular exercise"
            elif bmi < 30:
                category = "overweight"
                advice = "Focus on cardio and calorie deficit with strength training"
            else:
                category = "obese"
                advice = "Start with low-impact cardio and gradual lifestyle changes"
            
            responses.append(f"Your BMI is {bmi:.1f} ({category}). {advice}.")
        
        elif 'calorie' in message and user_context and user_context.get('dailyCalories'):
            calories = user_context.get('dailyCalories', 2000)
            responses.append(f"Your daily calorie target is approximately {calories} calories.")
            responses.append("Remember to adjust based on your activity level and goals!")
        
        else:
            responses.append("I can help with health metrics! 📈")
            responses.append("Make sure your profile is updated with your current weight and height.")
            responses.append("I can then provide personalized BMI and calorie advice!")
        
        return "\n".join(responses)
    
    def _handle_personal_query(self):
        """Handle personal questions about the AI"""
        responses = [
            "I'm your AI fitness assistant! I'm here 24/7 to help you achieve your fitness goals and live a healthier life! 🤖💪",
            "I'm FitAI - your personal fitness companion! I live in this app and my only goal is to help you become the healthiest version of yourself! 🌟",
            "I'm an AI designed specifically to support your fitness journey! I can help with workouts, nutrition, motivation, and tracking your progress! 🎯",
            "I'm your virtual fitness coach! While I'm not human, I'm trained to understand fitness, nutrition, and motivation to help you succeed! 🏋️‍♂️"
        ]
        return random.choice(responses)
    
    def _handle_general_query(self, message):
        """Handle general/unrecognized queries"""
        responses = [
            "I'm not sure I understand completely. Could you rephrase that? I'm great with fitness, nutrition, and motivation topics! 💭",
            "I'd love to help! Could you provide more details? I specialize in workout plans, nutrition advice, and fitness motivation! 🎯",
            "That's an interesting question! While I focus on fitness, I can help with workout routines, diet plans, progress tracking, and general health advice! 🌟",
            "I'm here to support your fitness journey! Tell me more about what you need help with - workouts, nutrition, or motivation? 💪"
        ]
        return random.choice(responses)
    
    def get_conversation_history(self, user_id):
        """Get conversation history for a user"""
        return self.conversation_history.get(user_id, [])
    
    def clear_conversation_history(self, user_id):
        """Clear conversation history for a user"""
        if user_id in self.conversation_history:
            self.conversation_history[user_id] = []

# Global instance
ai_assistant = EnhancedAIAssistant()