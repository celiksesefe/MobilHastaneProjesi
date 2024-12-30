import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userType = snapshot.val().userType;

        if (userType === 'admin') {
          navigation.replace('AdminHome');
        } else {
          navigation.replace('UserHome');
        }
      } else {
        Alert.alert('Hata', 'Kullanıcı bilgisi veritabanında bulunamadı.');
      }
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz bir e-posta adresi girdiniz.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Kullanıcı bulunamadı.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Hatalı şifre girdiniz.';
          break;
        default:
          errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Giriş Yap</Text>
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
        <TouchableOpacity style={[styles.touchableButton, { backgroundColor: '#2196F3' }]} onPress={handleLogin}>
          <Text style={styles.touchableButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.touchableButtonText}>Geri Dön</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate('ForgotPassword')}
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
    </TouchableWithoutFeedback>
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
