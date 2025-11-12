// src/components/ProgressBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ percentage, color }) => (
  <View style={styles.background}>
    <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  background: {
    height: 8,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProgressBar;