// // src/screens/Student/NotificationsScreen.js
// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import apiClient from '../../api/apiClient';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import Icon from 'react-native-vector-icons/Ionicons';

// const NotificationsScreen = () => {
//     const [notifications, setNotifications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);

//     const fetchNotifications = useCallback(async () => {
//         try {
//             const response = await apiClient.get('/notifications/my-notifications');
//             setNotifications(response.data);
//         } catch (error) {
//             Alert.alert('Error', 'Could not fetch notifications.');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useFocusEffect(useCallback(() => { setLoading(true); fetchNotifications(); }, [fetchNotifications]));

//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         fetchNotifications().then(() => setRefreshing(false));
//     }, [fetchNotifications]);

//     if(loading) return <LoadingSpinner />;

//     const renderItem = ({ item }) => {
//         const isMissed = item.title === 'Class Missed';
//         return (
//             <View style={styles.card}>
//                 <View style={[styles.iconContainer, {backgroundColor: isMissed ? '#ffebed' : '#e8f5e9'}]}>
//                     <Icon name={isMissed ? 'close-circle' : 'checkmark-circle'} size={24} color={isMissed ? '#dc3545' : '#28a745'} />
//                 </View>
//                 <View style={styles.textContainer}>
//                     <Text style={styles.title}>{item.title}</Text>
//                     <Text style={styles.message}>{item.message}</Text>
//                 </View>
//                 <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
//             </View>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Notifications</Text>
//             <FlatList
//                 data={notifications}
//                 renderItem={renderItem}
//                 keyExtractor={item => item._id}
//                 refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//                 ListEmptyComponent={<Text style={styles.emptyText}>You have no notifications.</Text>}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 20 },
//     header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, paddingHorizontal: 16, color: '#333' },
//     card: {
//         backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, marginHorizontal: 16,
//         marginBottom: 12, flexDirection: 'row', alignItems: 'center',
//         borderWidth: 1, borderColor: '#EEE'
//     },
//     iconContainer: {
//         padding: 12,
//         borderRadius: 50,
//         marginRight: 15,
//     },
//     textContainer: { flex: 1 },
//     title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//     message: { fontSize: 14, color: '#666', marginTop: 2 },
//     time: { fontSize: 12, color: '#999', marginLeft: 10 },
//     emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
// });

// export default NotificationsScreen;

// src/screens/Student/NotificationsScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await apiClient.get('/notifications/my-notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Fetch notifications error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { setLoading(true); fetchNotifications(); }, [fetchNotifications]));

    const onRefresh = useCallback(() => { setRefreshing(true); fetchNotifications(); }, [fetchNotifications]);

    if(loading) return <LoadingSpinner />;

    const renderItem = ({ item }) => {
        const isMissed = item.title === 'Class Missed';
        return (
            <View style={styles.card}>
                <View style={[styles.iconContainer, {backgroundColor: isMissed ? '#ffebed' : '#e8f5e9'}]}>
                    <Icon name={isMissed ? 'alert-circle-outline' : 'checkmark-done-circle-outline'} size={24} color={isMissed ? '#dc3545' : '#28a745'} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.message}>{item.message}</Text>
                </View>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="notifications-off-outline" size={50} color="#AAA" />
                        <Text style={styles.emptyText}>You have no new notifications.</Text>
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
        backgroundColor: 'white', borderRadius: 12, padding: 15,
        marginBottom: 12, flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: '#E8E8E8', elevation: 2,
    },
    iconContainer: { padding: 12, borderRadius: 50, marginRight: 15 },
    textContainer: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    message: { fontSize: 14, color: '#666', marginTop: 2 },
    time: { fontSize: 12, color: '#999', marginLeft: 10 },
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { textAlign: 'center', marginTop: 15, fontSize: 16, color: 'gray' },
});

export default NotificationsScreen;