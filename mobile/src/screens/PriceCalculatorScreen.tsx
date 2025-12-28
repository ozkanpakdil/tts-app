import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const PRICING = [
  {
    provider: 'On-Device (Native)',
    pricePerMillion: 0,
    type: 'Free',
    features: 'Offline, unlimited',
  },
  {
    provider: 'Amazon Polly (Standard)',
    pricePerMillion: 4.0,
    type: 'Paid',
    features: 'High quality, many voices',
  },
  {
    provider: 'Google Cloud TTS (Standard)',
    pricePerMillion: 4.0,
    type: 'Paid',
    features: 'WaveNet, Neural voices',
  },
  {
    provider: 'Azure Speech (Neural)',
    pricePerMillion: 4.0,
    type: 'Paid',
    features: 'Advanced neural voices',
  },
];

const PriceCalculatorScreen = () => {
  const [chars, setChars] = useState('1000');

  const calculateCost = (pricePerMillion: number) => {
    const count = parseInt(chars) || 0;
    return ((count / 1000000) * pricePerMillion).toFixed(4);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Price Calculator</Text>
      <Text style={styles.subtitle}>Estimate your costs for cloud TTS services</Text>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Number of Characters</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={chars}
          onChangeText={setChars}
          placeholder="Enter characters count..."
        />
        <Text style={styles.helperText}>Example: A typical page is ~3000 characters.</Text>
      </View>

      <View style={styles.resultsSection}>
        {PRICING.map((item) => (
          <View key={item.provider} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.providerName}>{item.provider}</Text>
              <Text style={[styles.badge, item.type === 'Free' ? styles.freeBadge : styles.paidBadge]}>
                {item.type}
              </Text>
            </View>
            <Text style={styles.features}>{item.features}</Text>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Estimated Cost:</Text>
              <Text style={styles.priceValue}>${calculateCost(item.pricePerMillion)}</Text>
            </View>
            <Text style={styles.rateInfo}>Rate: ${item.pricePerMillion.toFixed(2)} per 1M characters</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  resultsSection: {
    gap: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  freeBadge: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  paidBadge: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  features: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    color: '#444',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  rateInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default PriceCalculatorScreen;
