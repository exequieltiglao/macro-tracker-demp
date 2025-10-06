module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Temporarily disable React Native Reanimated for CI builds
    // 'react-native-reanimated/plugin',
  ],
};
