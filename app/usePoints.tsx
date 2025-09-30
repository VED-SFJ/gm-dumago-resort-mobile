import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

export default function UsePointsScreen() {
    const router = useRouter();
    const customerId = "CUST-12345"; 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Use Points</Text>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name="close-circle" size={28} color="#C7C7CD" /></TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.instructions}>Present this QR code to the cashier to apply a discount using your points.</Text>
                <View style={styles.qrContainer}>
                    <QRCode value={`use-points:${customerId}`} size={250} />
                </View>
                <Text style={styles.customerIdText}>Customer ID: {customerId}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    instructions: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 30 },
    qrContainer: { padding: 20, backgroundColor: 'white', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    customerIdText: { fontSize: 18, fontWeight: 'bold', marginTop: 30 },
});