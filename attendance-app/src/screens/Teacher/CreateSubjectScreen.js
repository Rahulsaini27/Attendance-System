// src/screens/Teacher/CreateSubjectScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import apiClient from '../../api/apiClient';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateSubjectScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a subject name.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/subjects', { name });
      Alert.alert('Success', 'Subject created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not create subject.');
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
        <Text style={styles.header}>Create a New Subject</Text>
        <Text style={styles.subtitle}>This will be visible to students when you start a session.</Text>
        
        <Text style={styles.label}>Subject Name</Text>
        <TextInput style={styles.input} placeholder="e.g., Advanced Mathematics" value={name} onChangeText={setName} />

        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="book-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Create Subject</Text>
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

export default CreateSubjectScreen;