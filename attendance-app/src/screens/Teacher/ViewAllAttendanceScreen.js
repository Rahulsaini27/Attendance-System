// src/screens/Teacher/ViewAllAttendanceScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';

const ViewAllAttendanceScreen = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailedAttendance, setDetailedAttendance] = useState({});

  const fetchSummary = useCallback(async () => {
    try {
      const response = await apiClient.get('/teacher/attendance-summary');
      setSummaryData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch attendance summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { setLoading(true); fetchSummary(); }, [fetchSummary]));
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSummary().then(() => setRefreshing(false));
  }, [fetchSummary]);

  const handleCardPress = async (subject) => {
    setSelectedSubject(subject);
    setModalVisible(true);
    setDetailLoading(true);
    try {
      const response = await apiClient.get(`/teacher/attendance/${subject.subjectId}`);
      setDetailedAttendance(response.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch attendance details.');
      setModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <Text style={styles.subjectName}>{item.subjectName}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Total Classes Held:</Text>
        <Text style={styles.value}>{item.totalClasses}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Attendance Marks:</Text>
        <Text style={styles.value}>{item.totalAttendance}</Text>
      </View>
      <View style={styles.drilldownContainer}>
        <Text style={styles.drilldownText}>View Details</Text>
        <Icon name="arrow-forward" size={16} color="#3B5998" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={summaryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.subjectId}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.header}>Overall Attendance by Subject</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No subjects or attendance data found.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon name="close-circle" size={30} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedSubject?.subjectName}</Text>
            <Text style={styles.modalSubtitle}>Attendee List by Date</Text>
            
            {detailLoading ? <ActivityIndicator size="large" style={{marginTop: 20}}/> : (
              <ScrollView>
                {Object.keys(detailedAttendance).length > 0 ? (
                  Object.entries(detailedAttendance).map(([date, names]) => (
                    <View key={date} style={styles.dateSection}>
                      <Text style={styles.dateHeader}>{date}</Text>
                      {names.map((name, index) => (
                        <Text key={index} style={styles.attendeeName}>- {name}</Text>
                      ))}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No one has attended this class yet.</Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  listContainer: { padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  card: {
    backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  subjectName: { fontSize: 18, fontWeight: 'bold', color: '#3B5998', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  drilldownContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 },
  drilldownText: { color: '#3B5998', fontStyle: 'italic', marginRight: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 10 },
  closeButton: { position: 'absolute', top: 10, right: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalSubtitle: { fontSize: 16, color: 'gray', marginBottom: 20, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
  dateSection: { marginBottom: 15 },
  dateHeader: { fontSize: 16, fontWeight: 'bold', color: '#3B5998', marginBottom: 5 },
  attendeeName: { fontSize: 16, marginLeft: 10, color: '#444', paddingVertical: 2 },
});

export default ViewAllAttendanceScreen;