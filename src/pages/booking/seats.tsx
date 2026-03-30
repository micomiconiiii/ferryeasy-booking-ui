/**
 * STEP 3: Seat Selection Page (Integrated with Trip Context)
 * Location: src/pages/booking/[tripId]/seats.tsx
 * (Updated to use selected trip from context)
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useBookingContext } from '@/context/BookingContext';
import { DESIGN_TOKENS } from '@/design-tokens';

/**
 * Placeholder for existing SeatSelectionBooking component
 * Import your existing seat selection component here
 */
// import { SeatSelectionBooking } from '@/components/SeatSelection/SeatSelectionBooking';

export function SeatSelectionPage() {
  const router = useRouter();
  const { tripId } = router.query;
  const { selectedTrip, searchParams } = useBookingContext();

  // Redirect if no selected trip
  useEffect(() => {
    if (!selectedTrip && tripId) {
      // Optionally fetch trip data if not in context
      // For now, redirect back to trip selection
      router.push('/booking');
    }
  }, [selectedTrip, tripId, router]);

  if (!selectedTrip) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface,
        }}
      >
        <p
          style={{
            color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
          }}
        >
          Loading seat selection...
        </p>
      </div>
    );
  }

  const handleSelectSeats = (selectedSeats: any[]) => {
    // Store seat selection in context or state
    // Proceed to passenger details
    router.push(`/booking/${tripId}/passengers`);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface,
        padding: `${DESIGN_TOKENS.spacing[6]} 0`,
      }}
    >
      {/* Header with Trip Context */}
      <header
        style={{
          backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface_raised,
          padding: `${DESIGN_TOKENS.spacing[4]} ${DESIGN_TOKENS.spacing[6]}`,
          borderBottom: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.lg,
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                  margin: 0,
                  color: DESIGN_TOKENS.colors.neutralUsage.text,
                }}
              >
                🚢 {selectedTrip.vessel.name}
              </h2>
              <p
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                  color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                  margin: `${DESIGN_TOKENS.spacing[1]} 0 0 0`,
                }}
              >
                {selectedTrip.route.departure.code} → {selectedTrip.route.arrival.code} |{' '}
                {selectedTrip.route.departure.time} - {selectedTrip.route.arrival.time} |{' '}
                {selectedTrip.accommodations.seats.pricing.base}₱ base
              </p>
            </div>
            <button
              onClick={() => router.back()}
              style={{
                padding: `${DESIGN_TOKENS.spacing[2]} ${DESIGN_TOKENS.spacing[4]}`,
                backgroundColor: 'transparent',
                border: `2px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
                borderRadius: DESIGN_TOKENS.borderRadius.base,
                cursor: 'pointer',
                fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
              }}
            >
              ← Back to Trips
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Replace with your SeatSelectionBooking component */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${DESIGN_TOKENS.spacing[6]}`,
        }}
      >
        {/*
          Import and render your existing seat selection component here:
          <SeatSelectionBooking
            trip={selectedTrip}
            onSelectSeats={handleSelectSeats}
          />
        */}

        {/* Placeholder */}
        <div
          style={{
            padding: DESIGN_TOKENS.spacing[12],
            backgroundColor: DESIGN_TOKENS.colors.neutral[50],
            borderRadius: DESIGN_TOKENS.borderRadius.lg,
            textAlign: 'center',
            border: `2px dashed ${DESIGN_TOKENS.colors.neutralUsage.border}`,
          }}
        >
          <h3
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.lg,
              color: DESIGN_TOKENS.colors.neutralUsage.text,
              margin: 0,
            }}
          >
            Seat Selection Component
          </h3>
          <p
            style={{
              color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              margin: `${DESIGN_TOKENS.spacing[2]} 0 0 0`,
            }}
          >
            Replace this with your existing SeatSelectionBooking component.
          </p>
          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              color: DESIGN_TOKENS.colors.neutralUsage.text_tertiary,
              margin: `${DESIGN_TOKENS.spacing[2]} 0 0 0`,
            }}
          >
            Trip data is available in context:
          </p>
          <pre
            style={{
              backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface_raised,
              padding: DESIGN_TOKENS.spacing[3],
              borderRadius: DESIGN_TOKENS.borderRadius.sm,
              textAlign: 'left',
              fontSize: DESIGN_TOKENS.typography.fontSize.xs,
              overflow: 'auto',
              marginTop: DESIGN_TOKENS.spacing[3],
            }}
          >
            {JSON.stringify(selectedTrip, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}

export default SeatSelectionPage;
