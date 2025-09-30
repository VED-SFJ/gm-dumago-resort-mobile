import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Image, ImageBackground, Linking } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CategoryPill = ({ icon, text, onPress }) => (
    <TouchableOpacity style={styles.pillButton} onPress={onPress}>
        <Ionicons name={icon} size={18} color="#333" />
        <Text style={styles.pillText}>{text}</Text>
    </TouchableOpacity>
);

export default function HomeScreen() {
    const router = useRouter();
    const customerName = "Jameel"; 
    const resortPhoneNumber = "+639178620673"; 

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
                    <Text style={styles.titleText}>Hello, Jameel!</Text>
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
                    <CategoryPill icon="fast-food-outline" text="Order Food" onPress={() => router.push('/menu')} />
                    <CategoryPill icon="map-outline" text="Resort Map" onPress={() => router.push('/map')} />
                    <CategoryPill icon="qr-code-outline" text="Digital Key" onPress={() => router.push('/digitalKey')} />
                    
                    <CategoryPill 
                        icon="call-outline" 
                        text="Call Desk" 
                        onPress={() => Linking.openURL(`tel:${resortPhoneNumber}`)} 
                    />
                    
                    <CategoryPill icon="sunny-outline" text="Activities" onPress={() => router.push('/activities')} />
                </ScrollView>

                <View style={styles.featuredContainer}>
                    <Text style={styles.sectionTitle}>Your Booking</Text>
                    <TouchableOpacity style={styles.featuredCard} onPress={() => router.push('/(tabs)/bookings')}>
                        <ImageBackground 
                            source={require('../../assets/images/516301867_1162325265912740_158239957098605253_n.jpg')} 
                            style={styles.featuredImage}
                            imageStyle={{ borderRadius: 20 }}
                        >
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={14} color="#333" />
                                <Text style={styles.ratingText}>Confirmed</Text>
                            </View>
                             <TouchableOpacity style={styles.arrowButton}>
                                <Ionicons name="arrow-forward" size={20} color="black" />
                            </TouchableOpacity>
                            <View style={styles.featuredTextContainer}>
                                <Text style={styles.featuredLocation}>Your Upcoming Stay</Text>
                                <Text style={styles.featuredTitle}>Check-in: June 22, 2025</Text>
                            </View>
                        </ImageBackground>
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
    pillText: { marginLeft: 5, fontWeight: '500' },
    featuredContainer: { marginTop: 30, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    featuredCard: { height: 400, borderRadius: 20, backgroundColor: '#EFEFEF' },
    featuredImage: { flex: 1, justifyContent: 'space-between', padding: 15 },
    ratingBadge: { position: 'absolute', top: 15, right: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 },
    ratingText: { marginLeft: 5, fontWeight: '600' },
    arrowButton: { position: 'absolute', bottom: 15, right: 15, backgroundColor: 'white', padding: 10, borderRadius: 20 },
    featuredTextContainer: { position: 'absolute', bottom: 15, left: 15 },
    featuredLocation: { color: 'white', fontWeight: '500' },
    featuredTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
});