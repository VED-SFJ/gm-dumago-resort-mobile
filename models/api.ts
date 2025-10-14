/**
 * Schema for user login.
 * Based on #/components/schemas/UserLogin
 */
export interface UserLogin {
  email: string;
  password?: string;
}

/**
 * Schema for user response sent to the client (excludes password).
 * Based on #/components/schemas/UserResponse
 */
export interface User {
  username: string;
  email: string;
  id: string; // Corresponds to _id
  role: 'user' | 'admin';
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/**
 * Schema for returning reservation details.
 * Made more robust to handle potential API inconsistencies.
 */
export interface Reservation {
  id?: string;
  _id?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  payment_status: 'downpayment_pending' | 'downpayment_paid' | 'paid' | 'refunded' | 'cancelled' | 'expired' | string;
  downpayment_required: number;
  reservation_date: string; // ISO date string or object
  shift_type: string;
  number_of_guests: number;
  total_price: number;
}

/**
 * Schema for returning notification details.
 * Based on #/components/schemas/NotificationResponse
 */
export interface Notification {
  id: string; // Corresponds to _id
  user_id: string | null;
  title: string;
  message: string;
  type: 'general' | 'reservation_update' | 'payment_success' | 'cancellation' | 'chat' | string;
  is_read: boolean;
  created_at: string; // ISO date string
  link: string | null;
}

/**
 * Schema for returning chat message details.
 * Based on #/components/schemas/ChatMessageResponse
 */
export interface ChatMessage {
  id?: string; // Corresponds to _id
  _id?: string;
  conversation_id: string;
  sender_id: string;
  sender_username: string;
  sender_role: 'user' | 'admin' | 'ai' | 'system'; // Added 'system' for error message
  content: string;
  timestamp: string; // ISO date string
  image_repo_path?: string | null;
}

/**
 * Schema for creating a new chat message.
 * Based on #/components/schemas/ChatMessageCreate
 */
export interface ChatMessageCreate {
  conversation_id: string;
  content: string;
  image_repo_path?: string | null;
}

/**
 * Simplified user information nested in admin responses.
 * Corresponds to AdminUserResponse in Python.
 */
export interface AdminUserResponse {
  id: string;
  username: string;
  email: string;
}

/**
 * Detailed reservation response for admin QR code verification.
 * Corresponds to AdminReservationVerificationResponse in Python.
 */
export interface AdminReservationVerificationResponse {
  id: string;
  status: string;
  reservation_date: string; // ISO date string
  shift_type: string;
  number_of_guests: number;
  total_price: number;
  payment_status: string;
  user?: AdminUserResponse;
}
