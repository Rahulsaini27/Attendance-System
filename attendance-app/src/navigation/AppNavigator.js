// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import AuthStack from './AuthStack';
import StudentTabNavigator from './StudentTabNavigator';
import TeacherStack from './TeacherStack';
import LoadingSpinner from '../components/LoadingSpinner';

const AppNavigator = () => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {token && user ? (
        user.role === 'teacher' ? <TeacherStack /> : <StudentTabNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;