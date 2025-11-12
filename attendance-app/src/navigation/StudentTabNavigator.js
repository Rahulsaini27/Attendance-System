
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import StudentDashboardScreen from '../screens/Student/StudentDashboardScreen';
import AttendanceBySubjectScreen from '../screens/Student/AttendanceBySubjectScreen';
import NotificationsScreen from '../screens/Student/NotificationsScreen';

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'My Attendance') iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          else if (route.name === 'Notifications') iconName = focused ? 'notifications' : 'notifications-outline';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B5998',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hides the header for all tab screens
      })}
    >
      <Tab.Screen name="Dashboard" component={StudentDashboardScreen} />
      <Tab.Screen name="My Attendance" component={AttendanceBySubjectScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;