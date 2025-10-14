// gm-dumago-resort-mobile/app/(admin)/bookings.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { adminGetAllReservations } from '@/api/admin';
import { Reservation } from '@/models/api';

const { width } = Dimensions.get('window');

type FilterKey = 'all' | 'pending' | 'confirmed' | 'cancelled';

const FILTER_OPTIONS: { key: FilterKey, label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'pending', label: 'Pending' },
    { key: 'cancelled', label: 'Cancelled' },
];

const formatDate = (dateValue: any) => {
    try {
        const dateString = typeof dateValue === 'object' && dateValue.$date ? dateValue.$date : dateValue;
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch { return 'Invalid Date'; }
};

const getStatusStyles = (status: string) => {
    if (status === 'confirmed') return { pill: styles.statusConfirmed, text: { color: '#0FFF50' } }; // Green for confirmed
    if (status === 'pending') return { pill: styles.statusPending, text: { color: '#F2994A' } };   // Orange for pending
    return { pill: styles.statusCancelled, text: { color: '#EB5757' } };                        // Red for cancelled/other
};

const AdminBookingCard = ({ booking }: { booking: Reservation }) => {
    const { pill, text } = getStatusStyles(booking.status);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>ID: { (booking.id || booking._id).slice(-8).toUpperCase() }</Text>
                <View style={[styles.statusPill, pill]}>
                    <Text style={[styles.statusPillText, text]}>{booking.status.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.guestName}>{booking.user?.username || 'Unknown Guest'}</Text>
                <Text style={styles.guestEmail}>{booking.user?.email || 'N/A'}</Text>

                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#A9B2C3" />
                        <Text style={styles.detailText}>{formatDate(booking.reservation_date)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="people-outline" size={16} color="#A9B2C3" />
                        <Text style={styles.detailText}>{booking.number_of_guests} Guests</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#A9B2C3" />
                        <Text style={styles.detailText}>{booking.shift_type} Shift</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={16} color="#A9B2C3" />
                        <Text style={styles.detailText}>₱{booking.total_price.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default function AdminBookingsScreen() {
    const router = useRouter();
    const [allBookings, setAllBookings] = useState<Reservation[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterKey>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await adminGetAllReservations();
            setAllBookings(data);
        } catch (err) {
            setError("Failed to load bookings. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { fetchBookings(); }, [fetchBookings]));

    const filteredBookings = useMemo(() => {
        if (currentFilter === 'all') return allBookings;
        return allBookings.filter(b => b.status === currentFilter);
    }, [allBookings, currentFilter]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#F0F6FC" />
                </TouchableOpacity>
                <Text style={styles.title}>All Bookings</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsContainer} style={styles.scrollViewStyle}>
                {FILTER_OPTIONS.map(({ key, label }) => {
                    const isActive = key === currentFilter;
                    return (
                        <TouchableOpacity
                            key={key}
                            style={[styles.filterPill, isActive ? styles.filterPillActive : styles.filterPillInactive]}
                            onPress={() => setCurrentFilter(key)}
                        >
                            <Text style={[styles.filterPillText, isActive ? styles.filterPillTextActive : styles.filterPillTextInactive]}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {isLoading && allBookings.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#F0F6FC" style={{ marginTop: 50 }} />
                </View>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={filteredBookings}
                    renderItem={({ item }) => <AdminBookingCard booking={item} />}
                    keyExtractor={item => item.id || item._id || Math.random().toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainerWrapper}>
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name={currentFilter === 'all' ? "calendar-outline" : "search-outline"}
                                    size={width * 0.2}
                                    color="#A9B2C3"
                                    style={{ marginBottom: 20 }}
                                />
                                <Text style={styles.emptyTitle}>
                                    {currentFilter === 'all' ? "No Bookings Yet!" : "Nothing to see here."}
                                </Text>
                                <Text style={styles.emptyText}>
                                    No bookings found for the "{FILTER_OPTIONS.find(o => o.key === currentFilter)?.label}" status.
                                </Text>
                            </View>
                        </View>
                    }
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchBookings} tintColor="#F0F6FC" />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D1117' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#1C212B' },
    backButton: { padding: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#F0F6FC' },
    scrollViewStyle: { flexGrow: 0, },
    filterPillsContainer: { paddingHorizontal: 15, paddingVertical: 10, marginBottom: 10 },
    filterPill: { height: 50, paddingHorizontal: 20, borderRadius: 15, marginRight: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', },
    filterPillActive: { backgroundColor: '#007AFF', borderColor: '#007AFF', },
    filterPillInactive: { backgroundColor: '#1C212B', borderColor: '#30363D', },
    filterPillText: { fontSize: 15, fontWeight: '600', },
    filterPillTextActive: { color: '#FFFFFF', },
    filterPillTextInactive: { color: '#A9B2C3', },
    listContainer: { padding: 15, paddingBottom: 50 },
    cardContainer: { backgroundColor: '#1C212B', borderRadius: 20, marginBottom: 18, padding: 20 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#30363D', paddingBottom: 10 },
    cardTitle: { color: '#F0F6FC', fontSize: 18, fontWeight: '600' },
    statusPill: { borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
    statusConfirmed: { backgroundColor: 'rgba(39, 174, 96, 0.15)' },
    statusPending: { backgroundColor: 'rgba(242, 153, 74, 0.15)' },
    statusCancelled: { backgroundColor: 'rgba(235, 87, 87, 0.15)' },
    statusPillText: { fontSize: 13, fontWeight: '600' },
    cardBody: { paddingVertical: 5 },
    guestName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
    guestEmail: { fontSize: 14, color: '#A9B2C3', marginBottom: 15 },
    detailsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    detailItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 10 },
    detailText: { marginLeft: 8, fontSize: 14, color: '#A9B2C3' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#EB5757' },
    emptyContainerWrapper: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 40,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.08,
        backgroundColor: '#1C212B',
        borderRadius: 16,
        minHeight: width * 0.8,
        borderWidth: 1,
        borderColor: '#30363D'
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#F0F6FC',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#A9B2C3',
        textAlign: 'center',
        marginBottom: 20,
        maxWidth: '80%',
    },
});
