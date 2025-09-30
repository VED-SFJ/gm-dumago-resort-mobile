import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const conversation = [
    { type: 'date', content: 'Today, 28 Sep' },
    { type: 'message', sender: 'Ivy (Support)', time: '11:15 PM', content: 'Hello, Veronica! Thanks for getting in touch. How can I help you?', isUser: false, avatar: require('../assets/images/profile.jpg') },
    { type: 'message', sender: 'You', time: '11:16 PM', content: "Hello, Ivy! I need your help. My payment doesn't go through.", isUser: true },
    { type: 'message', sender: 'Ivy (Support)', time: '11:16 PM', content: "What's the error you're getting while trying to make the payment?", isUser: false, avatar: require('../assets/images/profile.jpg') },
    { type: 'message', sender: 'You', time: '11:17 PM', content: "It asks me to enter a valid card number", isUser: true },
    { type: 'message', sender: 'Ivy (Support)', time: '11:17 PM', content: "What card did you use?", isUser: false, avatar: require('../assets/images/profile.jpg') },
];

const MessageItem = ({ item }) => {
  if (item.type === 'date') {
    return <Text style={styles.dateSeparator}>{item.content}</Text>;
  }

  const { sender, time, content, isUser, avatar } = item;
  
  return (
    <View style={[styles.messageRow, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
        {!isUser && <Image source={avatar} style={styles.avatar} />}
        <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{sender}</Text>
                <Text style={styles.timestamp}>{time}</Text>
            </View>
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.otherBubble]}>
                <Text style={isUser ? styles.userText : styles.otherText}>{content}</Text>
            </View>
        </View>
    </View>
  );
};

export default function ChatScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support chat</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.chatArea}
          contentContainerStyle={{ padding: 10 }}
        >
          {conversation.map((item, index) => <MessageItem key={index} item={item} />)}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="attach" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TextInput 
            style={styles.input} 
            placeholder="Type something..."
            placeholderTextColor="#C7C7CD"
          />
          <TouchableOpacity style={styles.iconButton}>
             <Ionicons name="send" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'white', 
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '600', 
  },
  chatArea: { 
    flex: 1, 
  },
  inputContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    paddingVertical: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  input: { 
    flex: 1, 
    backgroundColor: '#F7F7F8',
    borderRadius: 20, 
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  iconButton: {
    padding: 8,
  },
  dateSeparator: {
    alignSelf: 'center',
    color: '#8E8E93',
    fontSize: 12,
    marginVertical: 15,
    backgroundColor: '#F7F7F8',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  messageContent: {
    maxWidth: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
    color: '#8E8E93',
    fontSize: 12,
    marginLeft: 8,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  userBubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    borderBottomRightRadius: 5,
  },
  otherBubble: {
    backgroundColor: '#34C759', 
    borderRadius: 20,
    borderBottomLeftRadius: 5,
  },
  userText: {
    color: 'black',
    fontSize: 16,
  },
  otherText: {
    color: 'white',
    fontSize: 16,
  },
});