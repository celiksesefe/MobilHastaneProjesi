import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Üye Ol</Text>
      <TextInput style={styles.input} placeholder="Ad Soyad" />
      <TextInput style={styles.input} placeholder="E-posta" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry />

      <TouchableOpacity
        style={styles.touchableButton}
        onPress={() => alert('Üyelik başarılı!')}
      >
        <Text style={styles.touchableButtonText}>Üye Ol</Text>
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
});

export default SignupScreen;
