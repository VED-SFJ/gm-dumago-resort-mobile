import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const mockBookings = [
    { id: 'RES-001', status: 'Confirmed', date: 'July 30, 2025', shift: 'Day', guests: 5, paymentStatus: 'Paid', totalAmount: 7500.00 },
    { id: 'RES-002', status: 'Pending', date: 'August 15, 2025', shift: 'Night', guests: 10, paymentStatus: 'Unpaid', totalAmount: 8000.00 }
];

const BookingCard = ({ booking }) => {
  const router = useRouter();
  return (
    <View style={styles.cardShadow}>
      <LinearGradient colors={['#1DD3B0', '#007AFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardContainer}>
        <View style={styles.headerRow}><View style={{ flexDirection: 'row', alignItems: 'center' }}><FontAwesome name="file-text-o" size={20} color="white" /><View style={{ marginLeft: 10 }}><Text style={styles.headerTitle}>Booking</Text><Text style={styles.headerId}>#{booking.id}</Text></View></View><View style={styles.statusPill}><Text style={styles.statusText}>{booking.status.toUpperCase()}</Text></View></View>
        <View style={styles.detailsSection}><View style={styles.detailRow}><FontAwesome name="calendar" size={16} color="#FFF" style={{ opacity: 0.8 }} /><Text style={styles.detailText}>{`Date: ${booking.date}`}</Text></View><View style={styles.detailRow}><FontAwesome name="sun-o" size={16} color="#FFF" style={{ opacity: 0.8 }} /><Text style={styles.detailText}>{`Shift: ${booking.shift}`}</Text></View><View style={styles.detailRow}><FontAwesome name="users" size={16} color="#FFF" style={{ opacity: 0.8 }} /><Text style={styles.detailText}>{`Guests: ${booking.guests}`}</Text></View></View>
        <View style={styles.separator} />
        <View style={styles.totalSection}><Text style={styles.totalLabel}>Total Amount:</Text><Text style={styles.totalAmount}>₱{booking.totalAmount.toFixed(2)}</Text></View>
        
        <TouchableOpacity style={styles.passButton} onPress={() => router.push('/digitalKey')}>
            <FontAwesome name="qrcode" size={20} color="#007AFF" />
            <Text style={styles.passButtonText}>View Digital Key</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default function BookingsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}><Text style={styles.title}>Your Bookings</Text></View>
            <FlatList data={mockBookings} renderItem={({ item }) => <BookingCard booking={item} />} keyExtractor={item => item.id} contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' }, header: { paddingHorizontal: 15, paddingTop: 20, paddingBottom: 10 },
    title: { fontSize: 26, fontWeight: 'bold' }, cardShadow: { borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10, marginBottom: 20, marginHorizontal: 15 },
    cardContainer: { borderRadius: 20, padding: 20, overflow: 'hidden' }, headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    headerTitle: { color: 'white', fontSize: 16, opacity: 0.9 }, headerId: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    statusPill: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 15, paddingVertical: 5, paddingHorizontal: 12 }, statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    detailsSection: { marginBottom: 10 }, detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }, detailText: { color: 'white', fontSize: 15, marginLeft: 10 },
    separator: { borderStyle: 'dotted', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)', marginVertical: 15 },
    totalSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 }, totalLabel: { color: 'white', fontSize: 16 },
    totalAmount: { color: 'white', fontSize: 32, fontWeight: 'bold' }, passButton: { backgroundColor: 'white', borderRadius: 15, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    passButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});