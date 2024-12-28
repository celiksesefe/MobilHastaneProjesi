import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Şifre Sıfırlama',
        'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
      );
      navigation.navigate('Login'); // Şifre sıfırlama sonrası giriş ekranına yönlendir
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz bir e-posta adresi girdiniz.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Bu e-posta adresine ait bir kullanıcı bulunamadı.';
          break;
        default:
          errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifremi Unuttum</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.touchableButton} onPress={handlePasswordReset}>
        <Text style={styles.touchableButtonText}>Şifre Sıfırla</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.touchableButtonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  touchableButton: {
    backgroundColor: '#841584',
    padding: 12,
    marginVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    width: '70%',
  },
  touchableButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
