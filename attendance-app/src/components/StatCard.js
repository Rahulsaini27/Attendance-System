// src/components/StatCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ value, label }) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#3B5998',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  label: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 4,
  },
});

export default StatCard;