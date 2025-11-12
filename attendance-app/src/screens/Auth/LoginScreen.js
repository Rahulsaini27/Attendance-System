
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient'; 
import logo from '../../../assets/images/logo.png';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setIsLoading(false);
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#D6E4FF', '#A8C7FF']} style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Image source={logo} style={styles.logo} />
        {/* <Text style={styles.title}>COLLEGE</Text> */}
        
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        {isLoading ? <ActivityIndicator size="large" color="#3B5998" /> : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
        )}

        <TouchableOpacity><Text style={styles.forgotPassword}>Forgot password?</Text></TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 150, height: 100, resizeMode: 'contain', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 40, letterSpacing: 2 },
  input: {
    width: '100%', height: 55, backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#E8E8E8', borderWidth: 1, borderRadius: 12,
    marginBottom: 16, paddingHorizontal: 20, fontSize: 16,
  },
  loginButton: {
    width: '100%', height: 55, backgroundColor: '#3B5998', justifyContent: 'center',
    alignItems: 'center', borderRadius: 12, marginTop: 8, elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  forgotPassword: { color: '#3B5998', marginTop: 20, fontWeight: '500' },
});

export default LoginScreen;