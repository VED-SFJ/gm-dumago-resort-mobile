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
  ScrollView 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function AdminLoginScreen() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = () => {
    if (!username || !password) {
      Alert.alert("Login Failed", "Please enter both username and password.");
      return;
    }
    if (username.toLowerCase() === 'root' && password === 'root') {
      Alert.alert("Login Successful", "Redirecting to scanner...");
      router.replace('/adminScanner');
    } else {
      Alert.alert("Login Failed", "Incorrect username or password.");
    }
  };

  return (
    <ImageBackground source={require('../assets/images/resort-bg.jpg')} style={styles.background}>
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
              
              <View style={styles.header} />
              
              <View style={styles.mainContent}>
                <Image source={require('../assets/images/resort-logo.png')} style={styles.logo} />
                <View style={styles.form}>
                  <Text style={styles.formTitle}>Staff Login</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Admin Username" 
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
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
                    onSubmitEditing={handleAdminLogin} 
                  />
                  <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
                    <Text style={styles.buttonText}>LOGIN</Text>
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

const styles = StyleSheet.create({
    background: { 
        flex: 1 
    },
    container: {
        flex: 1, 
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center', 
    },
    content: { 
        flex: 1, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'rgba(10, 25, 10, 0.6)',
        paddingVertical: 20,
    },
    header: {
        height: 60, 
    },
    mainContent: {
        width: '100%',
        alignItems: 'center',
    },
    logo: { 
        width: 300, 
        height: 300, 
        resizeMode: 'contain',
        marginBottom: -10,
    },
    form: { 
        width: '100%', 
        paddingHorizontal: 40 
    },
    formTitle: { 
        fontSize: 28,  
        color: 'white', 
        textAlign: 'center', 
        marginBottom: 30 
    },
    input: { 
        color: 'white', 
        fontSize: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: 'rgba(255, 255, 255, 0.5)', 
        paddingVertical: 12, 
        marginBottom: 35 
    },
    button: { 
        backgroundColor: '#A8E6CF', 
        borderRadius: 50, 
        paddingVertical: 18, 
        alignItems: 'center', 
        marginTop: 20 
    },
    buttonText: { 
        color: '#1C3B30', 
        fontSize: 16, 
        fontWeight: 'bold', 
        letterSpacing: 1 
    },
    footer: {
        height: 30,
    }
});