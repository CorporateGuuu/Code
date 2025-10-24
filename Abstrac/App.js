import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { useContext } from 'react';
import { AuthContext } from './src/context/AuthContext';

function AppContent() {
  const { user } = useContext(AuthContext);
  return <RootNavigator user={user} />;
}

export default function App() {
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
