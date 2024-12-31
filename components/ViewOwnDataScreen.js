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
import { auth } from '../config/firebaseConfig';

const ViewOwnDataScreen = ({ navigation }) => {
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
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
        const userResults = Object.values(snapshot.val());
        setResults(userResults);
      } else {
        Alert.alert('Bilgi', 'Sonuç bulunamadı.');
        setResults([]);
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [navigation]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const renderEvaluations = (evaluations) => {
    if (!evaluations || typeof evaluations !== 'object') {
      return <Text style={styles.noResultsText}>Kılavuz sonuçları bulunamadı.</Text>;
    }

    return Object.entries(evaluations).map(([guideKey, guideData]) => {
      const mergedGuideData =
        guideKey === 'guide2'
          ? { ...guideData.primary, ...guideData.secondary }
          : guideData;

      return (
        <View key={guideKey} style={styles.guideContainer}>
          <Text style={styles.guideTitle}>{guideKey}</Text>
          {Object.entries(mergedGuideData).map(([hormone, details]) => (
            <Text key={hormone} style={{ color: details.color, marginVertical: 2 }}>
              {hormone}: {details.status}
            </Text>
          ))}
        </View>
      );
    });
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Normal Sonuçlar:</Text>
        {['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].map((key) => (
          result[key] ? (
            <Text key={key} style={styles.resultText}>
              <Text style={styles.resultLabel}>{key}: </Text>
              {result[key]}
            </Text>
          ) : null
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kılavuz Sonuçları:</Text>
        {renderEvaluations(result.evaluations)}
      </View>
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
              <Text style={styles.noResultsText}>Gösterilecek sonuç bulunamadı.</Text>
            )}
          </View>
          {results.length > 0 && (
            <TouchableOpacity
              style={styles.compareButton}
              onPress={() => navigation.navigate('CompareResultsScreen', { results })}
            >
              <Text style={styles.buttonText}>Sonuçları Geçmişle Kıyasla</Text>
            </TouchableOpacity>
          )}
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
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  compareButton: {
    backgroundColor: '#28A745',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  backButton: { backgroundColor: '#FF5733' },
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
  noResultsText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' },
  guideContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  guideTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
});

export default ViewOwnDataScreen;
