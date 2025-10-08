import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const mockBookings = [
    { id: 'RES-001', status: 'Confirmed', date: 'July 30, 2025', shift: 'Day', guests: 5, paymentStatus: 'Paid', totalAmount: 7500.00 },
    { id: 'RES-002', status: 'Pending', date: 'August 15, 2025', shift: 'Night', guests: 10, paymentStatus: 'Unpaid', totalAmount: 8000.00 }
];

const BookingCard = ({ booking }) => {
  const router = useRouter();

  const getShiftIcon = (shift) => {
    return shift === 'Day' ? 'sun-o' : 'moon-o';
  };

  return (
    <View style={styles.cardContainer}>
      
      <View style={styles.cardTopRow}>
        <Text style={styles.cardTypeText}>Booking</Text>
        <FontAwesome name="star-o" size={18} color="#A9B2C3" /> 
      </View>

      <Text style={styles.cardTitle}>Reservation #{booking.id}</Text>
      
      <View style={styles.metadataContainer}>
        <View style={styles.metadataItem}>
          <FontAwesome name="calendar" size={14} color="#A9B2C3" />
          <Text style={styles.metadataText}>{booking.date}</Text>
        </View>
        <View style={styles.metadataItem}>
          <FontAwesome name="users" size={14} color="#A9B2C3" />
          <Text style={styles.metadataText}>{booking.guests} Guests</Text>
        </View>
        <View style={styles.metadataItem}>
          <FontAwesome name={getShiftIcon(booking.shift)} size={14} color="#A9B2C3" />
          <Text style={styles.metadataText}>{booking.shift} Shift</Text>
        </View>
      </View>
      
      <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₱{booking.totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.cardBottomRow}>
        <View style={[styles.statusPill, booking.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending]}>
            <Text style={styles.statusPillText}>{booking.status}</Text>
        </View>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/digitalKey')}>
            <FontAwesome name="qrcode" size={16} color="#FFFFFF" style={{ marginRight: 8 }}/>
            <Text style={styles.actionButtonText}>View Digital Key</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function BookingsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Bookings</Text>
            </View>
            <FlatList 
                data={mockBookings} 
                renderItem={({ item }) => <BookingCard booking={item} />} 
                keyExtractor={item => item.id} 
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }} 
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
  }, 
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 10 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#0D1117', 
  },
  
  cardContainer: {
    backgroundColor: '#1C212B', 
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTypeText: {
    color: '#A9B2C3', 
    fontSize: 14,
    fontWeight: '500',
  },
  cardTitle: {
    color: '#F0F6FC', 
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    color: '#A9B2C3',
    fontSize: 13,
    marginLeft: 6,
  },
  totalSection: {
    marginBottom: 16,
  },
  totalLabel: {
    color: '#A9B2C3',
    fontSize: 14,
    marginBottom: 4,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#30363D', 
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusPill: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#30363D', 
  },
  statusConfirmed: {
    backgroundColor: 'rgba(46, 160, 67, 0.2)', 
  },
  statusPending: {
    backgroundColor: 'rgba(247, 184, 9, 0.2)', 
  },
  statusPillText: {
    color: '#A9B2C3',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#30363D',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});