// gm-dumago-resort-mobile/app/(admin)/scanner.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert, AppState, ActivityIndicator, Modal, FlatList, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { verifyReservationQR } from '@/api/admin';
import { AdminReservationVerificationResponse } from '@/models/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: screenHeight } = Dimensions.get('window');
const TOP_OFFSET = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;


const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch {
    return "Invalid Date";
  }
};

const ResultOverlay = ({ status, data, error, onClose }) => {
  const isSuccess = status === 'success';

  return (
    <View style={styles.resultOverlay}>
      <View style={[styles.resultBox, { backgroundColor: isSuccess ? '#27AE60' : '#E74C3C' }]}>
        <FontAwesome name={isSuccess ? 'check-circle' : 'times-circle'} size={60} color="white" />
        <Text style={styles.resultTitle}>{isSuccess ? 'Verification Successful' : 'Verification Failed'}</Text>

        {isSuccess && data ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Guest:</Text> {data.user?.username}</Text>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Reservation ID:</Text> {data.id.slice(-8).toUpperCase()}</Text>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Date:</Text> {formatDate(data.reservation_date)}</Text>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Guests:</Text> {data.number_of_guests}</Text>
            <Text style={styles.detailItem}><Text style={styles.detailLabel}>Status:</Text> <Text style={{fontWeight: 'bold'}}>{data.status.toUpperCase()}</Text></Text>
          </View>
        ) : (
          <Text style={styles.resultData}>{error || 'An unknown error occurred.'}</Text>
        )}

        <TouchableOpacity style={styles.resultButton} onPress={onClose}>
          <Text style={styles.resultButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ScanHistoryModal = ({ isVisible, history, onClose, onClear }) => {
  const renderHistoryItem = ({ item }) => (
    <View style={[styles.historyItem, !item.success && styles.historyItemFailed]}>
      <FontAwesome
        name={item.success ? 'check-circle' : 'times-circle'}
        size={24}
        color={item.success ? '#27AE60' : '#E74C3C'}
      />
      <View style={styles.historyDetails}>
        <Text style={styles.historyTextPrimary}>{item.success ? item.data.user?.username : 'Scan Failed'}</Text>
        <Text style={styles.historyTextSecondary}>
          {item.success ? `ID: ${item.data.id.slice(-8).toUpperCase()}` : `Reason: ${item.error}`}
        </Text>
      </View>
      <Text style={styles.historyTimestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Scan History</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Ionicons name="close" size={28} color="#555" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.timestamp.toString()}
            ListEmptyComponent={<Text style={styles.historyEmptyText}>No scans recorded yet.</Text>}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          {history.length > 0 && (
             <TouchableOpacity style={styles.clearButton} onPress={onClear}>
              <Text style={styles.clearButtonText}>Clear History</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};


export default function AdminScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState<any>(null);

  const [isScanned, setIsScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const HISTORY_STORAGE_KEY = 'admin_scan_history';

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
          setScanHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error("Failed to load scan history:", e);
      }
    };
    loadHistory();
  }, []);

  const addToHistory = useCallback(async (item: any) => {
    setScanHistory(prevHistory => {
      const newHistory = [item, ...prevHistory].slice(0, 50); // Keep last 50 scans
      AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory)).catch(e => console.error("Failed to save history:", e));
      return newHistory;
    });
  }, []);

  const clearHistory = () => {
    Alert.alert("Clear History", "Are you sure you want to clear all scan records?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, Clear", style: 'destructive', onPress: async () => {
        setScanHistory([]);
        await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
        setHistoryVisible(false);
      }}
    ]);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setIsCameraActive(nextAppState === 'active');
    });
    return () => subscription.remove();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (isScanned) return;
    setIsScanned(true);

    try {
      const verificationData = await verifyReservationQR(data);
      setScanResult({ status: 'success', data: verificationData });
      addToHistory({ success: true, data: verificationData, timestamp: Date.now() });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Invalid or expired QR code.";
      setScanResult({ status: 'error', error: errorMessage });
      addToHistory({ success: false, error: errorMessage, qrData: data, timestamp: Date.now() });
    }
  };
  const handleCloseOverlay = () => {
    setScanResult(null);
    setTimeout(() => setIsScanned(false), 1000);
  };

  if (!permission) return <View style={styles.container}><ActivityIndicator color="white" /></View>;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isCameraActive && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.scannerContent}>
            <Text style={styles.scanInstruction}>Point camera at the QR code</Text>
            <View style={styles.scannerFrame} />
        </View>
      </View>
      <View style={styles.floatingHeaderWrapper}>
          <View style={styles.floatingHeader}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Scan Guest QR</Text>
              <TouchableOpacity onPress={() => setHistoryVisible(true)} style={styles.historyButton}>
                  <Ionicons name="time-outline" size={28} color="white" />
              </TouchableOpacity>
          </View>
      </View>

      {scanResult && (
        <ResultOverlay
          status={scanResult.status}
          data={scanResult.data}
          error={scanResult.error}
          onClose={handleCloseOverlay}
        />
      )}

      <ScanHistoryModal
        isVisible={isHistoryVisible}
        history={scanHistory}
        onClose={() => setHistoryVisible(false)}
        onClear={clearHistory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -TOP_OFFSET / 2,
  },
  floatingHeaderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: TOP_OFFSET,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
    borderRadius: 50,
  },
  historyButton: {
    padding: 5,
    borderRadius: 50,
  },

  scanInstruction: {
    color: 'white', fontSize: 16, marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, overflow: 'hidden',
  },
  scannerFrame: {
    width: 280, height: 280, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
    zIndex: 200,
  },
  resultBox: { width: '90%', padding: 25, borderRadius: 15, alignItems: 'center' },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 15, marginBottom: 10 },
  resultData: { fontSize: 16, color: 'white', opacity: 0.9, marginVertical: 10, textAlign: 'center' },
  detailsContainer: {
    alignSelf: 'stretch',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  detailItem: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
  },
  resultButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingVertical: 12, paddingHorizontal: 50,
    borderRadius: 25, marginTop: 25,
  },
  resultButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  permissionContainer: { flex: 1, backgroundColor: '#1E1E1E', justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  permissionButton: { backgroundColor: '#5A67D8', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  permissionButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#F0F2F5',
    height: screenHeight * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 5,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  historyItemFailed: {
    backgroundColor: '#FFF1F1',
  },
  historyDetails: {
    flex: 1,
    marginLeft: 15,
  },
  historyTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyTextSecondary: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  historyEmptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  clearButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
