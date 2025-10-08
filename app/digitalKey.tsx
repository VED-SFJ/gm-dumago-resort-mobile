import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar, 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function DigitalKeyScreen() {
  const router = useRouter();
  const reservationId = 'RES-12345678';
  const guestName = 'Jameel Tutungan';
  const numberOfGuests = 4;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Digital Key</Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.profileSection}>
        <Image
          source={require('../assets/images//profile.jpg')}
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>{guestName}</Text>
        <Text style={styles.profileHandle}>Reservation: {reservationId}</Text>
      </View>

      <Text style={styles.instructions}>
        Present this QR code at the gate for scanning.
      </Text>

      <View style={styles.qrCard}>
        <QRCode
          value={JSON.stringify({ reservationId, guestName, numberOfGuests })} 
          size={180} 
          color="black"
          backgroundColor="white"
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A506B', 
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
    width: 44, 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileHandle: {
    fontSize: 16,
    color: '#D0D6DC', 
    marginTop: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#D0D6DC',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  qrCard: {
    backgroundColor: '#4E6A86', 
    borderRadius: 30, 
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
});