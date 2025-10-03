// BMR and TDEE calculation service for personalized macro goals

// Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
export const calculateBMR = (weight, height, age, gender) => {
  // Weight in kg, height in cm, age in years
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,      // Little to no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Heavy exercise 6-7 days/week
    very_active: 1.9     // Very heavy exercise, physical job
  };
  
  return bmr * activityMultipliers[activityLevel] || bmr * 1.55;
};

// Calculate macro goals based on TDEE and user preferences
export const calculateMacroGoals = (tdee, goal, proteinRatio = 0.25, fatRatio = 0.25) => {
  let targetCalories = tdee;
  
  // Adjust calories based on goal
  switch (goal) {
    case 'lose':
      targetCalories = tdee - 500; // 1 lb/week deficit
      break;
    case 'maintain':
      targetCalories = tdee;
      break;
    case 'gain':
      targetCalories = tdee + 500; // 1 lb/week surplus
      break;
    default:
      targetCalories = tdee;
  }
  
  // Ensure minimum calories
  targetCalories = Math.max(targetCalories, 1200);
  
  // Calculate macros (1g protein = 4 cal, 1g carbs = 4 cal, 1g fat = 9 cal)
  const proteinCalories = targetCalories * proteinRatio;
  const fatCalories = targetCalories * fatRatio;
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  
  return {
    calories: Math.round(targetCalories),
    protein: Math.round(proteinCalories / 4),
    carbs: Math.round(carbCalories / 4),
    fat: Math.round(fatCalories / 9)
  };
};

// Calculate BMI
export const calculateBMI = (weight, height) => {
  // Weight in kg, height in cm
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Get BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { category: 'Underweight', color: '#2196F3' };
  if (bmi < 25) return { category: 'Normal weight', color: '#4CAF50' };
  if (bmi < 30) return { category: 'Overweight', color: '#FF9800' };
  return { category: 'Obese', color: '#F44336' };
};

// Calculate ideal weight range
export const calculateIdealWeightRange = (height, gender) => {
  // Using Devine formula
  const heightInInches = height / 2.54;
  let idealWeight;
  
  if (gender === 'male') {
    idealWeight = 50 + 2.3 * (heightInInches - 60);
  } else {
    idealWeight = 45.5 + 2.3 * (heightInInches - 60);
  }
  
  return {
    min: Math.round(idealWeight * 0.9),
    max: Math.round(idealWeight * 1.1),
    ideal: Math.round(idealWeight)
  };
};

// Calculate water intake recommendation
export const calculateWaterIntake = (weight, activityLevel) => {
  // Base: 35ml per kg of body weight
  let baseIntake = weight * 35;
  
  // Adjust for activity level
  const activityMultipliers = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    very_active: 1.4
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1;
  const totalMl = baseIntake * multiplier;
  
  return {
    ml: Math.round(totalMl),
    cups: Math.round(totalMl / 240), // 1 cup = 240ml
    liters: Math.round(totalMl / 1000 * 10) / 10
  };
};

// Get macro distribution recommendations based on goals
export const getMacroDistribution = (goal) => {
  const distributions = {
    lose: {
      protein: 0.3,  // Higher protein for satiety
      carbs: 0.35,
      fat: 0.35
    },
    maintain: {
      protein: 0.25,
      carbs: 0.45,
      fat: 0.3
    },
    gain: {
      protein: 0.25,
      carbs: 0.5,    // Higher carbs for energy
      fat: 0.25
    }
  };
  
  return distributions[goal] || distributions.maintain;
};

// Calculate weekly progress metrics
export const calculateWeeklyProgress = (currentWeight, previousWeight, goal) => {
  const weightChange = currentWeight - previousWeight;
  const weeklyChange = weightChange / 7; // Assuming daily weigh-ins
  
  let status = 'maintaining';
  let message = 'You\'re maintaining your weight';
  
  if (goal === 'lose') {
    if (weeklyChange < -0.5) {
      status = 'excellent';
      message = 'Great progress! You\'re losing weight at a healthy rate';
    } else if (weeklyChange < 0) {
      status = 'good';
      message = 'Good progress! Keep it up';
    } else if (weeklyChange > 0.5) {
      status = 'warning';
      message = 'You\'re gaining weight. Consider adjusting your calorie intake';
    }
  } else if (goal === 'gain') {
    if (weeklyChange > 0.5) {
      status = 'excellent';
      message = 'Great progress! You\'re gaining weight at a healthy rate';
    } else if (weeklyChange > 0) {
      status = 'good';
      message = 'Good progress! Keep it up';
    } else if (weeklyChange < -0.5) {
      status = 'warning';
      message = 'You\'re losing weight. Consider increasing your calorie intake';
    }
  }
  
  return {
    weightChange,
    weeklyChange: Math.round(weeklyChange * 10) / 10,
    status,
    message
  };
};
