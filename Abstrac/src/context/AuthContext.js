import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Only proceed if Firebase is initialized
    if (!auth || !db) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get their data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocUnsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setUser({
                id: firebaseUser.uid,
                username: data.displayName,
                email: firebaseUser.email,
                stones: data.stonesBalance || 0,
                xp: data.xp || 0,
                level: data.level || 1,
                badges: data.badges || [],
                currentStreak: data.currentStreak || 0,
                totalDaresCompleted: data.totalDaresCompleted || 0,
              });
              setUserData(data);
            } else {
              // User document doesn't exist, create basic user object
              setUser({
                id: firebaseUser.uid,
                username: `@user_${firebaseUser.uid.slice(0, 6)}`,
                email: firebaseUser.email,
                stones: 0,
                xp: 0,
                level: 1,
                badges: [],
                currentStreak: 0,
                totalDaresCompleted: 0,
              });
            }
          });

          return userDocUnsubscribe;
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user data
          setUser({
            id: firebaseUser.uid,
            username: `@user_${firebaseUser.uid.slice(0, 6)}`,
            email: firebaseUser.email,
            stones: 0,
            xp: 0,
            level: 1,
            badges: [],
            currentStreak: 0,
            totalDaresCompleted: 0,
          });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setTyping = (challengeId, isTyping) => {
    console.log(`User ${user?.id} ${isTyping ? 'started' : 'stopped'} typing in ${challengeId}`);
  };

  return (
    <AuthContext.Provider value={{ user, userData, setUser, setTyping, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
