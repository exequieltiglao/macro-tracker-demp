const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration for CI builds
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {
  resolver: {
    // Disable symlinks to avoid CI issues
    symlinks: false,
  },
  transformer: {
    // Disable minification for faster builds
    minifierConfig: {
      mangle: false,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
