import numpy as np

def calculate_calories(age, gender, weight, height, activity_level, goal):
    """
    Calculate daily calorie needs using Mifflin-St Jeor Equation
    """
    # Basal Metabolic Rate
    if gender.lower() == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    
    # Activity multiplier
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    
    activity_multiplier = activity_multipliers.get(activity_level.lower(), 1.2)
    maintenance_calories = bmr * activity_multiplier
    
    # Adjust for goal
    goal_adjustments = {
        'weight_loss': -500,
        'muscle_gain': 300,
        'maintenance': 0,
        'endurance': 200
    }
    
    adjustment = goal_adjustments.get(goal.lower(), 0)
    target_calories = maintenance_calories + adjustment
    
    return round(target_calories)

def classify_bmi(bmi):
    """
    Classify BMI into categories
    """
    if bmi < 18.5:
        return 'Underweight'
    elif 18.5 <= bmi < 25:
        return 'Normal weight'
    elif 25 <= bmi < 30:
        return 'Overweight'
    else:
        return 'Obese'

def get_workout_recommendation(bmi, goal, fitness_level, available_equipment):
    """
    Generate workout recommendations based on user profile
    """
    recommendations = {
        'Underweight': {
            'weight_loss': "Focus on strength training with compound exercises. Include adequate rest and calorie surplus.",
            'muscle_gain': "Heavy compound lifts with progressive overload. 3-4 sessions weekly.",
            'maintenance': "Balanced routine with strength and light cardio.",
            'endurance': "Strength training with moderate cardio sessions."
        },
        'Normal weight': {
            'weight_loss': "Mix of HIIT and strength training. Focus on calorie deficit.",
            'muscle_gain': "Progressive strength training with adequate protein intake.",
            'maintenance': "Balanced workout routine with variety.",
            'endurance': "Cardio-focused training with strength maintenance."
        },
        'Overweight': {
            'weight_loss': "Low-impact cardio combined with strength training. Gradual intensity increase.",
            'muscle_gain': "Strength training with controlled calorie surplus.",
            'maintenance': "Balanced routine focusing on consistency.",
            'endurance': "Gradual cardio progression with strength training."
        },
        'Obese': {
            'weight_loss': "Low-impact exercises like walking, swimming. Focus on sustainable habits.",
            'muscle_gain': "Light strength training with focus on form and consistency.",
            'maintenance': "Gentle, consistent exercise routine.",
            'endurance': "Gradual walking program building up duration."
        }
    }
    
    bmi_category = classify_bmi(bmi)
    base_recommendation = recommendations[bmi_category][goal]
    
    # Adjust for fitness level
    if fitness_level == 'beginner':
        base_recommendation += " Start with 2-3 sessions per week. Focus on proper form."
    elif fitness_level == 'intermediate':
        base_recommendation += " Train 3-5 times weekly. Incorporate progressive overload."
    else:
        base_recommendation += " Advanced programming with periodization. 4-6 sessions weekly."
    
    return base_recommendation