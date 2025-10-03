import React, { useContext } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar, ActivityIndicator, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import { AuthProvider, AuthContext } from './context/AuthContext';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Camera') {
              iconName = 'camera-alt';
            } else if (route.name === 'History') {
              iconName = 'history';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const Root = () => {
  const { user, initializing } = useContext(AuthContext);
  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  return user ? <Tabs /> : <LoginScreen />;
};

const App = () => {
  return (
    <AuthProvider googleWebClientId={"YOUR_WEB_CLIENT_ID_HERE"}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Root />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

