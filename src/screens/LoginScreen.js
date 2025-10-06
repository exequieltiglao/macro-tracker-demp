import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../context/AuthContext';

const LoginScreen = () => {
  const {signInGoogle, signInApple} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.header}>
        <Icon name="restaurant" size={64} color="#ffffff" />
        <Text style={styles.title}>Macro Tracker</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity style={styles.googleButton} onPress={signInGoogle}>
          <Image
            source={{
              uri: 'https://developers.google.com/identity/images/g-logo.png',
            }}
            style={styles.googleLogo}
          />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.appleButton} onPress={signInApple}>
            <Icon name="apple" size={22} color="#fff" />
            <Text style={styles.appleText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 120,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    color: '#eaf7ea',
    fontSize: 14,
    marginTop: 6,
  },
  content: {
    padding: 24,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    marginTop: 12,
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default LoginScreen;
