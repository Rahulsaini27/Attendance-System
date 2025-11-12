// src/screens/Teacher/ManageStudentsScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';

const ManageStudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await apiClient.get('/teacher/students');
      setStudents(response.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch the list of students.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { setLoading(true); fetchStudents(); }, [fetchStudents]));

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleRemove = () => {
      Alert.alert("Action Disabled", "This feature is currently disabled.");
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Icon name="person-circle" size={40} color="#3B5998" />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
          <Icon name="trash-bin-outline" size={24} color="#dc3545"/>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <FlatList
      data={students}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.header}>All Students</Text>}
      ListEmptyComponent={<Text style={styles.emptyText}>No students have been added yet.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#F4F7FC' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  item: {
    backgroundColor: 'white', padding: 15, marginVertical: 8,
    borderRadius: 12, flexDirection: 'row', alignItems: 'center',
    elevation: 2, borderWidth: 1, borderColor: '#E8E8E8'
  },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666' },
  removeButton: {
      padding: 10,
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' }
});

export default ManageStudentsScreen;