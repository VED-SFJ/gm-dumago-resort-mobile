import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const ResultOverlay = ({ status, data, onClose }) => {
  const isSuccess = status === 'success';
  return (
    <View style={styles.resultOverlay}>
      <View style={[styles.resultBox, { backgroundColor: isSuccess ? '#27AE60' : '#E74C3C' }]}>
        <FontAwesome name={isSuccess ? 'check-circle' : 'times-circle'} size={60} color="white" />
        <Text style={styles.resultTitle}>{isSuccess ? 'Scan Successful!' : 'Scan Failed!'}</Text>
        <Text style={styles.resultData}>{isSuccess ? `Reservation ID: ${data}` : 'Booking not found.'}</Text>
        <TouchableOpacity style={styles.resultButton} onPress={onClose}><Text style={styles.resultButtonText}>OK</Text></TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdminScannerScreen() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error'; data: string } | null>(null);

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?",
      [{ text: "Cancel", style: "cancel" }, { text: "Yes, Logout", onPress: () => router.replace('/adminLogin') }]
    );
  };

  const handleScanPress = () => {
    setScanResult({ status: 'success', data: "RES-12345-VALID" });
  };

  return (
    <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ImageBackground 
            source={require('../assets/images/burger.png')}
            style={styles.cameraPlaceholder}
            blurRadius={10}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeAreaContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={28} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Scan Guest QR</Text>
                        <TouchableOpacity onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.scannerFocus}>
                        <Text style={styles.scanInstruction}>Point camera at the QR code</Text>
                        <View style={styles.scannerFrame} />
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.mainFooterButton} onPress={handleScanPress}>
                            <Ionicons name="scan-outline" size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </ImageBackground>
        
        {scanResult && (
            <ResultOverlay status={scanResult.status} data={scanResult.data} onClose={() => setScanResult(null)} />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1E1E1E'
  },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  safeAreaContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  scannerFocus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scanInstruction: {
      color: 'white',
      fontSize: 16,
      marginBottom: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 10,
      overflow: 'hidden',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  mainFooterButton: {
    backgroundColor: '#5A67D8',
    padding: 20,
    borderRadius: 40,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -33,
  },
  resultBox: {
    width: '85%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
  },
  resultData: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginVertical: 10,
  },
  resultButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  resultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});