import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SettingsRow = ({ icon, iconBgColor, text, hasSwitch, switchValue, onSwitchChange }) => (
    <TouchableOpacity style={styles.row} disabled={hasSwitch}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Ionicons name={icon} size={20} color="white" />
        </View>
        <Text style={styles.rowText}>{text}</Text>
        <View style={{ flex: 1 }} />
        {hasSwitch ? (
            <Switch 
                value={switchValue} 
                onValue-change={onSwitchChange} 
                trackColor={{ false: "#E9E9EA", true: "#34C759" }}
                thumbColor={"#FFFFFF"}
            />
        ) : (
            <Ionicons name="chevron-forward" size={22} color="#C7C7CD" />
        )}
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isDarkMode, setDarkMode] = useState(false); 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* 
                <View style={styles.section}>
                    <SettingsRow
                        icon="moon"
                        iconBgColor="#8E8E93"
                        text="Dark Mode"
                        hasSwitch={true}
                        switchValue={isDarkMode}
                        onSwitchChange={setDarkMode}
                    />
                </View>
                */}

                <Text style={styles.sectionHeader}>Notifications</Text>
                <View style={styles.section}>
                    <SettingsRow
                        icon="notifications-outline"
                        iconBgColor="#34C759"
                        text="Notifications"
                        hasSwitch={true}
                        switchValue={notificationsEnabled}
                        onSwitchChange={setNotificationsEnabled}
                    />
                </View>

                <Text style={styles.sectionHeader}>Support</Text>
                <View style={styles.section}>
                    <SettingsRow icon="help-circle-outline" iconBgColor="#007AFF" text="Help & Support" />
                    <SettingsRow icon="shield-checkmark-outline" iconBgColor="#5856D6" text="Privacy Policy" />
                    <SettingsRow icon="information-circle-outline" iconBgColor="#FF9500" text="About Us" />
                </View>
                
                <Text style={styles.footerText}>App ver 1.0.0</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: '600' 
    },
    content: { 
        padding: 15 
    },
    sectionHeader: {
        fontSize: 14,
        color: 'gray',
        marginHorizontal: 15,
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
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
    footerText: {
        textAlign: 'center',
        color: 'gray',
        marginVertical: 20,
    },
});