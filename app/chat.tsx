import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from '@/models/api';
import { getChatHistory, sendChatMessage } from '@/api/chat';
import { LinearGradient } from 'expo-linear-gradient';

const MessageItem = ({ item, currentUserId }: { item: ChatMessage; currentUserId: string | null }) => {
  const isUser = item.sender_id === currentUserId;
  const isAI = item.sender_role === 'ai';
  const avatarSource = require('../assets/images/profile.jpg');

  return (
    <View style={[messageStyles.messageRow, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
      {!isUser && <Image source={avatarSource} style={messageStyles.avatar} />}
      <View style={[messageStyles.messageContent, isUser ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
        <View style={[messageStyles.messageBubble, isUser ? messageStyles.userBubble : isAI ? messageStyles.aiBubble : messageStyles.adminBubble]}>
          <Text style={isUser ? messageStyles.userText : messageStyles.otherText}>{item.content}</Text>
        </View>
        <Text style={messageStyles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const ChatOption = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={selectionStyles.optionContainer} onPress={onPress}>
    <View style={selectionStyles.iconContainer}>
      <Ionicons name={icon} size={28} color="#007AFF" />
    </View>
    <View style={selectionStyles.textContainer}>
      <Text style={selectionStyles.title}>{title}</Text>
      <Text style={selectionStyles.subtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#C7C7CD" />
  </TouchableOpacity>
);

const ChatSelectionScreen = ({ userId }) => {
  const router = useRouter();
  const adminConversationId = `admin-chat-${userId}`;
  const aiConversationId = `ai-support-${userId}`;

  const handleSelectChat = (id, name) => {
    router.push({
      pathname: `/chat`,
      params: { conversationId: id, partnerName: name },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView>
        <Text style={selectionStyles.sectionHeader}>Choose a support channel</Text>
        <View style={selectionStyles.optionsList}>
          <ChatOption
            icon="chatbubbles-outline"
            title="Chat with Admin"
            subtitle="Get help from our human support team"
            onPress={() => handleSelectChat(adminConversationId, 'Admin Support')}
          />
          <View style={selectionStyles.separator} />
          <ChatOption
            icon="sparkles-outline"
            title="AI Assistant"
            subtitle="Get instant answers from our AI"
            onPress={() => handleSelectChat(aiConversationId, 'AI Assistant')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ChatWindowScreen = ({ conversationId, partnerName, userId }) => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const history = await getChatHistory(conversationId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const messageContent = inputText.trim();
    setInputText('');
    setIsSending(true);

    const optimisticMessage: ChatMessage = {
      id: `optimistic_${Date.now()}`, conversation_id: conversationId, content: messageContent,
      sender_id: userId, sender_username: 'You', sender_role: 'user', timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      await sendChatMessage({ conversation_id: conversationId, content: messageContent });
      await fetchHistory();
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setInputText(messageContent);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{partnerName}</Text>
          <View style={{ width: 28 }} />
        </View>

        <LinearGradient colors={['#F7F8FA', '#FFFFFF']} style={{ flex: 1 }}>
          {isLoadingHistory ? (
            <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item._id || item.id || `fallback-${Math.random()}`}
              renderItem={({ item }) => <MessageItem item={item} currentUserId={userId} />}
              contentContainerStyle={{ padding: 10 }}
              ListEmptyComponent={() => (
                <View style={messageStyles.emptyContainer}>
                  <Ionicons name="chatbubbles-outline" size={50} color="#C7C7CD" />
                  <Text style={messageStyles.emptyText}>Start a conversation with {partnerName}!</Text>
                </View>
              )}
            />
          )}
        </LinearGradient>

        <View style={messageStyles.inputContainer}>
          <TextInput
            style={messageStyles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!isSending}
          />
          <TouchableOpacity style={messageStyles.iconButton} onPress={handleSend} disabled={!inputText.trim() || isSending}>
            {isSending ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Ionicons name="arrow-up-circle" size={32} color={inputText.trim() ? '#007AFF' : '#C7C7CD'} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default function ChatScreenRouter() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const params = useLocalSearchParams();
  const conversationId = params.conversationId as string;
  const partnerName = params.partnerName as string;

  if (isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (conversationId) {
    return (
      <ChatWindowScreen conversationId={conversationId} partnerName={partnerName || 'Support'} userId={user.id} />
    );
  }

  return <ChatSelectionScreen userId={user.id} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F2F5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15,
    paddingVertical: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EFEFEF',
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
});

const selectionStyles = StyleSheet.create({
  sectionHeader: { fontSize: 14, color: '#666', marginHorizontal: 20, marginTop: 20, marginBottom: 10, textTransform: 'uppercase' },
  optionsList: { backgroundColor: 'white', borderRadius: 15, marginHorizontal: 15, overflow: 'hidden' },
  optionContainer: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#EBF5FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', color: '#111' },
  subtitle: { fontSize: 14, color: 'gray', marginTop: 3 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#EFEFEF', marginLeft: 74 },
});

const messageStyles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  emptyText: { color: '#C7C7CD', fontSize: 16, marginTop: 10 },
  // Input Bar
  inputContainer: {
    flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'white',
    alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EFEFEF',
  },
  input: {
    flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8, fontSize: 16, maxHeight: 120, marginRight: 10,
  },
  iconButton: { justifyContent: 'center', alignItems: 'center' },
  // Messages
  messageRow: { flexDirection: 'row', marginVertical: 4, paddingHorizontal: 5 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8, alignSelf: 'flex-end' },
  messageContent: { maxWidth: '80%', flex: 1 },
  messageBubble: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  userBubble: { backgroundColor: '#007AFF', borderBottomRightRadius: 5 },
  adminBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 5, borderWidth: 1, borderColor: '#E5E5EA' },
  aiBubble: { backgroundColor: '#34C759', borderBottomLeftRadius: 5 },
  userText: { color: 'white', fontSize: 16, lineHeight: 22 },
  otherText: { color: 'black', fontSize: 16, lineHeight: 22 },
  timestamp: { color: '#999', fontSize: 11, marginTop: 4, paddingHorizontal: 10 },
});
