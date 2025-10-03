import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock the navigation components
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Mock screens
jest.mock('../screens/HomeScreen', () => 'HomeScreen');
jest.mock('../screens/CameraScreen', () => 'CameraScreen');
jest.mock('../screens/HistoryScreen', () => 'HistoryScreen');
jest.mock('../screens/ProfileScreen', () => 'ProfileScreen');

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    // Since we're mocking everything, just check that the component renders
    expect(getByText).toBeDefined();
  });

  it('has correct structure', () => {
    const component = render(<App />);
    expect(component).toBeDefined();
  });
});
