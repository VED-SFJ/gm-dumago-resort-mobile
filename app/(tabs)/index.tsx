import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Image, ImageBackground, Linking, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getMyReservations } from '@/api/reservations';
import { Reservation } from '@/models/api';
import { useFeatureFlags } from '@/context/FeatureFlagContext';

// --- Helper Functions ---
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

const getStatusLabel = (paymentStatus: Reservation['payment_status'] | undefined): string => {
    switch (paymentStatus) {
        case 'paid':
        case 'downpayment_paid':
            return 'Confirmed';
        case 'downpayment_pending':
            return 'Pending Payment';
        case 'cancelled':
        case 'expired':
        case 'refunded':
            return 'Cancelled / Expired';
        default:
            return 'Pending Payment';
    }
};


const CategoryPill = ({ icon, text, onPress, disabled = false }) => (
    <TouchableOpacity style={[styles.pillButton, disabled && styles.pillButtonDisabled]} onPress={onPress} disabled={disabled}>
        <Ionicons name={icon} size={18} color={disabled ? '#999' : '#333'} />
        <Text style={[styles.pillText, disabled && styles.pillTextDisabled]}>{text}</Text>
    </TouchableOpacity>
);

export default function HomeScreen() {
    const router = useRouter();
    const { user, isAdmin } = useAuth();
    const { flags } = useFeatureFlags();
    const resortPhoneNumber = "+639178620673";
    const [upcomingBooking, setUpcomingBooking] = useState<Reservation | null>(null);
    const [isLoadingBooking, setIsLoadingBooking] = useState(true);

    const isFoodOrderingEnabled = flags?.food_ordering_enabled ?? false;

    useFocusEffect(
        useCallback(() => {
            if (isAdmin) {
                console.warn("Admin detected trying to access guest home. Redirecting to admin area.");
                // Immediately replace the stack with the admin route group
                router.replace('/(admin)');
            }
        }, [isAdmin, router])
    );

    const fetchUpcomingBooking = useCallback(async () => {
        setIsLoadingBooking(true);
        try {
            const allBookings: Reservation[] = await getMyReservations();
            const now = new Date();

            const futureConfirmedBookings = allBookings
                .filter(b => (b.payment_status === 'paid' || b.payment_status === 'downpayment_paid'))
                .filter(b => {
                    const reservationDate = new Date(b.reservation_date);
                    return reservationDate >= now;
                })
                .sort((a, b) => {
                    const dateA = new Date(a.reservation_date).getTime();
                    const dateB = new Date(b.reservation_date).getTime();
                    return dateA - dateB;
                });

            setUpcomingBooking(futureConfirmedBookings.length > 0 ? futureConfirmedBookings[0] : null);

        } catch (error) {
            console.error("Error fetching upcoming booking:", error);
            setUpcomingBooking(null);
        } finally {
            setIsLoadingBooking(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUpcomingBooking();
        }, [fetchUpcomingBooking])
    );

    const handleDigitalKeyPress = () => {
        if (isLoadingBooking) {
            Alert.alert("Please wait", "Still loading your booking information.");
            return;
        }

        if (upcomingBooking && user) {
            router.push({
                pathname: '/digitalKey',
                params: {
                    reservationId: upcomingBooking.id || upcomingBooking._id,
                    username: user.username,
                },
            });
        } else {
            Alert.alert(
                "No Upcoming Booking",
                "You don't have a confirmed upcoming booking to show a digital key for.",
                [{ text: "OK" }]
            );
        }
    };

    const handleFeaturePress = (featureName: string, path: string) => {
        if (isFoodOrderingEnabled) {
            router.push(path);
        } else {
            Alert.alert("Feature Unavailable", `${featureName} is currently not available. Please check back later.`);
        }
    };

    const greetingName = user?.username || 'Guest';

    const renderFeaturedCardContent = () => {
        if (isLoadingBooking) {
            return (
                <View style={styles.featuredLoading}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            );
        }

        if (upcomingBooking) {
            const checkInDate = formatDate(upcomingBooking.reservation_date);
            const statusLabel = getStatusLabel(upcomingBooking.payment_status);

            return (
                <ImageBackground
                    source={require('../../assets/images/516301867_1162325265912740_158239957098605253_n.jpg')}
                    style={styles.featuredImage}
                    imageStyle={{ borderRadius: 20 }}
                >
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={14} color="#333" />
                        <Text style={styles.ratingText}>{statusLabel}</Text>
                    </View>
                    <TouchableOpacity style={styles.arrowButton}>
                        <Ionicons name="arrow-forward" size={20} color="black" />
                    </TouchableOpacity>
                    <View style={styles.featuredTextContainer}>
                        <Text style={styles.featuredLocation}>Your Upcoming Stay</Text>
                        <Text style={styles.featuredTitle}>Check-in: {checkInDate}</Text>
                    </View>
                </ImageBackground>
            );
        }

        return (
            <View style={styles.featuredEmpty}>
                <Ionicons name="calendar-outline" size={50} color="#333" />
                <Text style={styles.featuredEmptyTitle}>No Upcoming Bookings</Text>
                <Text style={styles.featuredEmptyText}>Tap here to view all your reservations.</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
                        <Image source={require('../../assets/images/profile.jpg')} style={styles.profileImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Hello, {greetingName}!</Text>
                </View>

                <View style={styles.searchContainer}>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="filter" size={20} color="#555" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search resort features..."
                    />
                    <TouchableOpacity style={styles.searchIcon}>
                        <Ionicons name="search" size={20} color="#555" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pillsContainer}
                >
                    <CategoryPill
                        icon="fast-food-outline"
                        text="Order Food"
                        onPress={() => handleFeaturePress("Food ordering", "/menu")}
                        disabled={!isFoodOrderingEnabled}
                    />
                    <CategoryPill icon="map-outline" text="Resort Map" onPress={() => router.push('/map')} />
                    <CategoryPill icon="qr-code-outline" text="Digital Key" onPress={handleDigitalKeyPress} />

                    <CategoryPill
                        icon="call-outline"
                        text="Call Desk"
                        onPress={() => Linking.openURL(`tel:${resortPhoneNumber}`)}
                    />

                    {/* ** MODIFIED: Activities pill now uses the feature flag ** */}
                    <CategoryPill
                        icon="sunny-outline"
                        text="Activities"
                        onPress={() => handleFeaturePress("Activities", "/activities")}
                        disabled={!isFoodOrderingEnabled}
                    />
                </ScrollView>

                <View style={styles.featuredContainer}>
                    <Text style={styles.sectionTitle}>Your Booking</Text>
                    <TouchableOpacity style={styles.featuredCard} onPress={() => router.push('/(tabs)/bookings')}>
                        {renderFeaturedCardContent()}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    scrollContent: { paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
    profileButton: {},
    profileImage: { width: 40, height: 40, borderRadius: 20 },
    notificationButton: { backgroundColor: '#F0F2F5', padding: 8, borderRadius: 20 },
    notificationDot: { position: 'absolute', right: 8, top: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', borderWidth: 1, borderColor: '#F0F2F5' },
    titleContainer: { paddingHorizontal: 20, marginTop: 20 },
    titleText: { fontSize: 32, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 30, paddingHorizontal: 10, marginHorizontal: 20, marginTop: 20 },
    filterButton: { padding: 10 },
    searchInput: { flex: 1, paddingVertical: 15, fontSize: 16, marginLeft: 5 },
    searchIcon: { padding: 10 },
    pillsContainer: { paddingHorizontal: 20, marginTop: 20 },
    pillButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EFEFEF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 10 },
    pillButtonDisabled: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    pillText: { marginLeft: 5, fontWeight: '500' },
    pillTextDisabled: {
        color: '#999',
    },
    featuredContainer: { marginTop: 30, paddingHorizontal: 20 },
    featuredCard: { height: 400, borderRadius: 20, backgroundColor: '#EFEFEF' },
    featuredImage: { flex: 1, justifyContent: 'space-between', padding: 15 },
    ratingBadge: { position: 'absolute', top: 15, right: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 },
    ratingText: { marginLeft: 5, fontWeight: '600' },
    arrowButton: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'white', padding: 10, borderRadius: 20 },
    featuredTextContainer: { position: 'absolute', bottom: 15, left: 15 },
    featuredLocation: { color: 'white', fontWeight: '500' },
    featuredTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    featuredLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    featuredEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
    },
    featuredEmptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333'
    },
    featuredEmptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 5,
    }
});
