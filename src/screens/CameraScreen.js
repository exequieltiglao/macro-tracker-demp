import React, {useState, useRef, useEffect} from 'react';
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
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState('1');
  const [cameraMode, setCameraMode] = useState('photo'); // 'photo' or 'barcode'
  
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const permission = await request(PERMISSIONS.ANDROID.CAMERA);
      if (permission === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        Alert.alert('Permission Required', 'Camera permission is needed to scan food items.');
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
        });
        
        // Simulate food recognition (in a real app, you'd use ML/AI)
        const mockFood = {
          name: 'Apple',
          calories: 95,
          carbs: 25,
          protein: 0.5,
          fat: 0.3,
          serving: '1 medium',
        };
        
        setSelectedFood(mockFood);
        setShowFoodModal(true);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const scanBarcode = () => {
    setIsScanning(true);
    setCameraMode('barcode');
    
    // Simulate barcode scanning (in a real app, you'd use a barcode scanner library)
    setTimeout(() => {
      const mockBarcode = '1234567890123';
      setScannedCode(mockBarcode);
      
      // Mock food data from barcode
      const mockFood = {
        name: 'Protein Bar',
        calories: 200,
        carbs: 20,
        protein: 15,
        fat: 8,
        serving: '1 bar',
      };
      
      setSelectedFood(mockFood);
      setShowFoodModal(true);
      setIsScanning(false);
    }, 2000);
  };

  const addFoodToLog = async () => {
    if (!selectedFood) return;

    try {
      const today = new Date().toDateString();
      const servingMultiplier = parseFloat(servingSize) || 1;
      
      const foodEntry = {
        ...selectedFood,
        calories: selectedFood.calories * servingMultiplier,
        carbs: selectedFood.carbs * servingMultiplier,
        protein: selectedFood.protein * servingMultiplier,
        fat: selectedFood.fat * servingMultiplier,
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

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-alt" size={80} color="#ccc" />
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.overlay}>
        <View style={styles.topControls}>
          <TouchableOpacity
            style={[styles.modeButton, cameraMode === 'photo' && styles.activeModeButton]}
            onPress={() => setCameraMode('photo')}>
            <Icon name="camera-alt" size={24} color={cameraMode === 'photo' ? '#4CAF50' : '#fff'} />
            <Text style={[styles.modeText, cameraMode === 'photo' && styles.activeModeText]}>
              Photo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeButton, cameraMode === 'barcode' && styles.activeModeButton]}
            onPress={() => setCameraMode('barcode')}>
            <Icon name="qr-code-scanner" size={24} color={cameraMode === 'barcode' ? '#4CAF50' : '#fff'} />
            <Text style={[styles.modeText, cameraMode === 'barcode' && styles.activeModeText]}>
              Barcode
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scanArea}>
          {cameraMode === 'barcode' && (
            <View style={styles.barcodeOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanText}>Position barcode within the frame</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomControls}>
          {cameraMode === 'photo' ? (
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.scanButton} onPress={scanBarcode}>
              <Icon name="qr-code-scanner" size={30} color="#fff" />
              <Text style={styles.scanButtonText}>Scan Barcode</Text>
            </TouchableOpacity>
          )}
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  activeModeButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  modeText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  activeModeText: {
    color: '#4CAF50',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeOverlay: {
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
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
});

export default CameraScreen;

