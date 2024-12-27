import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState(''); // Ad Soyad
  const [email, setEmail] = useState(''); // E-posta
  const [password, setPassword] = useState(''); // Şifre

  const handleSignup = async () => {
    try {
      // Firebase Authentication ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcı bilgilerini Firebase Realtime Database'e kaydet
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), {
        fullName: fullName,
        email: user.email,
        userType: 'user', // Varsayılan olarak "user"
      });

      Alert.alert('Başarılı', 'Üyelik oluşturuldu!');
      navigation.navigate('Login'); // Kayıttan sonra giriş ekranına yönlendir
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz bir e-posta adresi girdiniz.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin.';
          break;
        default:
          errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Üye Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.touchableButton} onPress={handleSignup}>
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
