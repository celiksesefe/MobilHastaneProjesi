import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../config/firebaseConfig'; // Firebase Authentication

const ViewOwnDataScreen = ({ navigation }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('Hata', 'Kullanıcı oturum açmamış.');
          navigation.replace('Welcome');
          return;
        }

        const db = getDatabase();
        const resultsRef = ref(db, `users/${userId}/results`);
        const snapshot = await get(resultsRef);

        if (snapshot.exists()) {
          setResults(Object.values(snapshot.val()));
        } else {
          Alert.alert('Bilgi', 'Sonuç bulunamadı.');
          setResults([]);
        }
      } catch (error) {
        Alert.alert('Hata', error.message);
      }
    };

    fetchData();
  }, [navigation]);

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
          <Text style={styles.title}>Sonuçlarınız</Text>
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

export default ViewOwnDataScreen;
