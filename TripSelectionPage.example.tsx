import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TripSelectionResults, Trip } from '@/components/TripSelectionComponents';
import { DESIGN_TOKENS } from '@/design-tokens';

/**
 * TRIP SELECTION PAGE - Example Integration
 *
 * This page demonstrates how to:
 * 1. Fetch trip data from API
 * 2. Display trip selection UI with progressive disclosure
 * 3. Handle trip selection and navigation
 * 4. Maintain search context throughout booking flow
 */

interface SearchContext {
  from: string;
  to: string;
  date: string;
  passengers: number;
  departureCode: string;
  arrivalCode: string;
}

interface TripSelectionPageProps {
  searchContext: SearchContext;
}

/**
 * MOCK DATA - Replace with API call in production
 */
const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-001',
    vessel: {
      name: 'MV Pacific Voyager',
      type: 'ferry',
      capacity: 500,
      decks: 4,
      yearBuilt: 2018,
      lastInspection: '2026-01-15',
      amenities: ['restaurant', 'lounge', 'wifi'],
    },
    route: {
      departure: {
        location: 'Manila Port Terminal',
        code: 'MNL',
        time: '08:00',
      },
      arrival: {
        location: 'Mindoro Port',
        code: 'MDR',
        time: '10:30',
      },
      durationMinutes: 150,
    },
    accommodations: {
      seats: {
        type: 'seats',
        label: 'Seats',
        total: 42,
        available: 38,
        reserved: 4,
        location: 'Deck 1-2 (Open deck)',
        features: [
          'Open air seating',
          'Ocean views',
          'Ventilated',
          'Direct access to exits',
        ],
        pricing: {
          base: 690,
          upgrades: {
            'Extra Legroom': 150,
            'Priority Boarding': 50,
          },
        },
      },
      beds: {
        type: 'beds',
        label: 'Beds',
        total: 28,
        available: 22,
        reserved: 6,
        location: 'Deck 2-3 (Cabin level)',
        features: [
          '2-4 person berth cabins',
          'Climate-controlled',
          'Private sleeping area',
          'Complimentary bedding',
        ],
        pricing: {
          base: 1200,
          upgrades: {
            'Breakfast Pack': 180,
            'Meal Card': 350,
          },
        },
      },
      cabins: {
        type: 'cabins',
        label: 'Cabins',
        total: 12,
        available: 10,
        reserved: 2,
        location: 'Deck 4 (Premium suite)',
        features: [
          'Private ensuite cabin',
          'Queen-size bed',
          'Private bathroom',
          'Entertainment system',
          'Lounge access',
        ],
        pricing: {
          base: 2890,
          upgrades: {
            'Premium Lounge Access': 200,
            'Spa Package': 450,
          },
        },
      },
    },
  },
  {
    id: 'trip-002',
    vessel: {
      name: 'MV Island Express',
      type: 'catamaran',
      capacity: 350,
      decks: 2,
      yearBuilt: 2020,
      lastInspection: '2026-02-20',
      amenities: ['wifi', 'restaurant'],
    },
    route: {
      departure: {
        location: 'Manila Port Terminal',
        code: 'MNL',
        time: '14:00',
      },
      arrival: {
        location: 'Mindoro Port',
        code: 'MDR',
        time: '17:15',
      },
      durationMinutes: 195,
    },
    accommodations: {
      seats: {
        type: 'seats',
        label: 'Seats',
        total: 50,
        available: 48,
        reserved: 2,
        location: 'Deck 1 (Spacious cabin)',
        features: [
          'Reclining seats',
          'Individual air vents',
          'USB charging ports',
          'Wide spacing',
        ],
        pricing: {
          base: 890,
          upgrades: {
            'Premium Seat': 250,
          },
        },
      },
      beds: {
        type: 'beds',
        label: 'Beds',
        total: 18,
        available: 14,
        reserved: 4,
        location: 'Deck 2 (Cabin deck)',
        features: [
          '2-person luxury cabins',
          'En-suite bathroom',
          'Flat-screen TV',
          'Complimentary toiletries',
        ],
        pricing: {
          base: 1500,
          upgrades: {
            'Welcome Beverage': 100,
          },
        },
      },
      cabins: {
        type: 'cabins',
        label: 'Cabins',
        total: 8,
        available: 6,
        reserved: 2,
        location: 'Deck 2 (Premium suite)',
        features: [
          'Luxury suite cabin',
          'King-size bed',
          'Spacious bathroom',
          'Mini bar',
          'VIP lounge access',
        ],
        pricing: {
          base: 3290,
          upgrades: {
            'Personal Concierge': 500,
          },
        },
      },
    },
  },
  {
    id: 'trip-003',
    vessel: {
      name: 'MV Sunset Cruise',
      type: 'ferry',
      capacity: 600,
      decks: 5,
      yearBuilt: 2015,
      lastInspection: '2025-12-10',
      amenities: ['restaurant', 'lounge', 'wifi', 'medical'],
    },
    route: {
      departure: {
        location: 'Manila Port Terminal',
        code: 'MNL',
        time: '18:00',
      },
      arrival: {
        location: 'Mindoro Port',
        code: 'MDR',
        time: '21:30',
      },
      durationMinutes: 210,
    },
    accommodations: {
      seats: {
        type: 'seats',
        label: 'Seats',
        total: 36,
        available: 28,
        reserved: 8,
        location: 'Deck 1-2 (Sunset viewing deck)',
        features: [
          'Premium sunset views',
          'Open-air platform',
          'Weather protected',
          'Extended legroom',
        ],
        pricing: {
          base: 1250,
          upgrades: {
            'Sunset Package': 300,
          },
        },
      },
      beds: {
        type: 'beds',
        label: 'Beds',
        total: 32,
        available: 20,
        reserved: 12,
        location: 'Deck 3 (Comfortable cabins)',
        features: [
          'Double berth cabins',
          'Private balcony',
          'Bathroom with shower',
          'Turn-down service',
        ],
        pricing: {
          base: 1800,
          upgrades: {
            'Dinner Service': 250,
          },
        },
      },
      cabins: {
        type: 'cabins',
        label: 'Cabins',
        total: 20,
        available: 16,
        reserved: 4,
        location: 'Deck 4-5 (Executive suites)',
        features: [
          'Luxury executive cabin',
          'Master suite bedroom',
          'Jacuzzi bath',
          'Butler service',
          'Premium dining',
        ],
        pricing: {
          base: 3990,
          upgrades: {
            'Champagne Service': 600,
          },
        },
      },
    },
  },
];

/**
 * Hook: Fetch trips from API or use mock data
 */
function useFetchTrips(searchContext: SearchContext) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        setError(null);

        // In production, replace with actual API call:
        // const response = await fetch(
        //   `/api/trips?from=${searchContext.from}&to=${searchContext.to}&date=${searchContext.date}&passengers=${searchContext.passengers}`
        // );
        // const data = await response.json();
        // setTrips(data);

        // Mock delay to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTrips(MOCK_TRIPS);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load trips'
        );
        setTrips([]);
      } finally {
        setLoading(false);
      }
    }

    if (searchContext.from && searchContext.to && searchContext.date) {
      fetchTrips();
    }
  }, [searchContext]);

  return { trips, loading, error };
}

/**
 * MAIN COMPONENT
 */
export function TripSelectionPage({
  searchContext = {
    from: 'Manila',
    to: 'Mindoro',
    date: '2026-04-05',
    passengers: 1,
    departureCode: 'MNL',
    arrivalCode: 'MDR',
  },
}: TripSelectionPageProps) {
  const router = useRouter();
  const { trips, loading, error } = useFetchTrips(searchContext);

  const handleSelectTrip = (tripId: string) => {
    // Save trip selection to session/state
    const selectedTrip = trips.find((t) => t.id === tripId);
    if (selectedTrip) {
      // Store in session or context for next step
      sessionStorage.setItem('selectedTripId', tripId);
      sessionStorage.setItem('selectedTrip', JSON.stringify(selectedTrip));

      // Navigate to seat selection page
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
      {/* Header Section */}
      <header
        style={{
          backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface_raised,
          padding: `${DESIGN_TOKENS.spacing[6]} ${DESIGN_TOKENS.spacing[6]}`,
          borderBottom: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
          marginBottom: DESIGN_TOKENS.spacing[6],
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              marginBottom: DESIGN_TOKENS.spacing[4],
            }}
          >
            Home &gt; Book Ferry &gt; <strong>Select Trip</strong> &gt;
            Seats &gt; Passenger &gt; Payment
          </div>

          {/* Progress Bar */}
          <div
            style={{
              display: 'flex',
              gap: DESIGN_TOKENS.spacing[2],
              marginBottom: DESIGN_TOKENS.spacing[4],
            }}
          >
            {['Search', 'Trip', 'Seats', 'Passenger', 'Payment', 'Confirm'].map(
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
                        idx <= 1
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
                  {idx < 5 && (
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

          {/* Page Title & Context */}
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
            {searchContext.departureCode} → {searchContext.arrivalCode} on{' '}
            {new Date(searchContext.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}{' '}
            ({searchContext.passengers} passenger
            {searchContext.passengers !== 1 ? 's' : ''})
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
          <div
            style={{
              textAlign: 'center',
              padding: DESIGN_TOKENS.spacing[12],
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `4px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
                borderTop: `4px solid ${DESIGN_TOKENS.colors.semantic.selected.base}`,
                animation: 'spin 1s linear infinite',
              }}
            />
            <p
              style={{
                marginTop: DESIGN_TOKENS.spacing[4],
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              }}
            >
              Loading available trips...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
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
            <p
              style={{
                color: DESIGN_TOKENS.colors.semantic.blocked.dark,
                margin: 0,
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: DESIGN_TOKENS.spacing[4],
                padding: `${DESIGN_TOKENS.spacing[2]} ${DESIGN_TOKENS.spacing[4]}`,
                backgroundColor: DESIGN_TOKENS.colors.semantic.blocked.base,
                color: DESIGN_TOKENS.colors.neutralUsage.text_inverse,
                border: 'none',
                borderRadius: DESIGN_TOKENS.borderRadius.base,
                cursor: 'pointer',
                fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: DESIGN_TOKENS.spacing[12],
            }}
          >
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.lg,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              }}
            >
              No trips available for this route and date.
            </p>
            <button
              onClick={() => router.back()}
              style={{
                marginTop: DESIGN_TOKENS.spacing[4],
                padding: `${DESIGN_TOKENS.spacing[2]} ${DESIGN_TOKENS.spacing[4]}`,
                backgroundColor: DESIGN_TOKENS.colors.semantic.selected.base,
                color: DESIGN_TOKENS.colors.neutralUsage.text_inverse,
                border: 'none',
                borderRadius: DESIGN_TOKENS.borderRadius.base,
                cursor: 'pointer',
              }}
            >
              Back to Search
            </button>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.base,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                marginBottom: DESIGN_TOKENS.spacing[4],
              }}
            >
              {trips.length} trip{trips.length !== 1 ? 's' : ''} available.
              Click on a trip to see full details about the vessel,
              accommodations, and pricing.
            </p>

            <TripSelectionResults
              trips={trips}
              onSelectTrip={handleSelectTrip}
              initialExpandedTripId={trips[0]?.id}
            />
          </>
        )}
      </div>

      {/* Footer with Back Button */}
      <footer
        style={{
          marginTop: DESIGN_TOKENS.spacing[12],
          padding: `${DESIGN_TOKENS.spacing[6]} ${DESIGN_TOKENS.spacing[6]}`,
          borderTop: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            padding: `${DESIGN_TOKENS.spacing[3]} ${DESIGN_TOKENS.spacing[6]}`,
            backgroundColor: 'transparent',
            border: `2px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
            borderRadius: DESIGN_TOKENS.borderRadius.base,
            cursor: 'pointer',
            fontSize: DESIGN_TOKENS.typography.fontSize.base,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text,
          }}
        >
          ← Back to Search
        </button>
      </footer>
    </main>
  );
}

export default TripSelectionPage;
