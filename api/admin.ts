// gm-dumago-resort-mobile/api/admin.ts
import adminApiClient from './adminClient';
import { AdminReservationVerificationResponse, Reservation } from '@/models/api';

/**
 * Verifies a reservation QR code with the backend using the admin API key.
 * Corresponds to POST /admin/reservations/verify-qr
 * @param qrCodeData The string data from the scanned QR code.
 */
export const verifyReservationQR = async (qrCodeData: string): Promise<AdminReservationVerificationResponse> => {
  try {
    const response = await adminApiClient.post<AdminReservationVerificationResponse>('/admin/reservations/verify-qr', {
      qr_code_data: qrCodeData,
    });
    return response.data;
  } catch (error) {
    console.error("QR Verification API Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches all reservations for the admin panel.
 * Corresponds to GET /admin/reservations
 * @param status Optional filter for reservation status (e.g., 'confirmed', 'pending').
 */
export const adminGetAllReservations = async (status?: string): Promise<Reservation[]> => {
    try {
        const params = status && status !== 'all' ? { status } : {};
        const response = await adminApiClient.get<Reservation[]>('/admin/reservations', { params });
        return response.data;
    } catch (error) {
        console.error("Admin Get All Reservations API Error:", error.response?.data || error.message);
        throw error;
    }
};
