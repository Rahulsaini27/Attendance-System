// src/screens/Teacher/ActiveSessionScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';

const ActiveSessionScreen = ({ route, navigation }) => {
  const { session } = route.params;
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendees = useCallback(async () => {
    try {
      const response = await apiClient.get(`/sessions/${session._id}/attendees`);
      setAttendees(response.data);
    } catch (error) {
      console.error(error); // Keep this for debugging
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session._id]);

  useEffect(() => {
    const interval = setInterval(fetchAttendees, 10000);
    return () => clearInterval(interval);
  }, [fetchAttendees]);

  useFocusEffect(useCallback(() => { setLoading(true); fetchAttendees(); }, [fetchAttendees]));
  
  const onRefresh = useCallback(() => { setRefreshing(true); fetchAttendees(); }, [fetchAttendees]);

  const handleStopSession = () => {
    Alert.alert(
      "Confirm Stop",
      "Are you sure you want to end this attendance session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Stop Session", style: "destructive", onPress: async () => {
            try {
              await apiClient.post(`/sessions/stop/${session._id}`);
              Alert.alert('Success', 'Session has been stopped.', [
                { text: 'OK', onPress: () => navigation.navigate('TeacherDashboard') }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Could not stop the session.');
            }
        }}
      ]
    );
  };

  if (loading) return <LoadingSpinner />;

  const renderItem = ({ item, index }) => (
    <View style={styles.attendeeItem}>
      <Text style={styles.attendeeNumber}>{index + 1}.</Text>
      <Icon name="person-circle-outline" size={24} color="#555" />
      <Text style={styles.attendeeText}>{item.studentId.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subjectName}>{session.subjectId.name}</Text>
        <View style={styles.attendeeCountContainer}>
          <Icon name="people" size={24} color="#3B5998" />
          <Text style={styles.attendeeCount}>{attendees.length} Attendees</Text>
        </View>
      </View>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No students have marked attendance yet.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <TouchableOpacity style={styles.footerButton} onPress={handleStopSession}>
        <Icon name="stop-circle-outline" size={24} color="white" />
        <Text style={styles.footerButtonText}>Stop Attendance Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#F4F7FC', borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  subjectName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  attendeeCountContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#E8EAF6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  attendeeCount: { fontSize: 16, color: '#3B5998', marginLeft: 8, fontWeight: '600' },
  attendeeItem: { paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  attendeeNumber: { fontSize: 16, color: '#999', marginRight: 15, width: 30 },
  attendeeText: { fontSize: 16, color: '#333', marginLeft: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  footerButton: {
    position: 'absolute', bottom: 30, left: 20, right: 20,
    backgroundColor: '#dc3545', height: 55, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
    elevation: 5,
  },
  footerButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default ActiveSessionScreen;