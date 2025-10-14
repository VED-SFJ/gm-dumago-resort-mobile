// gm-dumago-resort-mobile/app/(admin)/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  DevSettings
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const FeatureCard = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <FontAwesome5 name={icon} size={40} color="#A9B2C3" />
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out from the admin panel?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Logout",
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              console.error("Logout failed:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C212B" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome, {user?.username || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={28} color="#EB5757" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Tools</Text>
        <View style={styles.featuresGrid}>
          <FeatureCard
            icon="qrcode"
            label="Scan Guest QR"
            onPress={() => router.push('/(admin)/scanner')}
          />
          <FeatureCard
            icon="book"
            label="View Bookings"
            onPress={() => router.push('/(admin)/bookings')}
          />
          <FeatureCard
            icon="chart-bar"
            label="Reports"
            onPress={() => Alert.alert("Coming Soon", "This feature is under development.")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C212B',
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F0F6FC',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A9B2C3',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 15,
    marginTop: 5,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#1C212B',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cardLabel: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#F0F6FC',
  },
});
