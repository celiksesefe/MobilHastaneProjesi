import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput style={styles.input} placeholder="E-posta" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry />

      <TouchableOpacity
        style={[styles.touchableButton, {backgroundColor:"#2196F3"}]}
        onPress={() => alert('Giriş yapıldı!')}
      >
        <Text style={styles.touchableButtonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.touchableButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.touchableButtonText}>Geri Dön</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => Alert.alert('Şifremi Unuttum', 'Şifrenizi sıfırlamak için destek ekibiyle iletişime geçin.')}
      >
        <Text style={styles.forgotButtonText}>Şifremi Unuttum</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Üyeliğiniz yok ise:</Text>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.signupButtonText}>Üye Ol</Text>
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
  forgotButton: {
    marginTop: 10,
  },
  forgotButtonText: {
    color: '#841584',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  infoText: {
    marginTop: 18,
    fontSize: 14,
    color: '#555',
  },
  signupButton: {
    marginTop: 8,
    backgroundColor: '#841584',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    width: '70%',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
