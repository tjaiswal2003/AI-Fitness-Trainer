from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pickle
import os
from calorie_calculator import calculate_calories, classify_bmi, get_workout_recommendation
from enhanced_ai_assistant import ai_assistant  # Import our enhanced AI

app = Flask(__name__)
CORS(app)

# Load or initialize models
MODEL_PATH = 'models/'
os.makedirs(MODEL_PATH, exist_ok=True)

try:
    with open(os.path.join(MODEL_PATH, 'calorie_model.pkl'), 'rb') as f:
        calorie_model = pickle.load(f)
    with open(os.path.join(MODEL_PATH, 'scaler.pkl'), 'rb') as f:
        scaler = pickle.load(f)
except:
    # Initialize with dummy model for development
    calorie_model = RandomForestRegressor(n_estimators=100, random_state=42)
    scaler = StandardScaler()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ML Service is running'})

@app.route('/api/calculate-bmi', methods=['POST'])
def calculate_bmi():
    try:
        data = request.json
        weight = float(data['weight'])  # kg
        height = float(data['height'])  # cm
        
        height_in_m = height / 100
        bmi = weight / (height_in_m ** 2)
        category = classify_bmi(bmi)
        
        return jsonify({
            'bmi': round(bmi, 2),
            'category': category,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

@app.route('/api/calculate-calories', methods=['POST'])
def calculate_daily_calories():
    try:
        data = request.json
        age = int(data['age'])
        gender = data['gender']
        weight = float(data['weight'])
        height = float(data['height'])
        activity_level = data['activity_level']
        goal = data['goal']
        
        calories = calculate_calories(age, gender, weight, height, activity_level, goal)
        
        return jsonify({
            'daily_calories': calories,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

@app.route('/api/recommend-workout', methods=['POST'])
def recommend_workout():
    try:
        data = request.json
        bmi = float(data['bmi'])
        goal = data['goal']
        fitness_level = data['fitness_level']
        available_equipment = data.get('available_equipment', [])
        
        recommendation = get_workout_recommendation(bmi, goal, fitness_level, available_equipment)
        
        return jsonify({
            'workout_plan': recommendation,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

@app.route('/api/analyze-food', methods=['POST'])
def analyze_food():
    try:
        data = request.json
        food_items = data['food_items']
        
        # This would integrate with a food database API in production
        # For now, return estimated values
        analysis = []
        for item in food_items:
            # Simple estimation (in production, use proper food database)
            estimated_calories = len(item) * 10  # Placeholder calculation
            analysis.append({
                'food': item,
                'calories': estimated_calories,
                'protein': estimated_calories * 0.3 / 4,  # 30% protein
                'carbs': estimated_calories * 0.5 / 4,    # 50% carbs
                'fats': estimated_calories * 0.2 / 9      # 20% fats
            })
        
        return jsonify({
            'analysis': analysis,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

@app.route('/api/ai-chat', methods=['POST'])
def ai_chat():
    try:
        data = request.json
        message = data['message']
        user_id = data.get('user_id', 'default_user')
        user_context = data.get('user_context', {})
        
        # Use enhanced AI assistant
        response = ai_assistant.process_message(user_id, message, user_context)
        
        # Get conversation history
        conversation_history = ai_assistant.get_conversation_history(user_id)
        
        return jsonify({
            'response': response,
            'conversation_history': conversation_history[-10:],  # Last 10 messages
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

@app.route('/api/ai-conversation-history', methods=['GET'])
def get_conversation_history():
    try:
        user_id = request.args.get('user_id', 'default_user')
        conversation_history = ai_assistant.get_conversation_history(user_id)
        
        return jsonify({
            'conversation_history': conversation_history,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

@app.route('/api/ai-clear-history', methods=['POST'])
def clear_conversation_history():
    try:
        data = request.json
        user_id = data.get('user_id', 'default_user')
        
        ai_assistant.clear_conversation_history(user_id)
        
        return jsonify({
            'message': 'Conversation history cleared',
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)