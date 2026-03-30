/**
 * STEP 3: Trip Selection Page (Integrated)
 * Location: src/pages/booking/index.tsx
 * (Replace or merge with existing booking page)
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { TripSelectionResults } from '@/components/TripSelection';
import { useTripSelection } from '@/hooks/useTripSelection';
import { useBookingContext } from '@/context/BookingContext';
import { DESIGN_TOKENS } from '@/design-tokens';

export function BookingTripSelectionPage() {
  const router = useRouter();
  const { searchParams, setSelectedTrip } = useBookingContext();

  // Redirect if no search params
  useEffect(() => {
    if (!searchParams) {
      router.push('/');
      return;
    }
  }, [searchParams, router]);

  const { trips, loading, error } = useTripSelection(
    searchParams || {
      from: '',
      to: '',
      date: '',
      passengers: 1,
    }
  );

  if (!searchParams) return null;

  const handleSelectTrip = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      // Navigate to seat selection with trip context in URL
      router.push(`/booking/${tripId}/seats`);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface,
        padding: `${DESIGN_TOKENS.spacing[6]} 0`,
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface_raised,
          padding: `${DESIGN_TOKENS.spacing[6]}`,
          borderBottom: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
          marginBottom: DESIGN_TOKENS.spacing[6],
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Progress Bar */}
          <div
            style={{
              display: 'flex',
              gap: DESIGN_TOKENS.spacing[2],
              marginBottom: DESIGN_TOKENS.spacing[4],
            }}
          >
            {['Search', 'Trip', 'Seats', 'Passenger', 'Payment'].map(
              (step, idx) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor:
                        idx <= 1
                          ? DESIGN_TOKENS.colors.semantic.available.base
                          : DESIGN_TOKENS.colors.neutral[200],
                      color:
                        idx === 1
                          ? DESIGN_TOKENS.colors.neutralUsage.text_inverse
                          : DESIGN_TOKENS.colors.neutralUsage.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                    }}
                  >
                    {idx + 1}
                  </div>
                  {idx < 4 && (
                    <div
                      style={{
                        width: '24px',
                        height: '2px',
                        backgroundColor:
                          idx < 1
                            ? DESIGN_TOKENS.colors.semantic.available.base
                            : DESIGN_TOKENS.colors.neutral[200],
                        margin: `0 ${DESIGN_TOKENS.spacing[1]}`,
                      }}
                    />
                  )}
                </div>
              )
            )}
          </div>

          <h1
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize['4xl'],
              fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
              color: DESIGN_TOKENS.colors.neutralUsage.text,
              margin: `0 0 ${DESIGN_TOKENS.spacing[2]} 0`,
            }}
          >
            Select Your Trip
          </h1>

          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.lg,
              color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              margin: 0,
            }}
          >
            {searchParams.from} → {searchParams.to} on{' '}
            {new Date(searchParams.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
            ({searchParams.passengers} passenger
            {searchParams.passengers !== 1 ? 's' : ''})
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${DESIGN_TOKENS.spacing[6]}`,
        }}
      >
        {loading && (
          <div style={{ textAlign: 'center', padding: DESIGN_TOKENS.spacing[12] }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `4px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
                borderTop: `4px solid ${DESIGN_TOKENS.colors.semantic.selected.base}`,
                margin: '0 auto',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p
              style={{
                marginTop: DESIGN_TOKENS.spacing[4],
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              }}
            >
              Loading trips...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: DESIGN_TOKENS.spacing[6],
              backgroundColor: DESIGN_TOKENS.colors.semantic.blocked.light,
              borderRadius: DESIGN_TOKENS.borderRadius.lg,
              border: `2px solid ${DESIGN_TOKENS.colors.semantic.blocked.base}`,
            }}
          >
            <h2
              style={{
                color: DESIGN_TOKENS.colors.semantic.blocked.dark,
                margin: `0 0 ${DESIGN_TOKENS.spacing[2]} 0`,
              }}
            >
              ⚠️ Error Loading Trips
            </h2>
            <p style={{ color: DESIGN_TOKENS.colors.semantic.blocked.dark, margin: 0 }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: DESIGN_TOKENS.spacing[4],
                padding: `${DESIGN_TOKENS.spacing[2]} ${DESIGN_TOKENS.spacing[4]}`,
                backgroundColor: DESIGN_TOKENS.colors.semantic.blocked.base,
                color: 'white',
                border: 'none',
                borderRadius: DESIGN_TOKENS.borderRadius.base,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div style={{ textAlign: 'center', padding: DESIGN_TOKENS.spacing[12] }}>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.lg,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              }}
            >
              No trips available for this route and date.
            </p>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <TripSelectionResults
            trips={trips}
            onSelectTrip={handleSelectTrip}
            initialExpandedTripId={trips[0]?.id}
          />
        )}
      </div>
    </main>
  );
}

export default BookingTripSelectionPage;
