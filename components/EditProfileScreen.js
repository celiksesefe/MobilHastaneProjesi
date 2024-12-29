import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { getDatabase, ref, get, update } from 'firebase/database';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    // Kullanıcı bilgilerini Firebase'den çek
    const fetchProfile = async () => {
      try {
        const db = getDatabase();
        const user = auth.currentUser;
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setFullName(userData.fullName || '');
          setTcNo(userData.tcNo || '');
          setBirthDate(userData.birthDate || '');
        } else {
          Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı.');
        }
      } catch (error) {
        Alert.alert('Hata', 'Bilgiler alınamadı.');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
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

    try {
      const db = getDatabase();
      const user = auth.currentUser;

      // Firebase Realtime Database'de bilgileri güncelle
      await update(ref(db, `users/${user.uid}`), {
        fullName,
        tcNo,
        birthDate,
      });

      Alert.alert('Başarılı', 'Bilgileriniz güncellendi!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Bilgiler güncellenemedi.');
    }
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
      <Text style={styles.title}>Profilinizi Düzenleyin</Text>
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>İptal</Text>
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
    backgroundColor: '#f5f5f5',
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
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  cancelButton: {
    backgroundColor: '#FF5733',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
