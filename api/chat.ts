import apiClient from './client';
import { ChatMessage, ChatMessageCreate } from '@/models/api';

/**
 * Fetches the full chat history for a conversation.
 * Corresponds to GET /chat/history/{conversation_id}
 * @param conversationId The ID of the conversation.
 */
export const getChatHistory = async (conversationId: string): Promise<ChatMessage[]> => {
  try {
    // API call is correct: GET /chat/history/{conversationId}
    const response = await apiClient.get<ChatMessage[]>(`/chat/history/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch chat history for ${conversationId}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Sends a message to a conversation.
 * Corresponds to POST /chat/send_message
 * @param messageData The message payload.
 */
export const sendChatMessage = async (messageData: ChatMessageCreate): Promise<void> => {
    try {
        // API call is correct: POST /chat/send_message with messageData including conversation_id
        await apiClient.post('/chat/send_message', messageData);
    } catch (error) {
        console.error("Failed to send chat message:", error.response?.data || error.message);
        throw error;
    }
};
