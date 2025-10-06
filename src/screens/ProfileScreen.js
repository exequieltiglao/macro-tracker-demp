import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  calculateBMR,
  calculateTDEE,
  calculateMacroGoals,
  calculateBMI,
  getBMICategory,
  calculateIdealWeightRange,
  calculateWaterIntake,
} from '../services/GoalCalculator';

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  const [goals, setGoals] = useState({
    calories: 2000,
    carbs: 250,
    protein: 150,
    fat: 65,
  });

  const [notifications, setNotifications] = useState({
    mealReminders: true,
    goalAchieved: true,
    weeklyReport: false,
  });

  const [calculatedMetrics, setCalculatedMetrics] = useState({
    bmr: 0,
    tdee: 0,
    bmi: 0,
    bmiCategory: '',
    idealWeight: {min: 0, max: 0, ideal: 0},
    waterIntake: {ml: 0, cups: 0, liters: 0},
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [userProfile, goals, calculateMetrics]);

  const loadUserData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('user_profile');
      const savedGoals = await AsyncStorage.getItem('user_goals');
      const savedNotifications = await AsyncStorage.getItem(
        'notification_settings',
      );

      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const calculateMetrics = useCallback(() => {
    if (
      userProfile.weight &&
      userProfile.height &&
      userProfile.age &&
      userProfile.gender
    ) {
      const weight = parseFloat(userProfile.weight);
      const height = parseFloat(userProfile.height);
      const age = parseInt(userProfile.age);
      const gender = userProfile.gender;

      // Calculate BMR and TDEE
      const bmr = calculateBMR(weight, height, age, gender);
      const tdee = calculateTDEE(bmr, userProfile.activityLevel);

      // Calculate BMI
      const bmi = calculateBMI(weight, height);
      const bmiCategory = getBMICategory(bmi);

      // Calculate ideal weight range
      const idealWeight = calculateIdealWeightRange(height, gender);

      // Calculate water intake
      const waterIntake = calculateWaterIntake(
        weight,
        userProfile.activityLevel,
      );

      setCalculatedMetrics({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory: bmiCategory.category,
        idealWeight,
        waterIntake,
      });

      // Auto-calculate goals if not manually set
      if (!goals.calories || goals.calories === 2000) {
        const newGoals = calculateMacroGoals(tdee, userProfile.goal);
        setGoals(newGoals);
      }
    }
  }, [userProfile, goals, setGoals]);

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(userProfile));
      await AsyncStorage.setItem('user_goals', JSON.stringify(goals));
      await AsyncStorage.setItem(
        'notification_settings',
        JSON.stringify(notifications),
      );
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const calculateRecommendedGoals = () => {
    const weight = parseFloat(userProfile.weight) || 70;
    const height = parseFloat(userProfile.height) || 170;
    const age = parseInt(userProfile.age) || 25;

    // Basic BMR calculation (Mifflin-St Jeor Equation)
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Male formula
    // For female: bmr = 10 * weight + 6.25 * height - 5 * age - 161

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const multiplier = activityMultipliers[userProfile.activityLevel] || 1.55;
    let calories = Math.round(bmr * multiplier);

    // Goal adjustments
    if (userProfile.goal === 'lose') {
      calories -= 500; // 1 lb per week deficit
    } else if (userProfile.goal === 'gain') {
      calories += 500; // 1 lb per week surplus
    }

    const protein = Math.round(weight * 2.2); // 1g per lb
    const fat = Math.round((calories * 0.25) / 9); // 25% of calories from fat
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    setGoals({
      calories: Math.max(calories, 1200),
      carbs: Math.max(carbs, 50),
      protein: Math.max(protein, 50),
      fat: Math.max(fat, 20),
    });
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your food entries and reset your profile. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'food_history',
                'user_profile',
                'user_goals',
                'notification_settings',
              ]);

              // Clear daily macros for all dates
              const keys = await AsyncStorage.getAllKeys();
              const macroKeys = keys.filter(key => key.startsWith('macros_'));
              await AsyncStorage.multiRemove(macroKeys);

              Alert.alert('Success', 'All data has been cleared');
              loadUserData();
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ],
    );
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  const GoalInput = ({label, value, onChangeText, unit}) => (
    <View style={styles.goalInputContainer}>
      <Text style={styles.goalLabel}>{label}</Text>
      <TextInput
        style={styles.goalInput}
        value={value.toString()}
        onChangeText={text => onChangeText(parseInt(text) || 0)}
        keyboardType="numeric"
      />
      <Text style={styles.goalUnit}>{unit}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="person" size={60} color="#4CAF50" />
        <Text style={styles.headerTitle}>Profile Settings</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <InputField
          label="Name"
          value={userProfile.name}
          onChangeText={text => setUserProfile({...userProfile, name: text})}
          placeholder="Enter your name"
        />

        <InputField
          label="Age"
          value={userProfile.age}
          onChangeText={text => setUserProfile({...userProfile, age: text})}
          placeholder="Enter your age"
          keyboardType="numeric"
        />

        <InputField
          label="Weight (kg)"
          value={userProfile.weight}
          onChangeText={text => setUserProfile({...userProfile, weight: text})}
          placeholder="Enter your weight"
          keyboardType="numeric"
        />

        <InputField
          label="Height (cm)"
          value={userProfile.height}
          onChangeText={text => setUserProfile({...userProfile, height: text})}
          placeholder="Enter your height"
          keyboardType="numeric"
        />
      </View>

      {/* Activity Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Level</Text>
        {['sedentary', 'light', 'moderate', 'active', 'very_active'].map(
          level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.activityOption,
                userProfile.activityLevel === level && styles.selectedActivity,
              ]}
              onPress={() =>
                setUserProfile({...userProfile, activityLevel: level})
              }>
              <Text
                style={[
                  styles.activityText,
                  userProfile.activityLevel === level &&
                    styles.selectedActivityText,
                ]}>
                {level.charAt(0).toUpperCase() +
                  level.slice(1).replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goal</Text>
        {['lose', 'maintain', 'gain'].map(goal => (
          <TouchableOpacity
            key={goal}
            style={[
              styles.goalOption,
              userProfile.goal === goal && styles.selectedGoal,
            ]}
            onPress={() => setUserProfile({...userProfile, goal})}>
            <Text
              style={[
                styles.goalText,
                userProfile.goal === goal && styles.selectedGoalText,
              ]}>
              {goal.charAt(0).toUpperCase() + goal.slice(1)} Weight
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calculated Metrics */}
      {calculatedMetrics.bmr > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Metrics</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{calculatedMetrics.bmr}</Text>
              <Text style={styles.metricLabel}>BMR (cal/day)</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{calculatedMetrics.tdee}</Text>
              <Text style={styles.metricLabel}>TDEE (cal/day)</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{calculatedMetrics.bmi}</Text>
              <Text style={styles.metricLabel}>BMI</Text>
              <Text
                style={[
                  styles.metricSubtext,
                  {color: getBMICategory(calculatedMetrics.bmi).color},
                ]}>
                {calculatedMetrics.bmiCategory}
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {calculatedMetrics.waterIntake.cups}
              </Text>
              <Text style={styles.metricLabel}>Water (cups)</Text>
            </View>
          </View>

          <View style={styles.idealWeightContainer}>
            <Text style={styles.idealWeightTitle}>Ideal Weight Range</Text>
            <Text style={styles.idealWeightText}>
              {calculatedMetrics.idealWeight.min} -{' '}
              {calculatedMetrics.idealWeight.max} kg
            </Text>
            <Text style={styles.idealWeightSubtext}>
              Target: {calculatedMetrics.idealWeight.ideal} kg
            </Text>
          </View>
        </View>
      )}

      {/* Macro Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Macro Goals</Text>
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateRecommendedGoals}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        <GoalInput
          label="Calories"
          value={goals.calories}
          onChangeText={value => setGoals({...goals, calories: value})}
          unit="kcal"
        />

        <GoalInput
          label="Carbohydrates"
          value={goals.carbs}
          onChangeText={value => setGoals({...goals, carbs: value})}
          unit="g"
        />

        <GoalInput
          label="Protein"
          value={goals.protein}
          onChangeText={value => setGoals({...goals, protein: value})}
          unit="g"
        />

        <GoalInput
          label="Fat"
          value={goals.fat}
          onChangeText={value => setGoals({...goals, fat: value})}
          unit="g"
        />
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.notificationItem}>
          <Text style={styles.notificationLabel}>Meal Reminders</Text>
          <Switch
            value={notifications.mealReminders}
            onValueChange={value =>
              setNotifications({...notifications, mealReminders: value})
            }
            trackColor={{false: '#767577', true: '#4CAF50'}}
            thumbColor={notifications.mealReminders ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.notificationItem}>
          <Text style={styles.notificationLabel}>Goal Achieved</Text>
          <Switch
            value={notifications.goalAchieved}
            onValueChange={value =>
              setNotifications({...notifications, goalAchieved: value})
            }
            trackColor={{false: '#767577', true: '#4CAF50'}}
            thumbColor={notifications.goalAchieved ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.notificationItem}>
          <Text style={styles.notificationLabel}>Weekly Report</Text>
          <Switch
            value={notifications.weeklyReport}
            onValueChange={value =>
              setNotifications({...notifications, weeklyReport: value})
            }
            trackColor={{false: '#767577', true: '#4CAF50'}}
            thumbColor={notifications.weeklyReport ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.saveButton} onPress={saveUserData}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  activityOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedActivity: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  activityText: {
    fontSize: 16,
    color: '#333',
  },
  selectedActivityText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  goalOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedGoal: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  goalText: {
    fontSize: 16,
    color: '#333',
  },
  selectedGoalText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  goalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
    marginRight: 10,
  },
  goalUnit: {
    fontSize: 16,
    color: '#666',
    width: 40,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationLabel: {
    fontSize: 16,
    color: '#333',
  },
  actionSection: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  metricSubtext: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  idealWeightContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  idealWeightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  idealWeightText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  idealWeightSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default ProfileScreen;
