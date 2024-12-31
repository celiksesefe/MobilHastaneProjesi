import React, { useState, useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { auth } from './config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kullanıcının oturum durumunu izler
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Oturum bilgisi state'e kaydedilir
    });

    return unsubscribe; // Dinleyiciyi temizle
  }, []);

  return <AppNavigator user={user} />;
}