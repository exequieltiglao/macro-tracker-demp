import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FOOD_DATABASE, searchFoods, getRandomFoods, calculateMacrosForServing} from '../services/FoodDatabase';

const {width, height} = Dimensions.get('window');

const CameraScreen = () => {
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedFoods, setSuggestedFoods] = useState([]);

  useEffect(() => {
    // Load suggested foods on component mount
    setSuggestedFoods(getRandomFoods(6));
  }, []);

  const takePicture = () => {
    // Simulate food recognition (in a real app, you'd use ML/AI)
    const randomFoods = getRandomFoods(3);
    const mockFood = randomFoods[0];
    
    setSelectedFood(mockFood);
    setShowFoodModal(true);
  };

  const scanBarcode = () => {
    // Simulate barcode scanning (in a real app, you'd use a barcode scanner library)
    setTimeout(() => {
      // Mock food data from barcode - use actual food from database
      const mockFood = FOOD_DATABASE.protein_bar;
      
      setSelectedFood(mockFood);
      setShowFoodModal(true);
    }, 1000);
  };

  const searchFood = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = searchFoods(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectFood = (food) => {
    setSelectedFood(food);
    setShowSearchModal(false);
    setShowFoodModal(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const addFoodToLog = async () => {
    if (!selectedFood) return;

    try {
      const today = new Date().toDateString();
      const servingMultiplier = parseFloat(servingSize) || 1;
      
      // Calculate macros for the serving size
      const calculatedFood = calculateMacrosForServing(selectedFood, servingMultiplier);
      
      const foodEntry = {
        ...calculatedFood,
        servingSize: servingSize,
        timestamp: new Date().toISOString(),
      };

      // Load existing macros for today
      const existingMacros = await AsyncStorage.getItem(`macros_${today}`);
      let dailyMacros = existingMacros ? JSON.parse(existingMacros) : {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
      };

      // Add new food macros
      dailyMacros.calories += foodEntry.calories;
      dailyMacros.carbs += foodEntry.carbs;
      dailyMacros.protein += foodEntry.protein;
      dailyMacros.fat += foodEntry.fat;

      // Save updated macros
      await AsyncStorage.setItem(`macros_${today}`, JSON.stringify(dailyMacros));

      // Save food entry to history
      const foodHistory = await AsyncStorage.getItem('food_history');
      let history = foodHistory ? JSON.parse(foodHistory) : [];
      history.unshift(foodEntry);
      await AsyncStorage.setItem('food_history', JSON.stringify(history));

      Alert.alert('Success', 'Food added to your daily log!');
      setShowFoodModal(false);
      setSelectedFood(null);
      setServingSize('1');
    } catch (error) {
      console.error('Error saving food:', error);
      Alert.alert('Error', 'Failed to save food entry');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mockCamera}>
        <Icon name="camera-alt" size={100} color="#ccc" />
        <Text style={styles.mockCameraText}>Camera Demo Mode</Text>
        <Text style={styles.mockCameraSubtext}>Tap buttons below to simulate food scanning</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.photoButton} onPress={takePicture}>
          <Icon name="camera-alt" size={24} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.barcodeButton} onPress={scanBarcode}>
          <Icon name="qr-code-scanner" size={24} color="#fff" />
          <Text style={styles.buttonText}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={() => setShowSearchModal(true)}>
          <Icon name="search" size={20} color="#666" />
          <Text style={styles.searchButtonText}>Search for food...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Suggested Foods</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggestedFoods.map((food, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionCard}
              onPress={() => selectFood(food)}>
              <Text style={styles.suggestionName}>{food.name}</Text>
              <Text style={styles.suggestionCalories}>{food.calories} cal</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Food Details Modal */}
      <Modal
        visible={showFoodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFoodModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Food Details</Text>
              <TouchableOpacity onPress={() => setShowFoodModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedFood && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.foodName}>{selectedFood.name}</Text>
                <Text style={styles.servingSize}>Serving: {selectedFood.serving}</Text>

                <View style={styles.macrosContainer}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Calories</Text>
                    <Text style={styles.macroValue}>{selectedFood.calories}</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <Text style={styles.macroValue}>{selectedFood.carbs}g</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <Text style={styles.macroValue}>{selectedFood.protein}g</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Fat</Text>
                    <Text style={styles.macroValue}>{selectedFood.fat}g</Text>
                  </View>
                </View>

                <View style={styles.servingInputContainer}>
                  <Text style={styles.servingLabel}>Serving Size:</Text>
                  <TextInput
                    style={styles.servingInput}
                    value={servingSize}
                    onChangeText={setServingSize}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>

                <TouchableOpacity style={styles.addButton} onPress={addFoodToLog}>
                  <Text style={styles.addButtonText}>Add to Daily Log</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Food</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for food..."
                value={searchQuery}
                onChangeText={searchFood}
                autoFocus={true}
              />
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => selectFood(item)}>
                  <View style={styles.searchResultContent}>
                    <Text style={styles.searchResultName}>{item.name}</Text>
                    <Text style={styles.searchResultServing}>{item.serving}</Text>
                    <Text style={styles.searchResultCalories}>
                      {item.calories} cal • {item.protein}g protein
                    </Text>
                  </View>
                  <Icon name="add" size={24} color="#4CAF50" />
                </TouchableOpacity>
              )}
              style={styles.searchResultsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mockCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    margin: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  mockCameraText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  mockCameraSubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  photoButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  barcodeButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  servingSize: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  macrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  servingInputContainer: {
    marginBottom: 20,
  },
  servingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  servingInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchButtonText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  suggestionCalories: {
    fontSize: 12,
    color: '#666',
  },
  searchInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  searchResultsList: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  searchResultServing: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  searchResultCalories: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
});

export default CameraScreen;

