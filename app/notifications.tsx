import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const notifications = [
  { id: '1', type: 'booking_confirmed', title: 'Booking Confirmed!', message: 'Your booking for July 30, 2025 has been confirmed.', date: '2 days ago', isRead: false },
  { id: '2', type: 'points_earned', title: 'Points Earned!', message: 'You earned +100 points from your recent stay.', date: '3 days ago', isRead: false },
  { id: '3', type: 'broadcast', title: 'Pool Maintenance', message: 'The main pool will be closed for maintenance tomorrow from 8am to 10am.', date: '5 days ago', isRead: true },
];

const getIconForType = (type) => {
    switch (type) {
        case 'booking_confirmed': return { name: 'calendar-check-o', color: '#27AE60' };
        case 'points_earned': return { name: 'plus-circle', color: '#007AFF' };
        case 'broadcast': return { name: 'bullhorn', color: '#F39C12' };
        default: return { name: 'bell', color: 'gray' };
    }
}

const NotificationItem = ({ item }) => {
    const icon = getIconForType(item.type);
    return (
        <View style={[styles.notificationItem, !item.isRead && styles.unread]}>
            <FontAwesome name={icon.name} size={24} color={icon.color} style={styles.icon} />
            <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </View>
    );
};

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity onPress={() => router.back()}><Ionicons name="close-circle" size={28} color="#C7C7CD" /></TouchableOpacity>
        </View>
        <FlatList
            data={notifications}
            renderItem={({ item }) => <NotificationItem item={item} />}
            keyExtractor={item => item.id}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    notificationItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
    unread: { backgroundColor: '#E9F7EF' },
    icon: { marginRight: 15, alignSelf: 'center' },
    details: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold' },
    message: { fontSize: 14, color: '#555', marginVertical: 4 },
    date: { fontSize: 12, color: 'gray' },
});