import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistoryScreen = () => {
  const [foodHistory, setFoodHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  useEffect(() => {
    loadFoodHistory();
  }, []);

  const loadFoodHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('food_history');
      if (history) {
        setFoodHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading food history:', error);
    }
  };

  const deleteFoodEntry = async (index) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this food entry?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedHistory = foodHistory.filter((_, i) => i !== index);
              setFoodHistory(updatedHistory);
              await AsyncStorage.setItem('food_history', JSON.stringify(updatedHistory));
            } catch (error) {
              console.error('Error deleting food entry:', error);
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const groupFoodByDate = () => {
    const grouped = {};
    foodHistory.forEach((food) => {
      const date = formatDate(food.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(food);
    });
    return grouped;
  };

  const renderFoodItem = ({item, index}) => (
    <View style={styles.foodItem}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodServing}>
          {item.servingSize} {item.serving}
        </Text>
        <Text style={styles.foodTime}>{formatTime(item.timestamp)}</Text>
      </View>
      
      <View style={styles.macrosInfo}>
        <Text style={styles.calories}>{item.calories.toFixed(0)} cal</Text>
        <View style={styles.macrosRow}>
          <Text style={styles.macroText}>C: {item.carbs.toFixed(1)}g</Text>
          <Text style={styles.macroText}>P: {item.protein.toFixed(1)}g</Text>
          <Text style={styles.macroText}>F: {item.fat.toFixed(1)}g</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteFoodEntry(index)}>
        <Icon name="delete" size={20} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  const renderDateSection = ({item: date}) => {
    const groupedFood = groupFoodByDate();
    const foodsForDate = groupedFood[date] || [];
    
    if (foodsForDate.length === 0) return null;

    const totalCalories = foodsForDate.reduce((sum, food) => sum + food.calories, 0);
    const totalCarbs = foodsForDate.reduce((sum, food) => sum + food.carbs, 0);
    const totalProtein = foodsForDate.reduce((sum, food) => sum + food.protein, 0);
    const totalFat = foodsForDate.reduce((sum, food) => sum + food.fat, 0);

    return (
      <View style={styles.dateSection}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.totalCalories}>{totalCalories.toFixed(0)} cal</Text>
        </View>
        
        <View style={styles.dateSummary}>
          <Text style={styles.summaryText}>
            C: {totalCarbs.toFixed(1)}g | P: {totalProtein.toFixed(1)}g | F: {totalFat.toFixed(1)}g
          </Text>
        </View>
        
        {foodsForDate.map((food, index) => (
          <View key={`${food.timestamp}-${index}`}>
            {renderFoodItem({item: food, index: foodHistory.indexOf(food)})}
          </View>
        ))}
      </View>
    );
  };

  const getSortedDates = () => {
    const grouped = groupFoodByDate();
    return Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  };

  if (foodHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="restaurant" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No food entries yet</Text>
        <Text style={styles.emptySubtext}>
          Start tracking your meals by taking photos or scanning barcodes
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food History</Text>
        <Text style={styles.headerSubtitle}>
          {foodHistory.length} entries logged
        </Text>
      </View>
      
      <FlatList
        data={getSortedDates()}
        renderItem={renderDateSection}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateSummary: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  foodItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  foodServing: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  foodTime: {
    fontSize: 12,
    color: '#999',
  },
  macrosInfo: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  macrosRow: {
    flexDirection: 'row',
  },
  macroText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HistoryScreen;

