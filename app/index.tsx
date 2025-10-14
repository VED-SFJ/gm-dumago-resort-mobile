// gm-dumago-resort-mobile/app/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function IntroScreen() {
  const router = useRouter();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../assets/images/resort-bg.jpg')}
        style={styles.background}
      >
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </ImageBackground>
    );
  }

  const handleContinueAsGuest = () => router.push('/login');
  const goToAdminLogin = () => router.push('/adminLogin');

  return (
    <ImageBackground
      source={require('../assets/images/resort-bg.jpg')}
      style={styles.background}
      blurRadius={2.5}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('../assets/images/resort-logo.png')}
            style={styles.logo}
          />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>WELCOME TO</Text>
            <Text style={styles.titleHighlight}>GM DUMAGO RESORT</Text>
          </View>

          <Text style={styles.subtitle}>
            Your on-site companion for a perfect getaway. Tap below to begin.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleContinueAsGuest}>
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>

        {/* Staff login improved UI */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.staffButton} onPress={goToAdminLogin}>
            <Text style={styles.staffButtonText}>STAFF LOGIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 25, 10, 0.6)',
  },
  container: { flex: 1, backgroundColor: 'rgba(10, 25, 10, 0.65)' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  titleContainer: { alignItems: 'center', marginBottom: 20 },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  titleHighlight: {
    fontSize: 34,
    color: '#A8E6CF',
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: '#0B3D2E',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 60,
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: '#A8E6CF',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 60,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#1C3B30',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  staffButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  staffButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
