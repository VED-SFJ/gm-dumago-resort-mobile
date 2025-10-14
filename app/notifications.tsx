import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getMyNotifications } from '@/api/notifications';
import { Notification } from '@/models/api';

// --- Icon Helper ---
const getIconForType = (type: Notification['type']) => {
    switch (type) {
        case 'reservation_update':
        case 'confirmation':
        case 'payment_complete':
            return { name: 'calendar-check-o', color: '#27AE60' };
        case 'payment_success':
            return { name: 'credit-card', color: '#27AE60' };
        case 'chat':
            return { name: 'comments-o', color: '#2F80ED' };
        case 'cancellation':
        case 'reservation_expired':
            return { name: 'times-circle-o', color: '#EB5757' };
        case 'general':
            return { name: 'bullhorn', color: '#F2994A' };
        default: return { name: 'bell-o', color: '#828282' };
    }
};

// --- Time Ago Helper ---
const timeAgo = (dateString: string): string => {
    try {
        const now = new Date();
        const past = new Date(dateString);
        const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "Just now";
    } catch {
        return "a while ago";
    }
};


// --- Notification Item Component ---
const NotificationItem = ({ item }: { item: Notification }) => {
    const icon = getIconForType(item.type);
    return (
        <View style={[styles.notificationItem, !item.is_read && styles.unread]}>
            <View style={styles.iconContainer}>
                <FontAwesome name={icon.name as any} size={24} color={icon.color} />
            </View>
            <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>{timeAgo(item.created_at)}</Text>
            </View>
        </View>
    );
};


// --- Main Screen Component ---
export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // *** THIS FUNCTION CONTAINS THE FIX ***
  const fetchNotifications = useCallback(async (isInitialLoad = false) => {
    // Prevent fetching if we are already loading or if there are no more pages
    if (isLoading || (!isInitialLoad && !hasMore)) return;

    setIsLoading(true);
    const currentPageToFetch = isInitialLoad ? 1 : page;

    try {
        const newNotifications = await getMyNotifications(currentPageToFetch);

        if (newNotifications.length === 0) {
            setHasMore(false); // No more data to load
        } else {
            // If it's the first load, replace the list. Otherwise, append to it.
            if (isInitialLoad) {
                setNotifications(newNotifications);
            } else {
                setNotifications(prev => [...prev, ...newNotifications]);
            }
            // **THE FIX:** Always set the *next* page number to be fetched.
            setPage(currentPageToFetch + 1);
        }
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, hasMore, page]); // Dependencies are correct

  // Load initial data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
        fetchNotifications(true);
    }, [])
  );

  const renderFooter = () => {
      // Show loading indicator at the bottom only when fetching more pages
      if (!isLoading || page === 1) return null;
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-circle" size={28} color="#C7C7CD" />
            </TouchableOpacity>
        </View>
        <FlatList
            data={notifications}
            renderItem={({ item }) => <NotificationItem item={item} />}
            keyExtractor={(item, index) => `${item.id}-${index}`} // More robust key
            onEndReached={() => fetchNotifications()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={() => (
                !isLoading && (
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="bell-slash-o" size={60} color="#E0E0E0" />
                        <Text style={styles.emptyText}>No Notifications Yet</Text>
                        <Text style={styles.emptySubtext}>Important updates will appear here.</Text>
                    </View>
                )
            )}
        />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    notificationItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
    unread: { backgroundColor: '#E9F7EF', borderLeftWidth: 4, borderLeftColor: '#27AE60' },
    iconContainer: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    details: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
    message: { fontSize: 14, color: '#555', marginVertical: 4, lineHeight: 20 },
    date: { fontSize: 12, color: 'gray', marginTop: 4 },
    emptyContainer: {
        flex: 1,
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
        color: '#828282',
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#BDBDBD',
    },
});
