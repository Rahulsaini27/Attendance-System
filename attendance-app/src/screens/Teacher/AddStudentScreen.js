// src/screens/Teacher/AddStudentScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import apiClient from '../../api/apiClient';
import Icon from 'react-native-vector-icons/Ionicons';

const AddStudentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please provide both a name and an email.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/teacher/add-student', { name, email });
      Alert.alert('Success', response.data.msg, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.msg || 'Could not add the student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.header}>Add New Student</Text>
        <Text style={styles.subtitle}>An email with login credentials will be sent to the student.</Text>
        
        <Text style={styles.label}>Student Full Name</Text>
        <TextInput style={styles.input} placeholder="e.g., John Doe" value={name} onChangeText={setName} />
        
        <Text style={styles.label}>Student Email Address</Text>
        <TextInput style={styles.input} placeholder="e.g., john.doe@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <TouchableOpacity style={styles.button} onPress={handleAddStudent} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="person-add-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Add Student & Send Email</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  formContainer: { padding: 24, justifyContent: 'center', flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#777', marginBottom: 30 },
  label: { fontSize: 16, color: '#444', marginBottom: 8, fontWeight: '500' },
  input: {
    height: 55, backgroundColor: 'white', borderColor: '#CCC',
    borderWidth: 1, borderRadius: 12, marginBottom: 20,
    paddingHorizontal: 16, fontSize: 16,
  },
  button: {
    backgroundColor: '#3B5998', height: 55, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
    marginTop: 10, elevation: 3,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default AddStudentScreen;