import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const locations = [
    {
        id: '1',
        name: 'GM Dumago Resort',
        type: 'Main Venue',
        image: require('../assets/images/resort-photo.png'),
        coordinates: { latitude: 14.735209, longitude: 121.127356 }
    },
    {
        id: '2',
        name: 'Nearby Restaurant',
        type: 'Local Dining',
        image: require('../assets/images/resort-photo.png'), 
        coordinates: { latitude: 14.736, longitude: 121.128 }
    },
];

const LocationCard = ({ item }) => (
    <View style={styles.card}>
        <Image source={item.image} style={styles.cardImage} />
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardType}>{item.type}</Text>
        </View>
        <TouchableOpacity style={styles.cardFavorite}>
            <Ionicons name="heart-outline" size={24} color="#555" />
        </TouchableOpacity>
    </View>
);

export default function MapScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 14.735209,
          longitude: 121.127356,
          latitudeDelta: 0.01, 
          longitudeDelta: 0.01,
        }}
        mapType="standard"
      >
        {locations.map(location => (
            <Marker
                key={location.id}
                coordinate={location.coordinates}
                title={location.name}
            >
                <View style={styles.marker}>
                    <FontAwesome name="bed" size={20} color="white" />
                </View>
            </Marker>
        ))}
      </MapView>

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GM Dumago Private Resort</Text>
      </View>

      <TouchableOpacity style={styles.filtersButton}>
        <Text style={styles.filtersText}>Filters</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
              {locations.map(item => <LocationCard key={item.id} item={item} />)}
          </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, 
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  filtersText: {
    fontWeight: '500',
  },
  marker: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardType: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  cardFavorite: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 5,
  }
});