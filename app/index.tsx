import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export default function IntroScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const goToAdminLogin = () => router.push('/adminLogin');

  return (
    <ImageBackground source={require('../assets/images/resort-bg.jpg')} style={styles.background}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.adminIcon} onPress={goToAdminLogin}>
            <FontAwesome name="user-secret" size={24} color="rgba(255, 255, 255, 0.6)" />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Image source={require('../assets/images/resort-logo.png')} style={styles.logo} />
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>WELCOME TO</Text>
            <Text style={styles.titleHighlight}>GM DUMAGO RESORT</Text>
          </View>
          
          <Text style={styles.subtitle}>Your on-site companion for a perfect getaway. Tap below to view your booking.</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>VIEW MY BOOKING</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1 
  },
  container: { 
    flex: 1, 
    backgroundColor: 'rgba(10, 25, 10, 0.6)',
  },
  adminIcon: { 
    position: 'absolute', 
    top: 55, 
    right: 30, 
    zIndex: 1 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  logo: { 
    width: 300, 
    height: 300,
    resizeMode: 'contain', 
    marginBottom: 10 
  },
  titleContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { 
    fontSize: 32, 
    color: 'white', 
    fontWeight: '300', 
    letterSpacing: 2,
    textAlign: 'center', 
  },
  titleHighlight: { 
    fontSize: 32, 
    color: '#A8E6CF', 
    fontWeight: '700', 
    letterSpacing: 2,
    textAlign: 'center', 
  },
  subtitle: { 
    fontSize: 16, 
    color: 'rgba(255, 255, 255, 0.9)', 
    textAlign: 'center', 
    marginHorizontal: 20, 
    marginBottom: 60, 
    lineHeight: 24 
  },
  button: { 
    backgroundColor: '#A8E6CF', 
    borderRadius: 30, 
    paddingVertical: 18, 
    paddingHorizontal: 50 
  },
  buttonText: { 
    color: '#1C3B30', 
    fontSize: 16, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
});