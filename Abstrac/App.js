import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  const { user } = React.useContext(require('./src/context/AuthContext').AuthContext);

  return <RootNavigator user={user} />;
}

export default function App() {
  useEffect(() => {
    // Ensure splash screen is hidden as soon as the app component mounts
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
