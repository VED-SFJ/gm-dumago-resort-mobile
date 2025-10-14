import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Alert, ScrollView, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getMyReservations } from '@/api/reservations';
import { Reservation } from '@/models/api';
import { useAuth } from '@/context/AuthContext'; // ** ADDED: Import useAuth to get user data **

// Get screen width for responsive sizing
const { width } = Dimensions.get('window');

// --- Type and Constant Definitions ---

type PaymentStatus = Reservation['payment_status'];
type FilterKey = PaymentStatus | 'all';

const FILTER_OPTIONS: { key: FilterKey, label: string }[] = [
    { key: 'all', label: 'All Bookings' },
    { key: 'downpayment_paid', label: 'Confirmed' },
    { key: 'downpayment_pending', label: 'Pending Payment' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'expired', label: 'Expired' },
    { key: 'paid', label: 'Fully Paid' },
];

// --- Helper Functions for Styling and Formatting ---

const getStatusStyles = (paymentStatus: PaymentStatus) => {
  switch (paymentStatus) {
    case 'paid':
    case 'downpayment_paid':
      return { pill: styles.statusConfirmed, text: { color: '#0FFF50' }, label: 'Confirmed' };
    case 'downpayment_pending':
      return { pill: styles.statusPending, text: { color: '#F2994A' }, label: 'Pending Downpayment' };
    case 'cancelled':
    case 'expired':
    case 'refunded':
      return { pill: styles.statusCancelled, text: { color: '#EB5757' }, label: 'Cancelled / Expired' };
    default:
      return { pill: {}, text: {}, label: paymentStatus };
  }
};

const getShiftIcon = (shift: string) => {
    return shift.toLowerCase() === 'day' ? 'sun-o' : 'moon-o';
};

const formatDate = (dateValue: any) => {
    try {
        const dateString = typeof dateValue === 'object' && dateValue.$date ? dateValue.$date : dateValue;
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        console.error("Date formatting error:", e);
        return 'Invalid Date';
    }
}

const SHIFT_DOWNPAYMENTS: Record<string, number> = {
  'day': 1000,
  'overnight': 1000,
  '20-hours': 2000,
};

// --- Filter Pills Component ---

interface FilterPillsProps {
    currentFilter: FilterKey;
    onSelectFilter: (key: FilterKey) => void;
}

const FilterPills = ({ currentFilter, onSelectFilter }: FilterPillsProps) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollViewStyle}
            contentContainerStyle={styles.filterPillsContainer}
        >
            {FILTER_OPTIONS.map(({ key, label }) => {
                const isActive = key === currentFilter;
                return (
                    <TouchableOpacity
                        key={key}
                        style={[styles.filterPill, isActive ? styles.filterPillActive : styles.filterPillInactive]}
                        onPress={() => onSelectFilter(key)}
                    >
                        <Text style={[styles.filterPillText, isActive ? styles.filterPillTextActive : styles.filterPillTextInactive]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};


// --- Booking Card Component ---

const BookingCard = ({ booking, username }: { booking: Reservation, username: string }) => {
  const router = useRouter();
  const paymentStatus = booking.payment_status || 'downpayment_pending';
  const { pill, text, label } = getStatusStyles(paymentStatus);
  const reservationId = booking.id || booking._id || 'NO-ID';

  const downpaymentRequired = SHIFT_DOWNPAYMENTS[booking.shift_type] || 0;
  const remainingAmount = Math.max((booking.total_price || 0) - downpaymentRequired, 0);

  const handlePayNow = () => {
    Alert.alert(
      "Payment Information",
      "To complete your booking, please visit our official website to make a payment.",
      [{ text: "OK" }]
    );
  };

  const handleViewDigitalKey = () => {
    // ** MODIFIED: Pass dynamic data to the digital key screen **
    router.push({
        pathname: '/digitalKey',
        params: {
            reservationId: reservationId,
            username: username
        }
    });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardTypeText}>Booking</Text>
        <FontAwesome name="star-o" size={18} color="#A9B2C3" />
      </View>

      <Text style={styles.cardTitle}>Reservation #{reservationId.slice(-8).toUpperCase()}</Text>

      <View style={styles.metadataContainer}>
        <View style={styles.metadataItem}>
          <FontAwesome name="calendar" size={14} color="#A9B2C3" />
          <Text style={styles.metadataText}>{formatDate(booking.reservation_date)}</Text>
        </View>
        <View style={styles.metadataItem}>
          <FontAwesome name="users" size={14} color="#A9B2C3" />
          <Text style={styles.metadataText}>{booking.number_of_guests} Guests</Text>
        </View>
        <View style={styles.metadataItem}>
          <FontAwesome name={getShiftIcon(booking.shift_type)} size={14} color="#A9B2C3" />
          <Text style={styles.metadataText}>{booking.shift_type} Shift</Text>
        </View>
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>₱{(booking.total_price || 0).toFixed(2)}</Text>

        {paymentStatus === 'downpayment_paid' && (
          <View style={styles.remainingBigContainer}>
            <Text style={styles.remainingBigLabel}>Remaining to Pay</Text>
            <Text style={styles.remainingBigAmount}>₱{remainingAmount.toFixed(2)}</Text>
          </View>
        )}
      </View>

      <View style={styles.separator} />

      <View style={styles.cardBottomRow}>
        <View style={[styles.statusPill, pill]}>
          <Text style={[styles.statusPillText, text]}>{label}</Text>
        </View>

        {booking.status === 'confirmed' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleViewDigitalKey}>
            <FontAwesome name="qrcode" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>View Digital Key</Text>
          </TouchableOpacity>
        )}

        {paymentStatus === 'downpayment_pending' && (
          <TouchableOpacity style={[styles.actionButton, styles.payButton]} onPress={handlePayNow}>
            <FontAwesome name="credit-card" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// --- Main Screen Component ---
export default function BookingsScreen() {
    const [allBookings, setAllBookings] = useState<Reservation[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterKey>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // ** ADDED: Get the user object **

    const fetchBookings = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await getMyReservations();
            const validPaymentStatuses = FILTER_OPTIONS.filter(o => o.key !== 'all').map(o => o.key);
            const cleanData = data.filter(b => validPaymentStatuses.includes(b.payment_status));
            setAllBookings(cleanData);
        } catch (err) {
            setError("Failed to load your bookings. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBookings();
        }, [fetchBookings])
    );

    const filteredBookings = useMemo(() => {
        if (currentFilter === 'all') {
            return allBookings;
        }
        return allBookings.filter(booking =>
            booking.payment_status === currentFilter
        );
    }, [allBookings, currentFilter]);

    const selectFilter = (key: FilterKey) => {
        setCurrentFilter(key);
    };

    const renderContent = () => {
        if (isLoading && allBookings.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#1C212B" />
                    <Text style={styles.infoText}>Loading your bookings...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.infoText}>{error}</Text>
                    <TouchableOpacity onPress={fetchBookings} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (filteredBookings.length === 0 && !isLoading) {
            const currentLabel = FILTER_OPTIONS.find(o => o.key === currentFilter)?.label || 'Filter';
            const isAllFilter = currentFilter === 'all';

            return (
                <View style={styles.emptyContainerWrapper}>
                    <View style={styles.emptyContainer}>
                        <FontAwesome
                            name={isAllFilter ? "calendar-plus-o" : "search-minus"}
                            size={width * 0.2}
                            color="#A9B2C3"
                            style={{ marginBottom: 20 }}
                        />
                        <Text style={styles.emptyTitle}>
                            {isAllFilter ? "No Bookings Yet!" : "Nothing to see here."}
                        </Text>
                        <Text style={styles.emptyText}>
                            {isAllFilter
                                ? "Looks like you haven't made any reservations. Start planning your getaway now!"
                                : `Your bookings under the "${currentLabel}" status will appear here.`
                            }
                        </Text>
                        {!isAllFilter && (
                            <TouchableOpacity onPress={() => selectFilter('all')} style={styles.viewAllButton}>
                                <Text style={styles.viewAllButtonText}>View All Bookings</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredBookings}
                renderItem={({ item }) => <BookingCard booking={item} username={user?.username || 'Guest'} />}
                keyExtractor={item => item.id || item._id || Math.random().toString()}
                contentContainerStyle={{ paddingVertical: 10, paddingBottom: 80 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchBookings} tintColor="#1C212B" />
                }
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Bookings</Text>
            </View>

            <FilterPills currentFilter={currentFilter} onSelectFilter={selectFilter} />

            {renderContent()}
        </SafeAreaView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0D1117' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyContainerWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.08,
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    minHeight: width * 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D1117',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '80%',
  },
  viewAllButton: {
    backgroundColor: '#1C212B',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  viewAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  infoText: { fontSize: 16, color: '#666', textAlign: 'center' },
  retryButton: { marginTop: 20, backgroundColor: '#1C212B', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  retryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  scrollViewStyle: {
    flexGrow: 0,
  },
  filterPillsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10
  },
  filterPill: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#1C212B',
    borderColor: '#1C212B',
  },
  filterPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E4E8',
  },
  filterPillText: {
    fontSize: 15,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillTextInactive: {
    color: '#333333',
  },

  // --- Booking Card Styles ---
  cardContainer: { backgroundColor: '#1C212B', borderRadius: 20, padding: 20, marginHorizontal: 15, marginBottom: 18 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTypeText: { color: '#A9B2C3', fontSize: 16, fontWeight: '500' },
  cardTitle: { color: '#F0F6FC', fontSize: 22, fontWeight: '600', marginBottom: 16 },
  metadataContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  metadataItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 5 },
  metadataText: { color: '#A9B2C3', fontSize: 14, marginLeft: 6 },
  totalSection: { marginBottom: 16 },
  totalLabel: { color: '#FFFFFF', fontSize: 14, marginBottom: 4 },
  totalAmount: { color: '#0BDA51', fontSize: 24, fontWeight: 'bold' },
  separator: { height: 1, backgroundColor: '#30363D', marginVertical: 10 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, minHeight: 40 },
  statusPill: { borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  statusConfirmed: { backgroundColor: 'rgba(39, 174, 96, 0.15)' },
  statusPending: { backgroundColor: 'rgba(242, 153, 74, 0.15)' },
  statusCancelled: { backgroundColor: 'rgba(235, 87, 87, 0.15)' },
  statusPillText: { fontSize: 15, fontWeight: '600' },
  actionButton: { backgroundColor: '#30363D', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  payButton: { backgroundColor: '#007AFF' },
  actionButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  remainingBigContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#30363D',
    borderRadius: 16,
    alignItems: 'center',
  },
  remainingBigLabel: {
    color: '#A9B2C3',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  remainingBigAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
