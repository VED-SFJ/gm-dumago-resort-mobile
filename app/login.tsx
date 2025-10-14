import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function GuestLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Login Required", "Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    const user = await login({ email, password });
    setIsLoading(false);

    if (user) {
      if (user.role === 'admin') {
        Alert.alert("Access Denied", "Staff must use the dedicated Admin Login portal.");
        return;
      }
      router.replace('/(tab)');
    } else {
      Alert.alert("Login Failed", "Incorrect email or password. Please try again.");
    }
  };

  const handleBack = () => {
    try {
      router.back();
    } catch {
      router.push('/');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/resort-bg.jpg')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <SafeAreaView style={styles.content}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Ionicons name="arrow-back-circle-outline" size={32} color="white" />
              </TouchableOpacity>

              <View style={styles.mainContent}>
                <Image
                  source={require('../assets/images/resort-logo.png')}
                  style={styles.logo}
                />
                <View style={styles.form}>
                  <Text style={styles.formTitle}>Guest Login</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="go"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#1C3B30" />
                    ) : (
                      <Text style={styles.buttonText}>LOGIN</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.footer} />
            </SafeAreaView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 25, 10, 0.6)',
    paddingVertical: 20,
  },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  mainContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: { width: 300, height: 300, resizeMode: 'contain', marginBottom: -10 },
  form: { width: '100%', paddingHorizontal: 40 },
  formTitle: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    color: 'white',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 12,
    marginBottom: 35,
  },
  button: {
    backgroundColor: '#A8E6CF',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: '#88b5a3' },
  buttonText: {
    color: '#1C3B30',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: { height: 30 },
});
