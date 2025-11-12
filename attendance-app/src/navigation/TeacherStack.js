// src/navigation/TeacherStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherDashboardScreen from '../screens/Teacher/TeacherDashboardScreen';
import AddStudentScreen from '../screens/Teacher/AddStudentScreen';
import ManageStudentsScreen from '../screens/Teacher/ManageStudentsScreen';
import ViewAllAttendanceScreen from '../screens/Teacher/ViewAllAttendanceScreen';
import CreateSubjectScreen from '../screens/Teacher/CreateSubjectScreen';
import ActiveSessionScreen from '../screens/Teacher/ActiveSessionScreen';

const Stack = createNativeStackNavigator();

const TeacherStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="TeacherDashboard" 
      component={TeacherDashboardScreen} 
      options={{ title: 'Teacher Dashboard' }}
    />
    <Stack.Screen 
      name="ViewAllAttendance" 
      component={ViewAllAttendanceScreen} 
      options={{ title: 'All Attendance Records' }}
    />
    <Stack.Screen 
      name="ManageStudents" 
      component={ManageStudentsScreen} 
      options={{ title: 'Manage Students' }}
    />
    <Stack.Screen 
      name="AddStudent" 
      component={AddStudentScreen} 
      options={{ title: 'Add New Student' }}
    />
    <Stack.Screen 
      name="CreateSubject" 
      component={CreateSubjectScreen} 
      options={{ title: 'Create New Subject' }}
    />
    <Stack.Screen
      name="ActiveSession"
      component={ActiveSessionScreen}
      options={{ title: 'Live Session' }}
    />
  </Stack.Navigator>
);

export default TeacherStack;