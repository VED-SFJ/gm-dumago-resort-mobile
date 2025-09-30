// app/productDetail.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// --- BAGONG LOGIC DITO ---
// Ang "Master List" ng lahat ng produkto.
// Ang image paths ay pareho sa original code mo.
const allProducts = {
  '1': { id: '1', name: 'Spicy Noodles', price: 1500, image: require('../assets/images/spic-noodles-removebg-preview.png'), description: "Deliciously spicy noodles with fresh vegetables and egg." },
  '2': { id: '2', name: 'Shrimp Pasta', price: 1800, image: require('../assets/images/shrimp-pasta-removebg-preview.png'), description: "Creamy pasta tossed with succulent shrimp and herbs." },
  '3': { id: '3', name: 'Vegetable Curry', price: 1200, image: require('../assets/images/vagetable-curr-removebg-preview.png'), description: "Aromatic vegetable curry served with steamed rice." },
  '4': { id: '4', name: 'Burger Meal', price: 1200, image: require('../assets/images/burger.png'), description: "A classic burger with fries." },
  's1': { id: 's1', name: 'Fried Plantain', price: 300, image: require('../assets/images/fried-plantain-removebg-preview.png'), description: "Sweet and savory fried plantains, a perfect side." },
  's2': { id: 's2', name: 'Coleslaw', price: 800, image: require('../assets/images/coleslaw.png'), description: "Fresh and creamy coleslaw." },
  'k1': { id: 'k1', name: 'French Fries', price: 150, image: require('../assets/images/french_fries-removebg-preview.png'), description: "Crispy golden french fries." },
  'k2': { id: 'k2', name: 'Chicken Wings', price: 350, image: require('../assets/images/chicken-wings-removebg-preview.png'), description: "Juicy and crispy fried chicken pieces." },
  'd1': { id: 'd1', name: 'Iced Tea', price: 120, image: require('../assets/images/iced-tea.png'), description: "Refreshing pitcher of iced tea." },
  'd2': { id: 'd2', name: 'Mango Shake', price: 180, image: require('../assets/images/mango-shake-removebg-preview.png'), description: "Sweet mango shake made with fresh mangoes." },
};

const RecommendedItem = ({ item }) => {
    const router = useRouter();
    return (
        // Ngayon, ipapasa na natin ang 'id' ng recommended item
        <TouchableOpacity style={styles.recommendedItem} onPress={() => router.push({ pathname: '/productDetail', params: { id: item.id }})}>
            <Image source={item.image} style={styles.recommendedImage} />
            <Text style={styles.recommendedName}>{item.name}</Text>
            <Text style={styles.recommendedPrice}>₱{item.price.toFixed(2)}</Text>
        </TouchableOpacity>
    );
};

export default function ProductDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    
    // --- ITO ANG PINAKA-IMPORTANTENG FIX ---
    // Hanapin ang produkto sa ating "master list" gamit ang 'id' na galing sa params.
    const productId = params.id as string || '1'; // Default sa '1' kung walang naipasa
    const product = allProducts[productId];

    if (!product) {
        return <SafeAreaView style={styles.container}><Text>Product not found!</Text></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.imageContainer}>
                    <Image source={product.image} style={styles.mainImage} />
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity>
                    <TouchableOpacity style={styles.favButton}><Ionicons name="heart-outline" size={24} color="red" /></TouchableOpacity>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.price}>₱{product.price.toFixed(2)}</Text>
                    <Text style={styles.description}>
                        {product.description}
                        <Text style={{color: '#FF6B6B'}}> (each serving contains 248 calories)</Text>
                    </Text>

                    <Text style={styles.sectionTitle}>Recommended sides</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <RecommendedItem item={allProducts['s1']} />
                        <RecommendedItem item={allProducts['s2']} />
                        <RecommendedItem item={allProducts['k2']} />
                    </ScrollView>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.quantitySelector}>
                    <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}><FontAwesome name="minus" size={20} color="black" /></TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)}><FontAwesome name="plus" size={20} color="black" /></TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addToCartButton} onPress={() => router.push('/cart')}><Text style={styles.addToCartText}>Add to Cart</Text></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' }, imageContainer: { alignItems: 'center' },
    mainImage: { width: '100%', height: 300 }, backButton: { position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 10, borderRadius: 20 },
    favButton: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 10, borderRadius: 20 }, detailsContainer: { padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold' }, price: { fontSize: 22, color: '#FF6B6B', fontWeight: 'bold', marginVertical: 10 },
    description: { fontSize: 16, color: 'gray', lineHeight: 24 }, sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    recommendedItem: { marginRight: 15, alignItems: 'center' }, recommendedImage: { width: 100, height: 100, borderRadius: 15 },
    recommendedName: { fontWeight: '500', marginTop: 5 }, recommendedPrice: { color: 'gray' },
    footer: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', alignItems: 'center', backgroundColor: 'white' },
    quantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 30, padding: 10, paddingHorizontal: 20 },
    quantityText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20 }, addToCartButton: { flex: 1, backgroundColor: '#FF6B6B', padding: 20, borderRadius: 30, alignItems: 'center', marginLeft: 15 },
    addToCartText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});