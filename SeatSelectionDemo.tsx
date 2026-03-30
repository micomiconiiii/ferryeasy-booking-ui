/**
 * Integration Example & Demo Page
 * How to use SeatSelectionBooking component
 */

'use client';

import React, { useState } from 'react';
import SeatSelectionBooking, { Seat } from './SeatSelectionBooking';
import { runAccessibilityAudit } from './a11y-utils';

/**
 * Demo: Standalone Page
 * Shows full integration with state management and API calls
 */
export default function SeatSelectionDemo() {
  const [bookingState, setBookingState] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [bookedSeats, setBookedSeats] = useState<Seat[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Run accessibility audit in development
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      runAccessibilityAudit();
    }
  }, []);

  /**
   * Handle booking submission
   */
  const handleBookingSubmit = async (selectedSeats: Seat[]) => {
    setBookingState('loading');

    try {
      // Call your API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: 'trip-001',
          seats: selectedSeats.map((s) => ({
            seatId: s.id,
            seatClass: s.class,
            price: s.price,
          })),
          totalFare: selectedSeats.reduce((sum, s) => sum + s.price, 0),
        }),
      });

      if (!response.ok) throw new Error('Booking failed');

      const data = await response.json();
      setBookingId(data.bookingId);
      setBookedSeats(selectedSeats);
      setBookingState('success');

      // Show success message
      setTimeout(() => {
        window.location.href = `/checkout?bookingId=${data.bookingId}`;
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      setBookingState('error');
    }
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      {/* Success Modal */}
      {bookingState === 'success' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-4">Your booking ID: {bookingId}</p>
              <p className="text-sm text-gray-500">Redirecting to checkout...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {bookingState === 'error' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-red-700 mb-2">Booking Failed</h2>
              <p className="text-gray-600 mb-4">Please try again or contact support.</p>
              <button
                onClick={() => setBookingState('idle')}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Component */}
      <SeatSelectionBooking
        tripId="trip-PHI-MAN-2026-04-05-08h00"
        tripName="Manila → Mindoro Ferry • April 5, 2026"
        onBookingSubmit={handleBookingSubmit}
      />

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <aside className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-xs z-40">
          <p className="font-bold mb-2">🔧 Debug Info</p>
          <p>Trip ID: trip-PHI-MAN-2026-04-05</p>
          <p>Bookings: {bookedSeats.length > 0 ? bookedSeats.map((s) => s.id).join(', ') : 'None'}</p>
          <p>State: {bookingState}</p>
        </aside>
      )}
    </main>
  );
}

/**
 * Alternative: Headless Integration
 * Use component state directly in your own UI
 */
export function HeadlessIntegration() {
  const [selectedSeats, setSelectedSeats] = React.useState<Set<string>>(new Set());

  return (
    <div>
      <h1>Custom Booking Flow</h1>
      {/* Your custom UI here */}
      <pre>{JSON.stringify(Array.from(selectedSeats), null, 2)}</pre>
    </div>
  );
}
