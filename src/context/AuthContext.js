import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  configureGoogleSignin,
  getStoredUser,
  signInWithApple,
  signInWithGoogle,
  signOut,
} from '../services/AuthService';

export const AuthContext = createContext({
  user: null,
  initializing: true,
  signInGoogle: async () => {},
  signInApple: async () => {},
  signOut: async () => {},
  configure: _cfg => {},
});

export const AuthProvider = ({children, googleWebClientId}) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (googleWebClientId) {
      configureGoogleSignin(googleWebClientId);
    }
    (async () => {
      const stored = await getStoredUser();
      if (stored) setUser(stored);
      setInitializing(false);
    })();
  }, [googleWebClientId]);

  const signInGoogleHandler = useCallback(async () => {
    const u = await signInWithGoogle();
    setUser(u);
  }, []);

  const signInAppleHandler = useCallback(async () => {
    const u = await signInWithApple();
    setUser(u);
  }, []);

  const signOutHandler = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      signInGoogle: signInGoogleHandler,
      signInApple: signInAppleHandler,
      signOut: signOutHandler,
    }),
    [
      user,
      initializing,
      signInGoogleHandler,
      signInAppleHandler,
      signOutHandler,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
