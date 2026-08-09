type BookingPanelProps = {
  stay: Stay;
};

type BookingStep =
  | "booking"
  | "guest"
  | "review"
  | "confirmation";

type BookingResponse = {
  success: boolean;
  message: string;

  booking: {
    id: number;
    bookingNumber: string;

    stay: {
      id: number;
      name: string;
    };

    checkIn: string;
    checkOut: string;

    guests: number;
    nights: number;

    guest: {
      id: number;
      fullName: string;
      country: string;
      phone: string;
      email: string;
      specialRequests: string;
    };

    pricePerNight: number;
    totalAmount: number;
    currency: string;

    status: string;
  };
};



type CreateBookingPayload = {
  stayId: number;
  checkIn: string;
  checkOut: string;
  guests: number;

  guest: {
    fullName: string;
    country: string;
    phone: string;
    email: string;
    specialRequests?: string;
  };
};

type Booking = {
  id: number;
  bookingNumber: string;

  stay: {
    id: number;
    name: string;
  };

  checkIn: string;
  checkOut: string;

  guests: number;
  nights: number;

  guest: {
    id: number;
    fullName: string;
    country: string;
    phone: string;
    email: string;
    specialRequests: string;
  };

  pricePerNight: number;
  totalAmount: number;
  currency: string;

  status: string;
};

type CreateBookingResponse = {
  success: boolean;
  message: string;
  booking: Booking;
};