import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';

const AdminHomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase Web SDK'ya uygun çıkış işlemi
      Alert.alert('Başarılı', 'Çıkış yapıldı!');
      navigation.replace('Welcome'); // Çıkış sonrası giriş ekranına yönlendirme
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş Geldin, Doktor!</Text>
      <TouchableOpacity style={[styles.button, styles.addPatientButton]}>
        <Text style={styles.buttonText}>Hasta Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.seePatientButton]}>
        <Text style={styles.buttonText}>Hasta Takibi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
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
  addPatientButton: {
    backgroundColor: '#4CAF50',
  },
  seePatientButton: {
    backgroundColor: '#007BFF',
  },
  logoutButton: {
    backgroundColor: '#FF5733',
  },
});

export default AdminHomeScreen;
