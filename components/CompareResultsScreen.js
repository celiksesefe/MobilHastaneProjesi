import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const CompareResultsScreen = ({ route }) => {
  const { results } = route.params;

  // Sonuçları tarihe göre sırala
  const sortedResults = results.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Tarih formatlama fonksiyonu
  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const renderComparisonTable = () => {
    return ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].map((key) => {
      const values = sortedResults.map((result) => result[key]).filter(Boolean);
      if (values.length < 2) return null;

      const differences = values.map((value, index) =>
        index > 0 ? (value - values[index - 1]).toFixed(2) : null
      );

      return (
        <View key={key} style={styles.tableContainer}>
          <Text style={styles.tableTitle}>{key}</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Tarih</Text>
            <Text style={styles.tableCell}>Değer</Text>
            <Text style={styles.tableCell}>Fark</Text>
          </View>
          {values.map((value, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {formatDateTime(sortedResults[index].date)}
              </Text>
              <Text style={styles.tableCell}>{value.toFixed(2)}</Text>
              <Text style={styles.tableCell}>
                {differences[index] !== null ? differences[index] : '--'}
              </Text>
            </View>
          ))}
        </View>
      );
    });
  };

  const renderComparisonGraph = () => {
    return ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].map((key) => {
      const values = sortedResults.map((result) => result[key]).filter(Boolean);
      if (values.length < 2) return null;

      return (
        <View key={key} style={styles.graphContainer}>
          <Text style={styles.graphTitle}>{key}</Text>
          <LineChart
            data={{
              labels: sortedResults.map((result) => formatDateTime(result.date)),
              datasets: [{ data: values }],
            }}
            width={300} // Genişlik
            height={220} // Yükseklik
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            style={styles.chartStyle}
          />
        </View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sonuç Kıyaslama</Text>
      <Text style={styles.sectionTitle}>Tablo</Text>
      {renderComparisonTable()}
      <Text style={styles.sectionTitle}>Grafikler</Text>
      {renderComparisonGraph()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  tableContainer: { marginBottom: 20 },
  tableTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: { flex: 1, textAlign: 'center' },
  graphContainer: { marginVertical: 20 },
  graphTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
});

export default CompareResultsScreen;
