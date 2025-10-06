import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';

const AUTH_STORAGE_KEY = 'auth_user';

export const configureGoogleSignin = webClientId => {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: false,
  });
};

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  const userInfo = await GoogleSignin.signIn();
  const user = {
    provider: 'google',
    id: userInfo.user.id,
    name: userInfo.user.name,
    email: userInfo.user.email,
    photo: userInfo.user.photo,
    idToken: userInfo.idToken,
  };
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const signInWithApple = async () => {
  const response = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  const user = {
    provider: 'apple',
    id: response.user,
    name: response.fullName?.givenName
      ? `${response.fullName?.givenName || ''} ${
          response.fullName?.familyName || ''
        }`.trim()
      : undefined,
    email: response.email,
    identityToken: response.identityToken,
    authorizationCode: response.authorizationCode,
  };
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const signOut = async () => {
  try {
    const stored = await getStoredUser();
    if (stored?.provider === 'google') {
      try {
        await GoogleSignin.signOut();
      } catch (e) {}
    }
  } finally {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
