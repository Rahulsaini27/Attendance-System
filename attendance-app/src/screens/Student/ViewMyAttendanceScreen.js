// src/screens/Student/ViewMyAttendanceScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';

const ViewMyAttendanceScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await apiClient.get('/attendance/me');
      setRecords(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAttendance().then(() => setRefreshing(false));
  }, [fetchAttendance]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.dateText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={[styles.statusText, { color: item.status === 'present' ? 'green' : 'red' }]}>
        {item.status.toUpperCase()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={records}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.emptyText}>No attendance records found.</Text>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#F0F4F7' },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateText: { fontSize: 16 },
  statusText: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 }
});

export default ViewMyAttendanceScreen;