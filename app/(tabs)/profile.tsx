import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook

const ProfileButton = ({ icon, iconBgColor, text, onPress, isLogout = false }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Ionicons name={icon} size={20} color="white" />
        </View>
        <Text style={[styles.rowText, isLogout && styles.logoutText]}>{text}</Text>
        <View style={{ flex: 1 }} />
        {!isLogout && <Ionicons name="chevron-forward" size={22} color="#C7C7CD" />}
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth(); // Get user data and logout function

    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Logout",
                    onPress: () => {
                        logout();
                        // After logging out, redirect to the very first screen of the app.
                        // Using 'replace' prevents the user from going back to the profile screen.
                        router.replace('/');
                    }
                }
            ]
        );
    };

    // Display a loading state or a fallback if user data is not yet available
    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileSection}>
                    <Image source={require('../../assets/images/profile.jpg')} style={styles.profileImage} />
                    <View style={styles.profileTextContainer}>
                        {/* Use dynamic data from the user object */}
                        <Text style={styles.profileName}>{user.username}</Text>
                        <Text style={styles.profileSubtitle}>{user.email}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <ProfileButton
                        icon="chatbubbles-outline"
                        iconBgColor="#34C759"
                        text="Chat with Staff"
                        onPress={() => router.push('/chat')}
                    />
                    <ProfileButton
                        icon="map-outline"
                        iconBgColor="#5856D6"
                        text="Resort Map & Info"
                        onPress={() => router.push('/map')}
                    />
                    <ProfileButton
                        icon="settings-outline"
                        iconBgColor="#8E8E93"
                        text="Settings"
                        onPress={() => router.push('/settings')}
                    />
                </View>

                <View style={styles.section}>
                    <ProfileButton
                        icon="log-out-outline"
                        iconBgColor="#FF3B30"
                        text="Logout"
                        isLogout={true}
                        onPress={handleLogout} // Use the new logout handler
                    />
                </View>

                <Text style={styles.footerText}>App ver 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5'
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    content: {
        paddingHorizontal: 15
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        marginVertical: 10,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
    },
    profileSubtitle: {
        fontSize: 14,
        color: 'gray',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EFEFEF',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 15,
    },
    logoutText: {
        color: '#FF3B30',
    },
    footerText: {
        textAlign: 'center',
        color: 'gray',
        marginVertical: 20,
    },
});
