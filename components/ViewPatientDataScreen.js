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
import { getDatabase, ref, get } from 'firebase/database';

const ViewPatientDataScreen = ({ navigation }) => {
  const [tcNo, setTcNo] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      const users = snapshot.val();

      const userKey = Object.keys(users).find(
        (key) => users[key].tcNo === tcNo
      );

      if (!userKey) {
        Alert.alert('Hata', 'Hasta bulunamadı.');
        return;
      }

      const resultsRef = ref(db, `users/${userKey}/results`);
      const resultsSnapshot = await get(resultsRef);

      if (resultsSnapshot.exists()) {
        setResults(Object.values(resultsSnapshot.val()));
      } else {
        Alert.alert('Bilgi', 'Bu hastanın sonucu bulunmamaktadır.');
        setResults([]);
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const renderResult = (result, index) => (
    <View style={styles.resultItem} key={index}>
      <Text style={styles.resultText}>
        <Text style={styles.resultLabel}>Tarih: </Text>
        {result.date ? formatDate(result.date) : '--'}
      </Text>
      <Text style={styles.resultText}>
        <Text style={styles.resultLabel}>Yaş (Ay): </Text>
        {result.ageInMonths || '--'}
      </Text>
      {['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].map((key) => (
        <Text key={key} style={styles.resultText}>
          <Text style={styles.resultLabel}>{key}: </Text>
          {result[key] || '--'}
        </Text>
      ))}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Hasta Takibi</Text>
          <TextInput
            style={styles.input}
            placeholder="T.C. Kimlik Numarası"
            keyboardType="numeric"
            value={tcNo}
            onChangeText={setTcNo}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Sonuçları Getir</Text>
          </TouchableOpacity>
          <View style={styles.resultsContainer}>
            {results.length > 0 ? (
              results.map((result, index) => renderResult(result, index))
            ) : (
              <Text style={styles.noResultsText}>
                Gösterilecek sonuç bulunamadı.
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
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
  resultsContainer: { marginTop: 20, paddingBottom: 20 },
  resultItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  resultText: { fontSize: 14, marginVertical: 2 },
  resultLabel: { fontWeight: 'bold' },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default ViewPatientDataScreen;
