// // // src/screens/Student/StudentDashboardScreen.js
// // import React, { useState, useCallback } from 'react';
// // import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl, TouchableOpacity, Button } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { useAuth } from '../../hooks/useAuth';
// // import apiClient from '../../api/apiClient';
// // import LoadingSpinner from '../../components/LoadingSpinner';
// // import StatCard from '../../components/StatCard';

// // const StudentDashboardScreen = () => {
// //   // Destructure the logout function from the useAuth hook
// //   const { user, logout } = useAuth();
// //   const [summary, setSummary] = useState(null);
// //   const [activeSessions, setActiveSessions] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const fetchData = useCallback(async () => {
// //     try {
// //       const [summaryRes, sessionsRes] = await Promise.all([
// //         apiClient.get('/attendance/summary'),
// //         apiClient.get('/sessions/active'),
// //       ]);
// //       setSummary(summaryRes.data);
// //       setActiveSessions(sessionsRes.data);
// //     } catch (error) {
// //       Alert.alert('Error', 'Could not fetch dashboard data.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, [fetchData]));

// //   const onRefresh = useCallback(() => {
// //     setRefreshing(true);
// //     fetchData().then(() => setRefreshing(false));
// //   }, [fetchData]);

// //   const handleMarkAttendance = async (session) => {
// //     try {
// //         await apiClient.post('/attendance/mark', {
// //             sessionId: session._id,
// //             subjectId: session.subjectId._id
// //         });
// //         Alert.alert('Success', 'Attendance marked successfully!');
// //         onRefresh();
// //     } catch (error) {
// //         Alert.alert('Error', error.response?.data?.msg || "Could not mark attendance.");
// //     }
// //   };

// //   if (loading) return <LoadingSpinner />;

// //   return (
// //     <ScrollView 
// //       style={styles.container}
// //       contentContainerStyle={styles.contentContainer}
// //       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// //     >
// //       <Text style={styles.header}>Hello, {user?.name.split(' ')[0]}</Text>

// //       <View style={styles.statsContainer}>
// //         <StatCard value={summary?.overall?.totalClasses || 0} label="Total Classes" />
// //         <StatCard value={summary?.overall?.attended || 0} label="Attended" />
// //         <StatCard value={`${Math.round(summary?.overall?.percentage || 0)}%`} label="Attendance %" />
// //       </View>

// //       <Text style={styles.subHeader}>Upcoming Classes</Text>
// //       {activeSessions.length > 0 ? (
// //         activeSessions.map(session => (
// //           <View key={session._id} style={styles.classCard}>
// //             <View>
// //                 <Text style={styles.classTitle}>{session.subjectId.name}</Text>
// //                 <Text style={styles.classProf}>Prof. {session.teacherId.name}</Text>
// //             </View>
// //             <TouchableOpacity style={styles.markButton} onPress={() => handleMarkAttendance(session)}>
// //                 <Text style={styles.markButtonText}>Mark Present</Text>
// //             </TouchableOpacity>
// //           </View>
// //         ))
// //       ) : (
// //         <Text style={styles.noClassesText}>No classes are active for attendance.</Text>
// //       )}

// //       {/* --- ADDED LOGOUT BUTTON SECTION --- */}
// //       <View style={styles.logoutContainer}>
// //         <Button title="Logout" onPress={logout} color="#dc3545" />
// //       </View>
      
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //     container: { 
// //         flex: 1, 
// //         backgroundColor: '#FFFFFF' 
// //     },
// //     contentContainer: { 
// //         padding: 20,
// //         paddingBottom: 40, // Add padding to the bottom
// //     },
// //     header: { 
// //         fontSize: 28, 
// //         fontWeight: 'bold', 
// //         color: '#333' 
// //     },
// //     statsContainer: { 
// //         flexDirection: 'row', 
// //         justifyContent: 'space-between', 
// //         marginVertical: 20 
// //     },
// //     subHeader: { 
// //         fontSize: 22, 
// //         fontWeight: '600', 
// //         color: '#333', 
// //         marginTop: 10, 
// //         marginBottom: 10 
// //     },
// //     classCard: {
// //       backgroundColor: '#F9F9F9',
// //       borderRadius: 12,
// //       padding: 20,
// //       marginBottom: 12,
// //       flexDirection: 'row',
// //       justifyContent: 'space-between',
// //       alignItems: 'center',
// //       borderWidth: 1,
// //       borderColor: '#EEE'
// //     },
// //     classTitle: { 
// //         fontSize: 18, 
// //         fontWeight: 'bold', 
// //         color: '#333' 
// //     },
// //     classProf: { 
// //         fontSize: 14, 
// //         color: '#666', 
// //         marginTop: 4 
// //     },
// //     markButton: { 
// //         backgroundColor: '#28a745', 
// //         paddingHorizontal: 15, 
// //         paddingVertical: 10, 
// //         borderRadius: 8 
// //     },
// //     markButtonText: { 
// //         color: 'white', 
// //         fontWeight: 'bold' 
// //     },
// //     noClassesText: { 
// //         textAlign: 'center', 
// //         color: '#666', 
// //         marginTop: 20, 
// //         fontSize: 16 
// //     },
// //     // --- NEW STYLE FOR LOGOUT BUTTON ---
// //     logoutContainer: {
// //         marginTop: 40,
// //         marginHorizontal: 20, // Give it some horizontal margin
// //     }
// // });

// // export default StudentDashboardScreen;





// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { useAuth } from '../../hooks/useAuth';
// import apiClient from '../../api/apiClient';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import StatCard from '../../components/StatCard';
// import Icon from 'react-native-vector-icons/Ionicons';

// const StudentDashboardScreen = () => {
//   const { user, logout } = useAuth();
//   const [summary, setSummary] = useState(null);
//   const [activeSessions, setActiveSessions] = useState([]);
//   const [todaysAttendance, setTodaysAttendance] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       const [summaryRes, sessionsRes, todayRes] = await Promise.all([
//         apiClient.get('/attendance/summary'),
//         apiClient.get('/sessions/active'),
//         apiClient.get('/attendance/today'), // Fetch today's records
//       ]);
//       setSummary(summaryRes.data);
//       setActiveSessions(sessionsRes.data);
//       // Create a Set of session IDs for quick lookups
//       setTodaysAttendance(new Set(todayRes.data.map(rec => rec.sessionId)));
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch dashboard data.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, [fetchData]));

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchData().then(() => setRefreshing(false));
//   }, [fetchData]);

//   const handleMarkAttendance = async (session) => {
//     try {
//       await apiClient.post('/attendance/mark', { sessionId: session._id, subjectId: session.subjectId._id });
//       Alert.alert('Success', 'Attendance marked successfully!');
//       onRefresh();
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.msg || "Could not mark attendance.");
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <ScrollView 
//       style={styles.container}
//       contentContainerStyle={styles.contentContainer}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       <View style={styles.headerRow}>
//         <Text style={styles.header}>Hello, {user?.name.split(' ')[0]}</Text>
//         <TouchableOpacity onPress={logout}>
//           <Icon name="log-out-outline" size={30} color="#dc3545"/>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statsContainer}>
//         <StatCard value={summary?.overall?.totalClasses || 0} label="Total Classes" />
//         <StatCard value={summary?.overall?.attended || 0} label="Attended" />
//         <StatCard value={`${Math.round(summary?.overall?.percentage || 0)}%`} label="Attendance" />
//       </View>

//       <Text style={styles.subHeader}>Active Classes</Text>
//       {activeSessions.length > 0 ? (
//         activeSessions.map(session => {
//           const isMarked = todaysAttendance.has(session._id);
//           return (
//             <View key={session._id} style={styles.classCard}>
//               <View>
//                   <Text style={styles.classTitle}>{session.subjectId.name}</Text>
//                   <Text style={styles.classProf}>Prof. {session.teacherId.name}</Text>
//               </View>
//               <TouchableOpacity 
//                 style={[styles.markButton, isMarked && styles.markedButton]} 
//                 onPress={() => handleMarkAttendance(session)}
//                 disabled={isMarked}
//               >
//                 <Icon name={isMarked ? "checkmark-done" : "hand-right-outline"} size={20} color="white" style={{marginRight: 8}}/>
//                 <Text style={styles.markButtonText}>{isMarked ? "Marked" : "Mark Present"}</Text>
//               </TouchableOpacity>
//             </View>
//           );
//         })
//       ) : (
//         <View style={styles.noClassesContainer}>
//             <Icon name="hourglass-outline" size={40} color="#AAA"/>
//             <Text style={styles.noClassesText}>No classes are active for attendance.</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#FFFFFF' },
//     contentContainer: { padding: 20 },
//     headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
//     header: { fontSize: 28, fontWeight: 'bold', color: '#333' },
//     statsContainer: { flexDirection: 'row', marginVertical: 20 },
//     subHeader: { fontSize: 22, fontWeight: '600', color: '#333', marginTop: 10, marginBottom: 15 },
//     classCard: {
//       backgroundColor: '#F9F9F9', borderRadius: 12, padding: 20, marginBottom: 12,
//       flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//       borderWidth: 1, borderColor: '#EEE'
//     },
//     classTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//     classProf: { fontSize: 14, color: '#666', marginTop: 4 },
//     markButton: {
//       backgroundColor: '#28a745', paddingHorizontal: 15, paddingVertical: 10,
//       borderRadius: 20, flexDirection: 'row', alignItems: 'center'
//     },
//     markedButton: { backgroundColor: '#777' },
//     markButtonText: { color: 'white', fontWeight: 'bold' },
//     noClassesContainer: { alignItems: 'center', marginTop: 30, padding: 20 },
//     noClassesText: { textAlign: 'center', color: '#666', marginTop: 10, fontSize: 16 },
// });

// export default StudentDashboardScreen;





























// src/screens/Student/StudentDashboardScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import Icon from 'react-native-vector-icons/Ionicons';

const StudentDashboardScreen = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [todaysAttendance, setTodaysAttendance] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, sessionsRes, todayRes] = await Promise.all([
        apiClient.get('/attendance/summary'),
        apiClient.get('/sessions/active'),
        apiClient.get('/attendance/today'),
      ]);
      setSummary(summaryRes.data);
      setActiveSessions(sessionsRes.data);
      setTodaysAttendance(new Set(todayRes.data.map(rec => rec.sessionId)));
    } catch (error) {
      // Don't alert on dashboard, just log for debugging
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, [fetchData]));

  const onRefresh = useCallback(() => { setRefreshing(true); fetchData(); }, [fetchData]);

  const handleMarkAttendance = async (session) => {
    try {
      await apiClient.post('/attendance/mark', { sessionId: session._id, subjectId: session.subjectId._id });
      Alert.alert('Success', 'Attendance marked successfully!');
      onRefresh();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.msg || "Could not mark attendance.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <Text style={styles.headerSubtitle}>Hello, {user?.name.split(' ')[0]}!</Text>
            </View>
            <TouchableOpacity onPress={logout}>
            <Icon name="log-out-outline" size={30} color="#dc3545" />
            </TouchableOpacity>
        </View>

        <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.statsContainer}>
                <StatCard value={summary?.overall?.totalClasses || 0} label="Total Classes" />
                <StatCard value={summary?.overall?.attended || 0} label="Attended" />
                <StatCard value={`${Math.round(summary?.overall?.percentage || 0)}%`} label="Attendance" />
            </View>

            <Text style={styles.sectionTitle}>Active Classes</Text>
            {activeSessions.length > 0 ? (
                activeSessions.map(session => {
                const isMarked = todaysAttendance.has(session._id);
                return (
                    <View key={session._id} style={styles.classCard}>
                        <View>
                            <Text style={styles.classTitle}>{session.subjectId.name}</Text>
                            <Text style={styles.classProf}>Prof. {session.teacherId.name}</Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.markButton, isMarked && styles.markedButton]} 
                            onPress={() => handleMarkAttendance(session)}
                            disabled={isMarked}
                        >
                            <Icon name={isMarked ? "checkmark-done" : "hand-right-outline"} size={20} color="white" style={{marginRight: 8}}/>
                            <Text style={styles.markButtonText}>{isMarked ? "Marked" : "Mark Present"}</Text>
                        </TouchableOpacity>
                    </View>
                );
                })
            ) : (
                <View style={styles.noClassesContainer}>
                    <Icon name="hourglass-outline" size={40} color="#AAA"/>
                    <Text style={styles.noClassesText}>No classes are active for attendance.</Text>
                </View>
            )}
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F4F7FC', 
    },
    header: {
        padding: 20, paddingTop: 30, backgroundColor: 'white',
        borderBottomWidth: 1, borderBottomColor: '#E8E8E8',
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 16, color: '#777' },
    scrollContent: { padding: 20 },
    statsContainer: { flexDirection: 'row', marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '600', color: '#444', marginBottom: 15 },
    classCard: {
        backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 12,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: '#E8E8E8'
    },
    classTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    classProf: { fontSize: 14, color: '#666', marginTop: 4 },
    markButton: {
        backgroundColor: '#28a745', paddingHorizontal: 15, paddingVertical: 10,
        borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 2,
    },
    markedButton: { backgroundColor: '#777' },
    markButtonText: { color: 'white', fontWeight: 'bold' },
    noClassesContainer: { alignItems: 'center', marginTop: 30, padding: 20 },
    noClassesText: { textAlign: 'center', color: '#666', marginTop: 10, fontSize: 16 },
});

export default StudentDashboardScreen;