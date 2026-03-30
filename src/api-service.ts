/**
 * Mock API Service
 * Simulates backend API calls for FerryEasy booking system
 * Replace these with real API endpoints in production
 */

import { Seat, Zone, Landmark } from './SeatSelectionBooking';

// ============================================================================
// TYPES
// ============================================================================

export interface BookingRequest {
  tripId: string;
  seats: Array<{ seatId: string; seatClass: string; price: number }>;
  totalFare: number;
  passengerId?: string;
  discountCode?: string;
}

export interface BookingResponse {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'failed';
  seatsBooked: Array<{ seatId: string; holdExpires: string }>;
  totalFare: number;
  paymentUrl?: string;
  createdAt: string;
}

export interface SeatAvailabilityResponse {
  tripId: string;
  deck: string;
  seats: Seat[];
  timestamp: string;
  lastUpdated: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const SEAT_HOLD_DURATION = 10 * 60 * 1000; // 10 minutes
const POLLING_INTERVAL = 5000; // 5 seconds for real-time updates

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch available seats for a trip and accommodation class
 */
export async function fetchSeatsAvailability(
  tripId: string,
  accommodationClass: 'economy' | 'tourist' | 'business'
): Promise<Seat[]> {
  try {
    const response = await fetch(
      `${API_BASE}/trips/${tripId}/seats?class=${accommodationClass}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch seats`);
    }

    const data: SeatAvailabilityResponse = await response.json();
    return data.seats;
  } catch (error) {
    console.error('Seat availability fetch failed:', error);
    // Return mock data as fallback
    return generateMockSeats(accommodationClass);
  }
}

/**
 * Create a booking with selected seats
 */
export async function createBooking(
  request: BookingRequest
): Promise<BookingResponse> {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0',
      },
      body: JSON.stringify({
        ...request,
        seatHoldDuration: SEAT_HOLD_DURATION,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Booking creation failed`);
    }

    const data: BookingResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Booking creation failed:', error);
    // Return mock response as fallback
    return {
      bookingId: `BK-${Date.now()}`,
      status: 'pending',
      seatsBooked: request.seats.map((s) => ({
        seatId: s.seatId,
        holdExpires: new Date(Date.now() + SEAT_HOLD_DURATION).toISOString(),
      })),
      totalFare: request.totalFare,
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Check if seats still available (before checkout)
 */
export async function validateSeatsAvailable(
  tripId: string,
  seatIds: string[]
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/bookings/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, seatIds }),
    });

    if (!response.ok) return false;

    const data: { available: boolean } = await response.json();
    return data.available;
  } catch (error) {
    console.error('Seat validation failed:', error);
    return true; // Optimistic: assume valid
  }
}

/**
 * Get trip details (fare, duration, route, etc.)
 */
export async function fetchTripDetails(tripId: string) {
  try {
    const response = await fetch(`${API_BASE}/trips/${tripId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Trip fetch failed`);
    }

    return await response.json();
  } catch (error) {
    console.error('Trip details fetch failed:', error);
    return null;
  }
}

/**
 * Apply discount code
 */
export async function applyDiscountCode(
  code: string,
  tripId: string,
  baseFare: number
): Promise<{ discountAmount: number; finalFare: number }> {
  try {
    const response = await fetch(`${API_BASE}/discounts/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, tripId, baseFare }),
    });

    if (!response.ok) {
      throw new Error('Invalid discount code');
    }

    return await response.json();
  } catch (error) {
    console.error('Discount validation failed:', error);
    return { discountAmount: 0, finalFare: baseFare };
  }
}

/**
 * WebSocket subscription for real-time seat updates
 * Use for live seat availability sync
 */
export function subscribeToSeatUpdates(
  tripId: string,
  onUpdate: (seats: Seat[]) => void
): () => void {
  const wsUrl =
    (process.env.REACT_APP_WS_URL || 'ws://localhost:3000').replace(/^http/, 'ws') +
    `/seats/${tripId}`;

  try {
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const { seats } = JSON.parse(event.data);
        onUpdate(seats);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Fall back to polling
      startPollingSeats(tripId, onUpdate);
    };

    // Return unsubscribe function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  } catch (error) {
    console.error('WebSocket connection failed:', error);
    // Fall back to polling
    return startPollingSeats(tripId, onUpdate);
  }
}

/**
 * Polling fallback for real-time updates
 */
function startPollingSeats(
  tripId: string,
  onUpdate: (seats: Seat[]) => void
): () => void {
  const intervalId = window.setInterval(async () => {
    try {
      // Fetch any class - just for updates
      const seats = await fetchSeatsAvailability(tripId, 'economy');
      onUpdate(seats);
    } catch (error) {
      console.error('Polling failed:', error);
    }
  }, POLLING_INTERVAL);

  return () => clearInterval(intervalId);
}

/**
 * Get booking status
 */
export async function getBookingStatus(bookingId: string) {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Booking fetch failed`);
    }

    return await response.json();
  } catch (error) {
    console.error('Booking status fetch failed:', error);
    return null;
  }
}

/**
 * Cancel booking (within hold period)
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Booking cancellation failed:', error);
    return false;
  }
}

/**
 * Get payment URL for Stripe/PayMongo checkout
 */
export async function getPaymentUrl(
  bookingId: string
): Promise<{ paymentUrl: string; sessionId: string }> {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Payment URL generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment URL fetch failed:', error);
    throw error;
  }
}

// ============================================================================
// MOCK DATA GENERATORS (for development/testing)
// ============================================================================

function generateMockSeats(
  accommodationClass: 'economy' | 'tourist' | 'business'
): Seat[] {
  const rows = 7;
  const cols = 6;
  const seats: Seat[] = [];

  const classPrice = {
    economy: 1500,
    tourist: 2000,
    business: 2700,
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `${String.fromCharCode(65 + row)}${col + 1}`;
      const seatIndex = row * cols + col;
      let state = 'available';

      if (seatIndex % 9 === 0) state = 'reserved';
      if (seatIndex % 5 === 0 && Math.random() > 0.5) state = 'available';
      if (seatIndex % 13 === 0) state = 'blocked';

      seats.push({
        id,
        row: String.fromCharCode(65 + row),
        column: col + 1,
        state: state as any,
        class: accommodationClass,
        price: classPrice[accommodationClass],
      });
    }
  }

  return seats;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class BookingError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'BookingError';
  }
}

/**
 * Safe API call wrapper with retry logic
 */
export async function safeApiCall<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        throw error;
      }

      // Exponential backoff
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw (
    lastError || new Error('Failed to complete API call after multiple retries')
  );
}
