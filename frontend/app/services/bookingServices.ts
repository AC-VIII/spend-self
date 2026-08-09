import { api } from "../api/api";



export async function createBooking(
  payload: CreateBookingPayload
) {
  return api.post<CreateBookingResponse>(
    "/api/bookings",
    payload
  );
}

export async function getBooking(
  bookingNumber: string
) {
  return api.get<{
    success: boolean;
    booking: Booking;
  }>(
    `/api/bookings/${encodeURIComponent(
      bookingNumber
    )}`
  );
}