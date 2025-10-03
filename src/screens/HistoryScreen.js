import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistoryScreen = () => {
  const [foodHistory, setFoodHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFoodHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [foodHistory, searchQuery, sortBy, selectedDate]);

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

  const filterAndSortHistory = () => {
    let filtered = [...foodHistory];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.timestamp).toDateString();
        return itemDate === selectedDate;
      });
    }

    // Sort by selected criteria
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'calories_high':
        filtered.sort((a, b) => b.calories - a.calories);
        break;
      case 'calories_low':
        filtered.sort((a, b) => a.calories - b.calories);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredHistory(filtered);
  };

  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toDateString());
    }
    
    return dates;
  };

  const getTotalMacros = () => {
    return filteredHistory.reduce((totals, item) => ({
      calories: totals.calories + item.calories,
      carbs: totals.carbs + item.carbs,
      protein: totals.protein + item.protein,
      fat: totals.fat + item.fat,
    }), { calories: 0, carbs: 0, protein: 0, fat: 0 });
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
          {filteredHistory.length} entries found
        </Text>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search food entries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}>
          <Icon name="filter-list" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Date:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getDateOptions().map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateFilter,
                    selectedDate === date && styles.selectedDateFilter,
                  ]}
                  onPress={() => setSelectedDate(date)}>
                  <Text
                    style={[
                      styles.dateFilterText,
                      selectedDate === date && styles.selectedDateFilterText,
                    ]}>
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { key: 'newest', label: 'Newest' },
                { key: 'oldest', label: 'Oldest' },
                { key: 'calories_high', label: 'Calories ↑' },
                { key: 'calories_low', label: 'Calories ↓' },
                { key: 'name', label: 'Name' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortFilter,
                    sortBy === option.key && styles.selectedSortFilter,
                  ]}
                  onPress={() => setSortBy(option.key)}>
                  <Text
                    style={[
                      styles.sortFilterText,
                      sortBy === option.key && styles.selectedSortFilterText,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Summary Card */}
      {filteredHistory.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Daily Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Calories:</Text>
            <Text style={styles.summaryValue}>{getTotalMacros().calories.toFixed(0)}</Text>
          </View>
          <View style={styles.summaryMacros}>
            <Text style={styles.summaryMacro}>C: {getTotalMacros().carbs.toFixed(1)}g</Text>
            <Text style={styles.summaryMacro}>P: {getTotalMacros().protein.toFixed(1)}g</Text>
            <Text style={styles.summaryMacro}>F: {getTotalMacros().fat.toFixed(1)}g</Text>
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredHistory}
        renderItem={renderFoodItem}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No entries found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterRow: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dateFilter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    marginRight: 10,
  },
  selectedDateFilter: {
    backgroundColor: '#4CAF50',
  },
  dateFilterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sortFilter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    marginRight: 10,
  },
  selectedSortFilter: {
    backgroundColor: '#4CAF50',
  },
  sortFilterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedSortFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  summaryMacro: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default HistoryScreen;

