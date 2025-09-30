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
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function DigitalKeyScreen() {
  const router = useRouter();
  const reservationId = 'RES-12345678'; 
  const guestName = 'Jameel Tutungan'; 
  const numberOfGuests = 4; 

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Digital Key</Text> 
        <View style={{ width: 26 }} /> 
      </View>

      <View style={styles.profileSection}>
        <Image
          source={require('../assets/images//profile.jpg')} 
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>{guestName}</Text>
      </View>

      <Text style={styles.instructions}>
        Present this <Text style={styles.bold}>QR code</Text> at the gate for scanning.
      </Text>

      <View style={styles.contentBox}>
        <View style={styles.qrContainer}>
          <QRCode
            value={reservationId}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>

        <Text style={styles.resIdText}>Reservation ID: {reservationId}</Text>
        <Text style={styles.guestText}>Guests: {guestName} + {numberOfGuests}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#324A59', 
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: -10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    borderColor: '#fff', 
    borderWidth: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    color: '#D0D6DC',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24, 
  },
  bold: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentBox: {
    backgroundColor: '#3F596B', 
    borderRadius: 20,
    padding: 20, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    marginHorizontal: 10,
  },
  qrContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25, 
  },
  resIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  guestText: {
    fontSize: 16,
    color: '#D0D6DC',
  },
});