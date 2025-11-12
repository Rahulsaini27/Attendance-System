// // src/screens/Student/AttendanceBySubjectScreen.js
// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import apiClient from '../../api/apiClient';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import ProgressBar from '../../components/ProgressBar';

// const AttendanceBySubjectScreen = () => {
//   const [summary, setSummary] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/attendance/summary');
//       setSummary(response.data.bySubject);
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch attendance summary.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, [fetchData]));

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchData().then(() => setRefreshing(false));
//   }, [fetchData]);

//   if (loading) return <LoadingSpinner />;

//   const getProgressBarColor = (percentage) => {
//     if (percentage >= 75) return '#28a745'; // Green
//     if (percentage >= 50) return '#ffc107'; // Yellow
//     return '#dc3545'; // Red
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.subjectName}>{item.subjectName}</Text>
//       <View style={styles.row}>
//         <Text style={styles.label}>Total Classes</Text>
//         <Text style={styles.value}>{item.totalClasses}</Text>
//       </View>
//       <View style={styles.row}>
//         <Text style={styles.label}>Present / Absent</Text>
//         <Text style={styles.value}>{item.presentClasses} / {item.absentClasses}</Text>
//       </View>
//       <ProgressBar
//         percentage={item.attendancePercentage}
//         color={getProgressBarColor(item.attendancePercentage)}
//       />
//       <Text style={styles.percentageText}>{Math.round(item.attendancePercentage)}% Attendance</Text>
//     </View>
//   );

//   return (
//     <FlatList
//       data={summary}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.subjectId}
//       contentContainerStyle={styles.container}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       ListHeaderComponent={<Text style={styles.header}>Attendance by Subject</Text>}
//       ListEmptyComponent={<Text style={styles.emptyText}>No attendance data available.</Text>}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, backgroundColor: '#FFFFFF', padding: 16 },
//   header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
//   card: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEE' },
//   subjectName: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
//   row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
//   label: { fontSize: 16, color: '#666' },
//   value: { fontSize: 16, fontWeight: '500', color: '#333' },
//   percentageText: { textAlign: 'right', marginTop: 4, color: '#555' },
//   emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
// });

// export default AttendanceBySubjectScreen;









// src/screens/Student/AttendanceBySubjectScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProgressBar from '../../components/ProgressBar';
import Icon from 'react-native-vector-icons/Ionicons';

const AttendanceBySubjectScreen = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get('/attendance/summary');
      setSummary(response.data.bySubject);
    } catch (error) {
      console.error('Fetch summary error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, [fetchData]));

  const onRefresh = useCallback(() => { setRefreshing(true); fetchData(); }, [fetchData]);

  if (loading) return <LoadingSpinner />;

  const getProgressBarColor = (percentage) => {
    if (percentage >= 75) return '#28a745'; // Green
    if (percentage >= 50) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="book-outline" size={22} color="#3B5998" />
        <Text style={styles.subjectName}>{item.subjectName}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Total Classes:</Text>
        <Text style={styles.value}>{item.totalClasses}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Present / Absent:</Text>
        <Text style={styles.value}>{item.presentClasses} / {item.absentClasses}</Text>
      </View>
      <ProgressBar
        percentage={item.attendancePercentage}
        color={getProgressBarColor(item.attendancePercentage)}
      />
      <Text style={styles.percentageText}>{Math.round(item.attendancePercentage)}% Attendance</Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Attendance</Text>
        </View>
        <FlatList
            data={summary}
            renderItem={renderItem}
            keyExtractor={(item) => item.subjectId}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Icon name="cloud-offline-outline" size={50} color="#AAA" />
                    <Text style={styles.emptyText}>No attendance data available yet.</Text>
                </View>
            }
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FC' },
    header: {
        padding: 20, paddingTop: 30, backgroundColor: 'white',
        borderBottomWidth: 1, borderBottomColor: '#E8E8E8',
        alignItems: 'center'
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    listContainer: { padding: 16 },
    card: { 
        backgroundColor: 'white', borderRadius: 12, padding: 16, 
        marginBottom: 16, borderWidth: 1, borderColor: '#E8E8E8', elevation: 2,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    subjectName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
    label: { fontSize: 16, color: '#666' },
    value: { fontSize: 16, fontWeight: '500', color: '#333' },
    percentageText: { textAlign: 'right', marginTop: 8, color: '#555', fontWeight: '600' },
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { textAlign: 'center', marginTop: 15, fontSize: 16, color: 'gray' },
});

export default AttendanceBySubjectScreen;