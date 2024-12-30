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
  ScrollView,
} from 'react-native';
import { getDatabase, ref, push, get } from 'firebase/database';

const AddPatientDataScreen = ({ navigation }) => {
  const [tcNo, setTcNo] = useState('');
  const [ageInMonths, setAgeInMonths] = useState('');
  const [results, setResults] = useState({
    IgA: '',
    IgM: '',
    IgG: '',
    IgG1: '',
    IgG2: '',
    IgG3: '',
    IgG4: '',
  });

  const handleAddData = async () => {
    if (!/^\d{11}$/.test(tcNo)) {
      Alert.alert('Hata', 'T.C. Kimlik Numarası 11 haneli olmalıdır ve sadece rakamlardan oluşmalıdır.');
      return;
    }
    if (!/^\d+$/.test(ageInMonths)) {
      Alert.alert('Hata', 'Yaş (Ay) sadece pozitif tam sayı olmalıdır.');
      return;
    }

    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        Alert.alert('Hata', 'Veritabanında kullanıcı bulunamadı.');
        return;
      }

      const users = snapshot.val();
      const userKey = Object.keys(users).find((key) => users[key].tcNo === tcNo);

      if (!userKey) {
        Alert.alert('Hata', 'Hasta bulunamadı. Lütfen T.C. Kimlik Numarasını kontrol edin.');
        return;
      }

      const resultsRef = ref(db, `users/${userKey}/results`);
      const formattedResults = Object.fromEntries(
        Object.entries(results).map(([key, value]) => [
          key,
          value ? parseFloat(value.replace(',', '.')) : null, // ',' varsa '.' yaparak sayıya dönüştür
        ])
      );

      await push(resultsRef, {
        date: new Date().toISOString(),
        ageInMonths: parseInt(ageInMonths, 10),
        ...formattedResults,
      });

      Alert.alert('Başarılı', 'Sonuçlar başarıyla kaydedildi!');
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED') {
        Alert.alert('Hata', 'Bu işlemi gerçekleştirme yetkiniz yok.');
      } else {
        Alert.alert('Hata', error.message);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Hasta Veri Ekle</Text>
        <TextInput
          style={styles.input}
          placeholder="T.C. Kimlik Numarası"
          keyboardType="numeric"
          value={tcNo}
          onChangeText={setTcNo}
        />
        <TextInput
          style={styles.input}
          placeholder="Yaş (Ay)"
          keyboardType="numeric"
          value={ageInMonths}
          onChangeText={setAgeInMonths}
        />
        {Object.keys(results).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={`${key} değeri (ondalık)`}
            keyboardType="decimal-pad"
            value={results[key]}
            onChangeText={(value) =>
              setResults((prev) => ({ ...prev, [key]: value }))
            }
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={handleAddData}>
          <Text style={styles.buttonText}>Sonuçları Kaydet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Geri Dön</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  backButton: {
    backgroundColor: '#FF5733',
  },
});

export default AddPatientDataScreen;
