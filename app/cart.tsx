import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useFeatureFlags } from '@/context/FeatureFlagContext';

const initialCartItems = [
    { id: '1', name: 'Pork Sisig', price: 250, quantity: 1 },
    { id: '2', name: 'Halo-Halo', price: 150, quantity: 2 },
];

const CartItem = ({ item, onDelete, disabled = false }) => (
  <View style={styles.cartItem}>
    <View>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
    </View>
    <View style={styles.quantityControl}>
      <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)} disabled={disabled}>
        <FontAwesome name="trash-o" size={24} color={disabled ? "#CCC" : "#E74C3C"} />
      </TouchableOpacity>
    </View>
  </View>
);

const DisabledOverlay = () => (
    <View style={styles.disabledOverlay}>
        <Ionicons name="lock-closed-outline" size={48} color="rgba(0,0,0,0.6)" />
        <Text style={styles.disabledText}>Food ordering is temporarily unavailable.</Text>
    </View>
);

export default function CartScreen() {
  const router = useRouter();
  const { flags, isLoading } = useFeatureFlags();

  const [cartItems, setCartItems] = useState(initialCartItems);

  const isFoodOrderingEnabled = flags?.food_ordering_enabled ?? false;

  const handleDeleteItem = (itemId) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
        Alert.alert("Empty Cart", "Please add items to your cart before placing an order.");
        return;
    }
    Alert.alert("Order Placed!", "Your food is on the way.");
    router.back();
  };

  if (isLoading) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centered}><ActivityIndicator size="large" color="#FF6B6B" /></View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{width: 28}} />
      </View>

      <ScrollView>
        <View style={styles.content}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            {cartItems.length > 0 ? (
                cartItems.map(item => (
                    <CartItem key={item.id} item={item} onDelete={handleDeleteItem} disabled={!isFoodOrderingEnabled} />
                ))
            ) : (
                <Text style={styles.emptyCartText}>Your cart is empty.</Text>
            )}

            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>₱{totalAmount.toFixed(2)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Deliver To:</Text>
                <TextInput style={styles.input} defaultValue="Cottage 3" editable={isFoodOrderingEnabled} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Add a note:</Text>
                <TextInput style={styles.input} placeholder="e.g., no onions please" editable={isFoodOrderingEnabled}/>
            </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.confirmButton, !isFoodOrderingEnabled && styles.confirmButtonDisabled]} onPress={handlePlaceOrder} disabled={!isFoodOrderingEnabled}>
          <Text style={styles.confirmButtonText}>Place Order & Charge to Room</Text>
        </TouchableOpacity>
      </View>
      {!isFoodOrderingEnabled && <DisabledOverlay />}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 150 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10
  },
  itemName: { fontSize: 17, fontWeight: '600' },
  itemPrice: { fontSize: 14, color: 'gray', marginTop: 4 },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  itemQuantity: { fontSize: 16, marginHorizontal: 15, fontWeight: '500' },
  deleteButton: { padding: 5 },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginVertical: 40,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  totalLabel: { fontSize: 18, color: 'gray' },
  totalAmount: { fontSize: 18, fontWeight: 'bold' },
  inputContainer: { marginTop: 20 },
  label: { fontSize: 16, color: 'gray', marginBottom: 5 },
  input: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center'
  },
  confirmButtonDisabled: {
    backgroundColor: '#D3D3D3'
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
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
});
