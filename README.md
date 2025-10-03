# Macro Tracker Demo

A hybrid mobile application for tracking macro intakes (calories, carbs, proteins, fats) with camera and barcode scanning capabilities.

## Features

- 📸 **Camera Integration**: Take photos of food items for macro tracking
- 📱 **Barcode Scanning**: Scan product barcodes to automatically get nutritional information
- 📊 **Macro Tracking**: Track daily intake of calories, carbohydrates, proteins, and fats
- 📈 **Visual Analytics**: View weekly calorie intake charts and progress
- 📝 **Food History**: Keep track of all logged food entries with timestamps
- ⚙️ **Profile Management**: Set personal goals and customize macro targets
- 🔔 **Notifications**: Get reminders and achievement notifications
- 💾 **Local Storage**: All data stored locally on device

## Screenshots

The app includes four main screens:
- **Home**: Daily macro overview with progress bars and weekly charts
- **Camera**: Photo capture and barcode scanning interface
- **History**: Past food entries organized by date
- **Profile**: User settings, goals, and preferences

## Installation

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd macro-tracker-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Android Setup**
   - Open Android Studio
   - Create a new project or open existing
   - Ensure Android SDK is properly configured

### Running the App

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

**Start Metro bundler:**
```bash
npm start
```

## Permissions

The app requires the following permissions:

### Android
- `CAMERA`: For taking photos and scanning barcodes
- `WRITE_EXTERNAL_STORAGE`: For saving photos (if needed)

### iOS
- `NSCameraUsageDescription`: For camera access
- `NSPhotoLibraryUsageDescription`: For photo library access

## Dependencies

### Core Dependencies
- `react-native-vision-camera`: Modern camera library
- `react-native-permissions`: Permission management
- `@react-native-async-storage/async-storage`: Local data storage
- `react-native-vector-icons`: Icon library
- `react-native-linear-gradient`: Gradient backgrounds
- `react-native-chart-kit`: Charts and graphs
- `@react-navigation/native`: Navigation system

### Development Dependencies
- `@babel/core`: JavaScript transpilation
- `eslint`: Code linting
- `jest`: Testing framework
- `typescript`: TypeScript support

## Project Structure

```
src/
├── App.js                 # Main app component with navigation
├── screens/
│   ├── HomeScreen.js      # Dashboard with macro overview
│   ├── CameraScreen.js    # Camera and barcode scanning
│   ├── HistoryScreen.js   # Food entry history
│   └── ProfileScreen.js   # User profile and settings
```

## Key Features Implementation

### Camera Integration
- Uses `react-native-vision-camera` for high-performance camera access
- Supports both photo capture and barcode scanning modes
- Automatic permission handling

### Barcode Scanning
- Simulated barcode scanning (can be replaced with real barcode scanner)
- Product lookup with nutritional information
- Automatic macro calculation

### Macro Tracking
- Real-time macro calculation and storage
- Daily goal tracking with progress visualization
- Weekly analytics with charts

### Data Persistence
- All data stored locally using AsyncStorage
- Food history with timestamps
- User profile and goal settings
- Daily macro totals

## Customization

### Adding Real Barcode Scanning
Replace the simulated barcode scanning in `CameraScreen.js` with a real barcode scanner library like `react-native-barcode-scanner`.

### Food Recognition API
Integrate with food recognition APIs like:
- Google Vision API
- Clarifai Food API
- Microsoft Computer Vision API

### Nutritional Database
Connect to nutritional databases like:
- USDA Food Database
- Edamam Nutrition API
- Spoonacular API

## Future Enhancements

- [ ] Real barcode scanning integration
- [ ] AI-powered food recognition
- [ ] Social features and sharing
- [ ] Meal planning and recipes
- [ ] Water intake tracking
- [ ] Exercise integration
- [ ] Cloud sync and backup
- [ ] Offline mode improvements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

