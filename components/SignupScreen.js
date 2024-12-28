import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Şifre tekrar
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Tarih seçici kontrolü
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Şifre uyumu durumu

  const handleSignup = async () => {
    if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(fullName)) {
      Alert.alert('Hata', 'Ad Soyad sadece harflerden oluşmalıdır.');
      return;
    }
    if (!/^\d{11}$/.test(tcNo)) {
      Alert.alert('Hata', 'T.C. Kimlik Numarası 11 haneli olmalıdır ve sadece rakamlardan oluşmalıdır.');
      return;
    }
    if (!birthDate) {
      Alert.alert('Hata', 'Doğum Tarihi seçilmelidir.');
      return;
    }
    if (!passwordsMatch) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor. Lütfen kontrol edin.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), {
        fullName,
        tcNo,
        birthDate,
        email: user.email,
        userType: 'user',
      });

      Alert.alert('Başarılı', 'Üyelik oluşturuldu!');
      navigation.navigate('Login');
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

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordsMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setPasswordsMatch(value === password);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
    setBirthDate(formattedDate);
    hideDatePicker();
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
        placeholder="T.C. Kimlik Numarası"
        keyboardType="numeric"
        value={tcNo}
        onChangeText={setTcNo}
      />
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Text style={styles.datePickerText}>
          {birthDate ? `Doğum Tarihi: ${birthDate}` : 'Doğum Tarihi Seç'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
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
        onChangeText={handlePasswordChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre Tekrar"
        secureTextEntry
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
      />
      {!passwordsMatch && (
        <Text style={styles.errorText}>Şifreler uyuşmuyor!</Text>
      )}
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  datePickerButton: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#555',
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
