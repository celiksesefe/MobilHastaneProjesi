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

  const fetchGuideAndValidate = async (ageInMonths, results) => {
    const db = getDatabase();
    const guidesRef = ref(db, 'guides');
    const guidesSnapshot = await get(guidesRef);
  
    if (!guidesSnapshot.exists()) {
      throw new Error('Kılavuz verisi bulunamadı.');
    }
  
    const guides = guidesSnapshot.val();
    const evaluations = {};
  
    for (const [guideName, guideData] of Object.entries(guides)) {
      evaluations[guideName] = {};
  
      if (guideName === 'guide2') {
        // Primary hormonlar için yaş aralığını bul ve değerlendir
        const primaryRange = Object.keys(guideData).find((range) => {
          const [min, max] = range.split('-').map(Number);
          return ageInMonths >= min && (max === undefined || ageInMonths <= max);
        });
  
        if (primaryRange) {
          evaluations[guideName].primary = evaluateRange(
            guideData[primaryRange],
            results,
            ['IgA', 'IgG', 'IgM']
          );
        } else {
          evaluations[guideName].primary = 'Primary yaş aralığı bulunamadı';
        }
  
        // Secondary hormonlar için yaş aralığını bul ve değerlendir
        const secondaryRange = Object.keys(guideData).find((range) => {
          const [min, max] = range.split('-').map(Number);
          return ageInMonths >= min && (max === undefined || ageInMonths <= max);
        });
  
        if (secondaryRange) {
          evaluations[guideName].secondary = evaluateRange(
            guideData[secondaryRange],
            results,
            ['IgG1', 'IgG2', 'IgG3', 'IgG4']
          );
        } else {
          evaluations[guideName].secondary = 'Secondary yaş aralığı bulunamadı';
        }
      } else {
        // Diğer kılavuzlar için genel yaş aralığını bul ve değerlendir
        const range = Object.keys(guideData).find((range) => {
          const [min, max] = range.split('-').map(Number);
          return ageInMonths >= min && (max === undefined || ageInMonths <= max);
        });
  
        if (range) {
          const hormones =
            guideName === 'guide5'
              ? ['IgA', 'IgG', 'IgM']
              : ['IgA', 'IgG', 'IgM', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];
          evaluations[guideName] = evaluateRange(guideData[range], results, hormones);
        } else {
          evaluations[guideName] = 'Yaş aralığı bulunamadı';
        }
      }
    }
  
    return evaluations;
  };
  

  const evaluateRange = (guideRange, results, hormones) => {
    return hormones.reduce((acc, hormone) => {
      if (results[hormone]) {
        const value = parseFloat(results[hormone]?.replace(',', '.'));
        const [min, max] = guideRange[hormone] || [null, null];

        if (min === null || max === null) {
          acc[hormone] = {
            value: 'Eksik',
            status: 'Kılavuzda bu değer yok',
            color: 'gray',
          };
        } else {
          acc[hormone] = {
            value,
            status:
              value < min
                ? `↓ ${value} (${min} - ${max})`
                : value > max
                ? `↑ ${value} (${min} - ${max})`
                : `↔ ${value} (${min} - ${max})`,
            color: value < min ? 'green' : value > max ? 'red' : 'blue',
          };
        }
      } else {
        acc[hormone] = {
          value: 'Yok',
          status: 'Değer bulunamadı',
          color: 'gray',
        };
      }
      return acc;
    }, {});
  };

  const handleAddData = async () => {
    if (!/^\d{11}$/.test(tcNo.trim())) {
      Alert.alert(
        'Hata',
        'T.C. Kimlik Numarası 11 haneli olmalı ve sadece rakamlardan oluşmalıdır.'
      );
      return;
    }

    if (!/^\d+$/.test(ageInMonths.trim())) {
      Alert.alert(
        'Hata',
        'Yaş (Ay) sadece pozitif tam sayı olmalıdır. Lütfen doğru bir değer giriniz.'
      );
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
        Alert.alert(
          'Hata',
          'Hasta bulunamadı. Lütfen T.C. Kimlik Numarasını doğru girdiğinizden emin olun.'
        );
        return;
      }

      const evaluations = await fetchGuideAndValidate(
        parseInt(ageInMonths.trim(), 10),
        results
      );

      const resultsRef = ref(db, `users/${userKey}/results`);

      const formattedResults = Object.fromEntries(
        Object.entries(results).map(([key, value]) => [
          key,
          value ? parseFloat(value.replace(',', '.')) : null,
        ])
      );

      await push(resultsRef, {
        date: new Date().toISOString(),
        ageInMonths: parseInt(ageInMonths.trim(), 10),
        ...formattedResults,
        evaluations,
      });

      Alert.alert('Başarılı', 'Sonuçlar başarıyla kaydedildi!');
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED') {
        Alert.alert('Hata', 'Bu işlemi gerçekleştirme yetkiniz yok.');
      } else {
        Alert.alert('Hata', `Beklenmedik bir hata oluştu: ${error.message}`);
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
