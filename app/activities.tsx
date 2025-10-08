import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const activities = [
  { id: '1', name: 'Swimming Pool', description: 'Enjoy our main pool, open from 8 AM to 10 PM.', image: require('../assets/images/516301867_1162325265912740_158239957098605253_n.jpg') },
  { id: '2', name: 'Karaoke Room', description: 'Sing your heart out! Available for hourly rental.', image: require('../assets/images/516301867_1162325265912740_158239957098605253_n.jpg') },
  { id: '3', name: 'Billiards', description: 'Challenge your friends to a game of pool.', image: require('../assets/images/516301867_1162325265912740_158239957098605253_n.jpg') },
  { id: '4', name: 'Gym', description: 'Stay fit with our state-of-the-art gym facilities.', image: require('../assets/images/516301867_1162325265912740_158239957098605253_n.jpg') },
  { id: '5', 'name': 'Spa', description: 'Relax and rejuvenate with our luxurious spa treatments.', image: require('../assets/images/516301867_1162325265912740_158239957098605253_n.jpg') },
  { id: '6', name: 'Kids Club', description: 'Fun activities for children of all ages.', image: require('../assets/images/516301867_1162325265912740_158239957098605253_n.jpg') },
];

const ActivityItem = ({ item, isLarge = false, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)} style={[styles.activityItem, isLarge ? styles.largeActivityItem : {}]}>
    <Image source={item.image} style={styles.itemImage} />
    <View style={styles.itemOverlay}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  </TouchableOpacity>
);

export default function ActivitiesScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleImageClick = (activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* This JSX structure is unchanged, exactly as you provided it. */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resort Activities</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.sectionTitle}>Popular Activities</Text>
      <FlatList
        data={activities.slice(0, 3)}
        renderItem={({ item }) => <ActivityItem item={item} isLarge={true} onPress={handleImageClick} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.popularActivitiesList}
      />

      <Text style={styles.sectionTitle}>All Activities</Text>
      <FlatList
        data={activities}
        renderItem={({ item }) => <ActivityItem item={item} onPress={handleImageClick} />}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.allActivitiesGrid}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          {selectedActivity && (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image source={selectedActivity.image} style={styles.popupImage} />
                <Text style={styles.popupName}>{selectedActivity.name}</Text>
                <Text style={styles.popupDescription}>{selectedActivity.description}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15, 
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 38,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  popularActivitiesList: {
    paddingHorizontal: 10,
  },
  activityItem: {
    width: (width / 2) - 15,
    height: 160,
    borderRadius: 15,
    overflow: 'hidden',
    margin: 5,
    position: 'relative',
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  largeActivityItem: {
    width: width * 0.7,
    height: 200,
    marginRight: 10,
    marginBottom: 140,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
  },
  itemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
  allActivitiesGrid: {
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: width * 0.8,
  },
  popupImage: {
    width: width * 0.7,
    height: width * 0.7 * 0.75,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  popupName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  popupDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});