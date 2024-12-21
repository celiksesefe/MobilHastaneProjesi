import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput style={styles.input} placeholder="E-posta" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry />

      <TouchableOpacity
        style={[styles.touchableButton,{backgroundColor:'#2196F3'}]}
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

      <Text style={styles.infoText}>Üyeliğiniz yok ise:</Text>
      <Button
        title="Üye Olun"
        onPress={() => navigation.navigate('Signup')}
        color="#841584"
      />
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
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  touchableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default LoginScreen;
