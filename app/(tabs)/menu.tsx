import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { useFeatureFlags } from '@/context/FeatureFlagContext';

const menuData = {
  Meals: [
    { id: '1', name: 'Spicy Noodles', price: 1500, image: require('../../assets/images/spic-noodles-removebg-preview.png') },
    { id: '2', name: 'Shrimp Pasta', price: 1800, image: require('../../assets/images/shrimp-pasta-removebg-preview.png') },
    { id: '3', name: 'Vegetable Curry', price: 1200, image: require('../../assets/images/vagetable-curr-removebg-preview.png') },
    { id: '4', name: 'Burger Meal', price: 1200, image: require('../../assets/images/burger.png') },
  ],
  Sides: [
    { id: 's1', name: 'Fried Plantain', price: 300, image: require('../../assets/images/fried-plantain-removebg-preview.png') },
    { id: 's2', name: 'Coleslaw', price: 800, image: require('../../assets/images/coleslaw.png') },
  ],
  Snacks: [
    { id: 'k1', name: 'French Fries', price: 150, image: require('../../assets/images/french_fries-removebg-preview.png') },
    { id: 'k2', name: 'Chicken Wings', price: 350, image: require('../../assets/images/chicken-wings-removebg-preview.png') },
  ],
  Drinks: [
    { id: 'd1', name: 'Iced Tea', price: 120, image: require('../../assets/images/iced-tea.png') },
    { id: 'd2', name: 'Mango Shake', price: 180, image: require('../../assets/images/mango-shake-removebg-preview.png') },
  ]
};

const MenuItemCard = ({ item, disabled = false }) => {
    const router = useRouter();
    const handlePress = () => {
        if (!disabled) {
            router.push({ pathname: '/productDetail', params: { id: item.id }});
        }
    };
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handlePress} disabled={disabled}>
            <Image source={item.image} style={styles.itemImage} />
            <TouchableOpacity style={styles.favoriteButton} disabled={disabled}>
                <Ionicons name="heart-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
        </TouchableOpacity>
    );
};

const DisabledOverlay = () => (
    <View style={styles.disabledOverlay}>
        <Ionicons name="lock-closed-outline" size={48} color="rgba(0,0,0,0.6)" />
        <Text style={styles.disabledText}>Food ordering is temporarily unavailable.</Text>
        <Text style={styles.disabledSubText}>Please check back later.</Text>
    </View>
);

export default function MenuScreen() {
  const router = useRouter();
  const { flags, isLoading } = useFeatureFlags();
  const [selectedCategory, setSelectedCategory] = useState('Meals');
  const categories = ['Meals', 'Sides', 'Snacks', 'Drinks'];

  const isFoodOrderingEnabled = flags?.food_ordering_enabled ?? false;

  if (isLoading) {
      return (
          <SafeAreaView style={styles.container}>
              <View style={styles.centered}>
                  <ActivityIndicator size="large" color="#FF6B6B" />
              </View>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Menu</Text>
        <TouchableOpacity onPress={() => router.push('/cart')} disabled={!isFoodOrderingEnabled}>
            <FontAwesome name="shopping-cart" size={24} color={isFoodOrderingEnabled ? "#333" : "#CCC"} />
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={[styles.categoryButton, selectedCategory === category && styles.activeCategory]}
                    onPress={() => setSelectedCategory(category)}
                    disabled={!isFoodOrderingEnabled}
                >
                    <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategoryText, !isFoodOrderingEnabled && styles.disabledCategoryText]}>
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      <FlatList
        data={menuData[selectedCategory]}
        renderItem={({ item }) => <MenuItemCard item={item} disabled={!isFoodOrderingEnabled} />}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      {!isFoodOrderingEnabled && <DisabledOverlay />}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  categoryContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10, backgroundColor: '#F0F2F5' },
  activeCategory: { backgroundColor: '#FF6B6B' },
  categoryText: { color: '#333', fontWeight: '500' },
  activeCategoryText: { color: 'white' },
  disabledCategoryText: { color: '#AAA' },
  listContainer: { paddingHorizontal: 15, paddingBottom: 100 },
  cardContainer: { flex: 1, margin: 8, backgroundColor: '#F9F9F9', borderRadius: 20, padding: 15, alignItems: 'center' },
  itemImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  favoriteButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'white', padding: 8, borderRadius: 15 },
  itemName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  itemPrice: { fontSize: 14, color: '#FF6B6B', fontWeight: '600', marginTop: 5 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disabledText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)',
    textAlign: 'center',
  },
  disabledSubText: {
      marginTop: 4,
      fontSize: 14,
      color: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
  }
});
