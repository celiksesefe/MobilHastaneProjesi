import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';

const UserHomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Başarılı', 'Çıkış yapıldı!');
      navigation.replace('Welcome'); // Kullanıcıyı giriş ekranına yönlendir
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş Geldiniz, Kullanıcı!</Text>
      <TouchableOpacity
        style={[styles.button, styles.resultsButton]}
        onPress={() => navigation.navigate('ViewOwnResults')} // Kullanıcının kendi sonuçlarını görme ekranına yönlendirme
      >
        <Text style={styles.buttonText}>Sonuçları Gör</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.profileButton]}
        onPress={() => navigation.navigate('EditProfile')} // Kullanıcının profilini düzenleme ekranına yönlendirme
      >
        <Text style={styles.buttonText}>Profili Yönet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  welcomeText: {
    fontSize: 26,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  button: {
    width: '85%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsButton: {
    backgroundColor: '#4CAF50',
  },
  profileButton: {
    backgroundColor: '#007BFF',
  },
  logoutButton: {
    backgroundColor: '#FF5733',
  },
});

export default UserHomeScreen;
