# Macro Tracker Demo - Android Configuration

## Android Permissions

Add the following permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Android Gradle Configuration

Ensure your `android/app/build.gradle` includes:

```gradle
android {
    compileSdkVersion 33
    buildToolsVersion "33.0.0"
    
    defaultConfig {
        applicationId "com.macrotracker"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.8.0'
}
```

## Vector Icons Setup

For Android, add to `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## Camera Configuration

The app uses `react-native-vision-camera` which requires:

1. Camera permission (already included above)
2. Proper camera configuration in the app

## Running on Android

1. Connect Android device or start emulator
2. Run: `npm run android`
3. Grant camera permission when prompted

## Troubleshooting

### Camera Permission Issues
- Ensure permissions are properly declared in AndroidManifest.xml
- Check that the app requests permissions at runtime
- Verify device has camera hardware

### Build Issues
- Clean build: `cd android && ./gradlew clean && cd ..`
- Reset Metro: `npx react-native start --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

