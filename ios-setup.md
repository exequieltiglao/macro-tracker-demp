# Macro Tracker Demo - iOS Configuration

## iOS Permissions

Add the following to `ios/MacroTracker/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos of food and scan barcodes</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to save food photos</string>
```

## iOS Podfile Configuration

Ensure your `ios/Podfile` includes:

```ruby
platform :ios, '11.0'
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

target 'MacroTracker' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    :flipper_configuration => FlipperConfiguration.enabled,
    :app_clip_configurations => app_clip_configurations
  )

  target 'MacroTrackerTests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(installer)
  end
end
```

## Vector Icons Setup

For iOS, add to `ios/MacroTracker/Info.plist`:

```xml
<key>UIAppFonts</key>
<array>
  <string>AntDesign.ttf</string>
  <string>Entypo.ttf</string>
  <string>EvilIcons.ttf</string>
  <string>Feather.ttf</string>
  <string>FontAwesome.ttf</string>
  <string>Foundation.ttf</string>
  <string>Ionicons.ttf</string>
  <string>MaterialIcons.ttf</string>
  <string>MaterialCommunityIcons.ttf</string>
  <string>SimpleLineIcons.ttf</string>
  <string>Octicons.ttf</string>
  <string>Zocial.ttf</string>
</array>
```

## Camera Configuration

The app uses `react-native-vision-camera` which requires:

1. Camera permission (already included above)
2. Proper camera configuration in the app
3. iOS 11.0+ deployment target

## Running on iOS

1. Install pods: `cd ios && pod install && cd ..`
2. Open Xcode: `open ios/MacroTracker.xcworkspace`
3. Select device/simulator and run
4. Or use CLI: `npm run ios`

## Troubleshooting

### Pod Installation Issues

- Update CocoaPods: `sudo gem install cocoapods`
- Clean pods: `cd ios && rm -rf Pods Podfile.lock && pod install`
- Reset Metro: `npx react-native start --reset-cache`

### Camera Permission Issues

- Ensure Info.plist has proper permission descriptions
- Check that permissions are requested at runtime
- Verify simulator/device has camera access

### Build Issues

- Clean build folder in Xcode: Product → Clean Build Folder
- Reset Metro: `npx react-native start --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`
