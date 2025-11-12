// src/navigation/StudentStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentDashboardScreen from '../screens/Student/StudentDashboardScreen';
import ViewMyAttendanceScreen from '../screens/Student/ViewMyAttendanceScreen';

const Stack = createNativeStackNavigator();

const StudentStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="StudentDashboard" 
      component={StudentDashboardScreen} 
      options={{ title: 'Student Dashboard' }}
    />
    <Stack.Screen 
      name="ViewMyAttendance" 
      component={ViewMyAttendanceScreen} 
      options={{ title: 'My Attendance History' }}
    />
  </Stack.Navigator>
);

export default StudentStack;