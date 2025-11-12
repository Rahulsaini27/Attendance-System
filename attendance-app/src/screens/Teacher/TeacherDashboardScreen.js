// src/screens/Teacher/TeacherDashboardScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/apiClient';
import Icon from 'react-native-vector-icons/Ionicons';

const TeacherDashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [subjectsRes, activeSessionRes] = await Promise.all([
        apiClient.get('/subjects/my-subjects'),
        apiClient.get('/sessions/teacher/active'),
      ]);
      setSubjects(subjectsRes.data);
      setActiveSession(activeSessionRes.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, [fetchData]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleStartSession = async (subjectId) => {
    try {
      const response = await apiClient.post('/sessions/start', { subjectId });
      navigation.navigate('ActiveSession', { session: response.data });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.msg || 'Could not start session.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B5998" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome, {user?.name}!</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Icon name="log-out-outline" size={30} color="#dc3545" />
        </TouchableOpacity>
      </View>

      {/* --- Section 1: Session Management --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Management</Text>
        {activeSession ? (
          <TouchableOpacity style={styles.activeSessionCard} onPress={() => navigation.navigate('ActiveSession', { session: activeSession })}>
            <Icon name="pulse-outline" size={30} color="#00796b" />
            <View style={styles.activeSessionTextContainer}>
              <Text style={styles.activeSessionText}>LIVE SESSION</Text>
              <Text style={styles.activeSessionSubject}>{activeSession.subjectId.name}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={24} color="#00796b" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateSubject')}>
              <Icon name="add-circle-outline" size={24} color="white" />
              <Text style={styles.createButtonText}>Create New Subject</Text>
            </TouchableOpacity>
            {subjects.length > 0 ? (
              subjects.map(subject => (
                <View key={subject._id} style={styles.subjectCard}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <TouchableOpacity style={styles.startButton} onPress={() => handleStartSession(subject._id)}>
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No subjects created. Tap above to add one.</Text>
            )}
          </>
        )}
      </View>

      {/* --- Section 2: Administrative Tools --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Administrative Tools</Text>
        <View style={styles.menuContainer}>
          <MenuButton icon="stats-chart-outline" text="View Attendance" onPress={() => navigation.navigate('ViewAllAttendance')} />
          <MenuButton icon="people-outline" text="Manage Students" onPress={() => navigation.navigate('ManageStudents')} />
          <MenuButton icon="person-add-outline" text="Add New Student" onPress={() => navigation.navigate('AddStudent')} />
        </View>
      </View>
    </ScrollView>
  );
};

// A reusable component for the menu buttons to keep the code clean
const MenuButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={30} color="#3B5998" />
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FC',
  },
  header: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#777',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
  },
  activeSessionCard: {
    backgroundColor: '#e0f7fa',
    padding: 20,
    borderRadius: 12,
    borderColor: '#00796b',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeSessionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  activeSessionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d40',
  },
  activeSessionSubject: {
    fontSize: 14,
    color: '#00796b'
  },
  createButton: {
    backgroundColor: '#3B5998',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subjectCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8'
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '100%', // Each item takes full width for a list view
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E8E8E8'
  },
  menuText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
});

export default TeacherDashboardScreen;