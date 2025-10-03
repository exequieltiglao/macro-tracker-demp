import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LineChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const [dailyMacros, setDailyMacros] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
  });

  const [goals, setGoals] = useState({
    calories: 2000,
    carbs: 250,
    protein: 150,
    fat: 65,
  });

  useEffect(() => {
    loadTodayMacros();
    loadGoals();
  }, []);

  const loadTodayMacros = async () => {
    try {
      const today = new Date().toDateString();
      const savedMacros = await AsyncStorage.getItem(`macros_${today}`);
      if (savedMacros) {
        setDailyMacros(JSON.parse(savedMacros));
      }
    } catch (error) {
      console.error('Error loading macros:', error);
    }
  };

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem('user_goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const MacroCard = ({title, current, goal, unit, color}) => {
    const percentage = goal > 0 ? (current / goal) * 100 : 0;
    
    return (
      <View style={styles.macroCard}>
        <LinearGradient
          colors={[color, `${color}80`]}
          style={styles.macroGradient}>
          <Text style={styles.macroTitle}>{title}</Text>
          <Text style={styles.macroValue}>
            {current.toFixed(0)} / {goal} {unit}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${Math.min(percentage, 100)}%`},
              ]}
            />
          </View>
          <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
        </LinearGradient>
      </View>
    );
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [1200, 1500, 1800, 1600, 2000, 1700, 1900],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.macrosContainer}>
        <MacroCard
          title="Calories"
          current={dailyMacros.calories}
          goal={goals.calories}
          unit="kcal"
          color="#4CAF50"
        />
        <MacroCard
          title="Carbs"
          current={dailyMacros.carbs}
          goal={goals.carbs}
          unit="g"
          color="#FF9800"
        />
        <MacroCard
          title="Protein"
          current={dailyMacros.protein}
          goal={goals.protein}
          unit="g"
          color="#2196F3"
        />
        <MacroCard
          title="Fat"
          current={dailyMacros.fat}
          goal={goals.fat}
          unit="g"
          color="#E91E63"
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Calorie Intake</Text>
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#4CAF50',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Add Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Scan Barcode</Text>
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
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  macrosContainer: {
    padding: 20,
  },
  macroCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  macroGradient: {
    padding: 20,
  },
  macroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  macroValue: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'right',
  },
  chartContainer: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

