import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AdminHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş Geldin, Doktor!</Text>
      
      <TouchableOpacity style={[styles.button, styles.addPatientButton]}>
        <Text style={styles.buttonText}>Hasta Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.seePatientButton]}>
        <Text style={styles.buttonText}>Hasta Takibi</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
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
    backgroundColor: '#f0f4f7', // Arka plan rengini açık gri yaptık
  },
  welcomeText: {
    fontSize: 26,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333', // Hoş geldiniz mesajı koyu gri
    textAlign: 'center',
  },
  button: {
    width: '85%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#000', // Butonlar için gölge efekti
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Android için gölge
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPatientButton: {
    backgroundColor: '#4CAF50', // Sonuçları Gör butonu yeşil
  },
  seePatientButton: {
    backgroundColor: '#007BFF', // Profili Yönet butonu mavi
  },
  logoutButton: {
    backgroundColor: '#FF5733', // Çıkış Yap butonu kırmızı
  },
});

export default AdminHomeScreen;
