import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

/**
 * A component that handles fetching a styled QR code from an external API
 * and falls back to a locally generated one if the API call fails.
 */
const QRCodeDisplay = ({ qrCodeValue, size = 180 }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const fetchPrimaryQRCode = async () => {
      try {
        console.log("Attempting to fetch styled PNG QR from primary API...");
        const response = await fetch(
          'https://api.qrcode-monkey.com/qr/custom',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=UTF-8',
            },
            body: JSON.stringify({
              data: qrCodeValue,
              config: {
                body: 'circular',
                eye: 'frame13',
                eyeBall: 'ball15',
                bodyColor: '#0891b2',
                bgColor: '#FFFFFF',
                eye1Color: '#000000',
                eye2Color: '#000000',
                eye3Color: '#000000',
                eyeBall1Color: '#000000',
                eyeBall2Color: '#000000',
                eyeBall3Color: '#000000',
                gradientColor1: '#085567',
                gradientColor2: '#10887A',
                gradientType: 'linear',
                gradientOnEyes: true,
                logo: '#share-circle',
                logoMode: 'default',
              },
              size: 600,
              download: 'imageUrl',
              file: 'png',
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Primary QR service failed with status: ${response.status}`);
        }

        const result = await response.json();

        const validUrl = `https:${result.imageUrl}`;
        console.log("Successfully fetched QR code URL:", validUrl);
        setQrCodeUrl(validUrl);

      } catch (err: any) {
        console.warn('Primary QR Code generation failed, switching to local fallback:', err.message);
        setError('Could not generate styled QR pass. Using a standard one.');
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    const generateQRCode = async () => {
      if (!qrCodeValue || qrCodeValue.includes('NO-ID')) {
        setError("Invalid reservation data provided.");
        setIsLoading(false);
        setUseFallback(true);
        return;
      }
      setIsLoading(true);
      setError(null);
      await fetchPrimaryQRCode();
    };

    generateQRCode();
  }, [qrCodeValue]);

  // --- Rendering Logic ---

  if (isLoading) {
    return <ActivityIndicator size="large" color="#FFFFFF" style={{ width: size, height: size }} />;
  }

  // Use fallback if there was an error OR the fallback state was explicitly set
  if (useFallback) {
    return (
        <View>
            <QRCode value={qrCodeValue} size={size} color="black" backgroundColor="white" />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
  }

  // If we have a URL and are not in fallback mode, display the styled image
  if (qrCodeUrl) {
    return <Image source={{ uri: qrCodeUrl }} style={{ width: size, height: size }} />;
  }

  // A final catch-all, though it's unlikely to be reached
  return <QRCode value={qrCodeValue} size={size} color="black" backgroundColor="white" />;
};


export default function DigitalKeyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const reservationId = (params.reservationId as string) || 'NO-ID';
  const username = (params.username as string) || 'Guest';

  const qrCodeValue = `${username}_${reservationId}`;

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
          source={require('../assets/images/profile.jpg')}
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>{username}</Text>
        <Text style={styles.profileHandle}>Reservation: {reservationId}</Text>
      </View>

      <Text style={styles.instructions}>
        Present this QR code at the gate for scanning.
      </Text>

      <View style={styles.qrCard}>
        <QRCodeDisplay qrCodeValue={qrCodeValue} size={180} />
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
  errorText: {
    color: '#FFD6D6',
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center'
  }
});
