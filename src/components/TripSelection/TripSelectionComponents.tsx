import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Users, Wifi, UtensilsCrossed, Wind } from 'lucide-react';
import { DESIGN_TOKENS } from './design-tokens';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VesselInfo {
  name: string;
  type: 'ferry' | 'catamaran' | 'hydrofoil';
  capacity: number;
  decks: number;
  yearBuilt: number;
  lastInspection: string;
  amenities: ('restaurant' | 'lounge' | 'wifi' | 'medical' | 'childcare')[];
}

interface RouteInfo {
  departure: { location: string; code: string; time: string };
  arrival: { location: string; code: string; time: string };
  durationMinutes: number;
}

interface AccommodationType {
  type: 'seats' | 'beds' | 'cabins';
  label: string; // 'Seats', 'Beds', 'Cabins'
  total: number;
  available: number;
  reserved: number;
  location: string; // 'Deck 1-2', 'Deck 2-3', 'Deck 4'
  features: string[];
  pricing: {
    base: number;
    upgrades: Record<string, number>;
  };
}

interface Trip {
  id: string;
  vessel: VesselInfo;
  route: RouteInfo;
  accommodations: {
    seats: AccommodationType;
    beds: AccommodationType;
    cabins: AccommodationType;
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const getAccommodationColor = (type: 'seats' | 'beds' | 'cabins'): string => {
  const colors = {
    seats: DESIGN_TOKENS.colors.semantic.available.base, // Green #10B981
    beds: DESIGN_TOKENS.colors.semantic.selected.base,  // Blue #0066CC
    cabins: DESIGN_TOKENS.colors.semantic.blocked.base, // Red #EF4444
  };
  return colors[type];
};

const getAmenityIcon = (
  amenity: 'restaurant' | 'lounge' | 'wifi' | 'medical' | 'childcare'
) => {
  const icons = {
    restaurant: <UtensilsCrossed size={16} />,
    lounge: <Wind size={16} />,
    wifi: <Wifi size={16} />,
    medical: '🏥',
    childcare: '👶',
  };
  return icons[amenity];
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TripCardCollapsedProps {
  trip: Trip;
  onExpand: () => void;
}

const TripCardCollapsed: React.FC<TripCardCollapsedProps> = ({ trip, onExpand }) => {
  const basePrice = trip.accommodations.seats.pricing.base;

  return (
    <div
      style={{
        padding: DESIGN_TOKENS.spacing[6],
        border: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
        borderRadius: DESIGN_TOKENS.borderRadius.base,
        backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface_raised,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: DESIGN_TOKENS.spacing[4],
        alignItems: 'center',
      }}
    >
      {/* Left: Trip Info */}
      <div style={{ display: 'grid', gap: DESIGN_TOKENS.spacing[2] }}>
        {/* Vessel Name */}
        <div
          style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.xl,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text,
          }}
        >
          🚢 {trip.vessel.name}
        </div>

        {/* Route + Time */}
        <div
          style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.base,
            color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
            display: 'flex',
            gap: DESIGN_TOKENS.spacing[3],
            alignItems: 'center',
          }}
        >
          <span>
            {trip.route.departure.code} → {trip.route.arrival.code}
          </span>
          <span>|</span>
          <span>
            {trip.route.departure.time} - {trip.route.arrival.time}
          </span>
          <span>|</span>
          <span>{formatDuration(trip.route.durationMinutes)}</span>
          <span>|</span>
          <span style={{ fontWeight: 600, color: DESIGN_TOKENS.colors.neutralUsage.text }}>
            ₱{basePrice}/pax
          </span>
        </div>

        {/* Accommodation Icons */}
        <div
          style={{
            display: 'flex',
            gap: DESIGN_TOKENS.spacing[4],
            marginTop: DESIGN_TOKENS.spacing[1],
          }}
        >
          {Object.entries(trip.accommodations).map(([key, acc]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_TOKENS.spacing[1],
                padding: `${DESIGN_TOKENS.spacing[1]} ${DESIGN_TOKENS.spacing[2]}`,
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
                backgroundColor: `${getAccommodationColor(key as any)}20`,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getAccommodationColor(key as any),
                }}
              />
              <span
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                  color: DESIGN_TOKENS.colors.neutralUsage.text,
                }}
              >
                {acc.label}: {acc.available}/{acc.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Action Button */}
      <button
        onClick={onExpand}
        style={{
          padding: `${DESIGN_TOKENS.spacing[2]} ${DESIGN_TOKENS.spacing[4]}`,
          backgroundColor: 'transparent',
          border: `2px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
          borderRadius: DESIGN_TOKENS.borderRadius.base,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: DESIGN_TOKENS.spacing[2],
          fontSize: DESIGN_TOKENS.typography.fontSize.sm,
          fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
          color: DESIGN_TOKENS.colors.neutralUsage.text,
          transition: DESIGN_TOKENS.transition.fast,
          minHeight: DESIGN_TOKENS.touchTarget.minimum,
          minWidth: '44px',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget).style.backgroundColor = DESIGN_TOKENS.colors.neutral[50];
        }}
        onMouseLeave={(e) => {
          (e.currentTarget).style.backgroundColor = 'transparent';
        }}
      >
        <ChevronDown size={18} />
        EXPAND
      </button>
    </div>
  );
};

interface AccommodationDetailProps {
  accommodation: AccommodationType;
}

const AccommodationDetail: React.FC<AccommodationDetailProps> = ({ accommodation }) => {
  const statusColor =
    accommodation.available > 0
      ? DESIGN_TOKENS.colors.semantic.available.base
      : DESIGN_TOKENS.colors.semantic.blocked.base;

  return (
    <div
      style={{
        padding: DESIGN_TOKENS.spacing[4],
        border: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
        borderRadius: DESIGN_TOKENS.borderRadius.md,
        backgroundColor: DESIGN_TOKENS.colors.neutral[50],
      }}
    >
      {/* Header: Type + Availability */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: DESIGN_TOKENS.spacing[3],
          paddingBottom: DESIGN_TOKENS.spacing[3],
          borderBottom: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
        }}
      >
        <div>
          <h4
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.lg,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
              color: DESIGN_TOKENS.colors.neutralUsage.text,
              margin: 0,
            }}
          >
            {accommodation.label}
          </h4>
          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              margin: `${DESIGN_TOKENS.spacing[1]} 0 0 0`,
            }}
          >
            Location: {accommodation.location}
          </p>
        </div>
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.base,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
              color: statusColor,
              margin: 0,
            }}
          >
            {accommodation.available}/{accommodation.total}
          </p>
          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.xs,
              color: DESIGN_TOKENS.colors.neutralUsage.text_tertiary,
              margin: `${DESIGN_TOKENS.spacing[1]} 0 0 0`,
            }}
          >
            Available
          </p>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: DESIGN_TOKENS.spacing[4] }}>
        <p
          style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.xs,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
            textTransform: 'uppercase',
            margin: `0 0 ${DESIGN_TOKENS.spacing[2]} 0`,
          }}
        >
          Features
        </p>
        <ul
          style={{
            display: 'grid',
            gap: DESIGN_TOKENS.spacing[2],
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {accommodation.features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_TOKENS.spacing[2],
              }}
            >
              <span style={{ color: getAccommodationColor(accommodation.type as any) }}>✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing */}
      <div>
        <p
          style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.xs,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
            textTransform: 'uppercase',
            margin: `0 0 ${DESIGN_TOKENS.spacing[2]} 0`,
          }}
        >
          Pricing
        </p>
        <div
          style={{
            padding: DESIGN_TOKENS.spacing[3],
            backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface_raised,
            borderRadius: DESIGN_TOKENS.borderRadius.sm,
          }}
        >
          <div
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.base,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
              color: DESIGN_TOKENS.colors.neutralUsage.text,
              marginBottom: DESIGN_TOKENS.spacing[2],
            }}
          >
            Base: ₱{accommodation.pricing.base}
          </div>
          {Object.entries(accommodation.pricing.upgrades).length > 0 && (
            <div style={{ fontSize: DESIGN_TOKENS.typography.fontSize.sm }}>
              {Object.entries(accommodation.pricing.upgrades).map(([upgrade, price]) => (
                <div
                  key={upgrade}
                  style={{
                    color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                    marginTop: DESIGN_TOKENS.spacing[1],
                  }}
                >
                  + {upgrade}: +₱{price}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface AmenityBadgeProps {
  amenity: 'restaurant' | 'lounge' | 'wifi' | 'medical' | 'childcare';
}

const AmenityBadge: React.FC<AmenityBadgeProps> = ({ amenity }) => {
  const labels = {
    restaurant: 'Restaurant',
    lounge: 'Lounge',
    wifi: 'WiFi',
    medical: 'Medical Bay',
    childcare: 'Childcare',
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: DESIGN_TOKENS.spacing[1],
        padding: `${DESIGN_TOKENS.spacing[1]} ${DESIGN_TOKENS.spacing[3]}`,
        backgroundColor: DESIGN_TOKENS.colors.neutral[100],
        borderRadius: DESIGN_TOKENS.borderRadius.full,
        fontSize: DESIGN_TOKENS.typography.fontSize.xs,
        color: DESIGN_TOKENS.colors.neutralUsage.text,
      }}
    >
      {getAmenityIcon(amenity)}
      {labels[amenity]}
    </div>
  );
};

interface TripCardExpandedProps {
  trip: Trip;
  onCollapse: () => void;
  onSelect: (tripId: string) => void;
}

const TripCardExpanded: React.FC<TripCardExpandedProps> = ({ trip, onCollapse, onSelect }) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: DESIGN_TOKENS.spacing[6],
        paddingTop: DESIGN_TOKENS.spacing[6],
        borderTop: `2px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
      }}
    >
      {/* Trip Timing */}
      <section>
        <h3
          style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.lg,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text,
            margin: `0 0 ${DESIGN_TOKENS.spacing[3]} 0`,
          }}
        >
          Trip Timing
        </h3>
        <div style={{ display: 'grid', gap: DESIGN_TOKENS.spacing[2] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_TOKENS.spacing[2] }}>
            <MapPin size={16} color={DESIGN_TOKENS.colors.semantic.available.base} />
            <div>
              <p
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                  color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                  margin: 0,
                }}
              >
                Departure
              </p>
              <p
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.base,
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                  color: DESIGN_TOKENS.colors.neutralUsage.text,
                  margin: 0,
                }}
              >
                {trip.route.departure.time} - {trip.route.departure.location}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_TOKENS.spacing[2] }}>
            <MapPin size={16} color={DESIGN_TOKENS.colors.semantic.blocked.base} />
            <div>
              <p
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                  color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                  margin: 0,
                }}
              >
                Arrival
              </p>
              <p
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.base,
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                  color: DESIGN_TOKENS.colors.neutralUsage.text,
                  margin: 0,
                }}
              >
                {trip.route.arrival.time} - {trip.route.arrival.location}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_TOKENS.spacing[2] }}>
            <Clock size={16} />
            <div>
              <p
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                  color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                  margin: 0,
                }}
              >
                Duration
              </p>
              <p
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.base,
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                  color: DESIGN_TOKENS.colors.neutralUsage.text,
                  margin: 0,
                }}
              >
                {formatDuration(trip.route.durationMinutes)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vessel Information */}
      <section>
        <h3
          style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.lg,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text,
            margin: `0 0 ${DESIGN_TOKENS.spacing[3]} 0`,
          }}
        >
          Vessel Information
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: DESIGN_TOKENS.spacing[4],
          }}
        >
          <div>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                textTransform: 'uppercase',
                margin: `0 0 ${DESIGN_TOKENS.spacing[1]} 0`,
              }}
            >
              Type
            </p>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.base,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
                margin: 0,
              }}
            >
              {trip.vessel.type.charAt(0).toUpperCase() + trip.vessel.type.slice(1)}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                textTransform: 'uppercase',
                margin: `0 0 ${DESIGN_TOKENS.spacing[1]} 0`,
              }}
            >
              Capacity
            </p>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.base,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
                margin: 0,
              }}
            >
              {trip.vessel.capacity} passengers
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                textTransform: 'uppercase',
                margin: `0 0 ${DESIGN_TOKENS.spacing[1]} 0`,
              }}
            >
              Decks
            </p>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.base,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
                margin: 0,
              }}
            >
              {trip.vessel.decks}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                textTransform: 'uppercase',
                margin: `0 0 ${DESIGN_TOKENS.spacing[1]} 0`,
              }}
            >
              Year Built
            </p>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.base,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
                margin: 0,
              }}
            >
              {trip.vessel.yearBuilt}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
                textTransform: 'uppercase',
                margin: `0 0 ${DESIGN_TOKENS.spacing[1]} 0`,
              }}
            >
              Last Inspection
            </p>
            <p
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.base,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
                margin: 0,
              }}
            >
              {trip.vessel.lastInspection}
            </p>
          </div>
        </div>

        {/* Amenities */}
        <div style={{ marginTop: DESIGN_TOKENS.spacing[4] }}>
          <p
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.xs,
              color: DESIGN_TOKENS.colors.neutralUsage.text_secondary,
              textTransform: 'uppercase',
              margin: `0 0 ${DESIGN_TOKENS.spacing[2]} 0`,
            }}
          >
            Amenities
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: DESIGN_TOKENS.spacing[2] }}>
            {trip.vessel.amenities.map((amenity) => (
              <AmenityBadge key={amenity} amenity={amenity} />
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation Breakdown */}
      <section>
        <h3
          style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.lg,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text,
            margin: `0 0 ${DESIGN_TOKENS.spacing[3]} 0`,
          }}
        >
          Accommodation Breakdown
        </h3>
        <div style={{ display: 'grid', gap: DESIGN_TOKENS.spacing[4] }}>
          <AccommodationDetail accommodation={trip.accommodations.seats} />
          <AccommodationDetail accommodation={trip.accommodations.beds} />
          <AccommodationDetail accommodation={trip.accommodations.cabins} />
        </div>
      </section>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: DESIGN_TOKENS.spacing[3],
          paddingTop: DESIGN_TOKENS.spacing[4],
          borderTop: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
        }}
      >
        <button
          onClick={onCollapse}
          style={{
            padding: `${DESIGN_TOKENS.spacing[3]} ${DESIGN_TOKENS.spacing[5]}`,
            backgroundColor: 'transparent',
            border: `2px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
            borderRadius: DESIGN_TOKENS.borderRadius.base,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: DESIGN_TOKENS.spacing[2],
            fontSize: DESIGN_TOKENS.typography.fontSize.base,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text,
            transition: DESIGN_TOKENS.transition.fast,
            minHeight: DESIGN_TOKENS.touchTarget.recommended,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget).style.backgroundColor = DESIGN_TOKENS.colors.neutral[50];
          }}
          onMouseLeave={(e) => {
            (e.currentTarget).style.backgroundColor = 'transparent';
          }}
        >
          <ChevronUp size={18} />
          COLLAPSE
        </button>

        <button
          onClick={() => onSelect(trip.id)}
          style={{
            flex: 1,
            padding: `${DESIGN_TOKENS.spacing[3]} ${DESIGN_TOKENS.spacing[5]}`,
            backgroundColor: DESIGN_TOKENS.colors.semantic.selected.base,
            border: 'none',
            borderRadius: DESIGN_TOKENS.borderRadius.base,
            cursor: 'pointer',
            fontSize: DESIGN_TOKENS.typography.fontSize.base,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.neutralUsage.text_inverse,
            transition: DESIGN_TOKENS.transition.fast,
            minHeight: DESIGN_TOKENS.touchTarget.recommended,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget).style.backgroundColor = DESIGN_TOKENS.colors.semantic.selected.dark;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget).style.backgroundColor = DESIGN_TOKENS.colors.semantic.selected.base;
          }}
        >
          SELECT TRIP
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT: TripCard
// ============================================================================

interface TripCardProps {
  trip: Trip;
  onSelectTrip: (tripId: string) => void;
  defaultExpanded?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onSelectTrip,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      style={{
        padding: DESIGN_TOKENS.spacing[6],
        backgroundColor: DESIGN_TOKENS.colors.neutralUsage.surface_raised,
        border: `1px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
        borderRadius: DESIGN_TOKENS.borderRadius.lg,
        boxShadow: DESIGN_TOKENS.shadow.md,
        transition: DESIGN_TOKENS.transition.base,
      }}
    >
      {!isExpanded && (
        <TripCardCollapsed trip={trip} onExpand={() => setIsExpanded(true)} />
      )}

      {isExpanded && (
        <>
          {/* Expanded Header (matching collapsed layout for visual continuity) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: DESIGN_TOKENS.spacing[4],
              alignItems: 'center',
              marginBottom: DESIGN_TOKENS.spacing[4],
            }}
          >
            <div
              style={{
                fontSize: DESIGN_TOKENS.typography.fontSize.xl,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
              }}
            >
              🚢 {trip.vessel.name}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                padding: `${DESIGN_TOKENS.spacing[2]} ${DESIGN_TOKENS.spacing[4]}`,
                backgroundColor: 'transparent',
                border: `2px solid ${DESIGN_TOKENS.colors.neutralUsage.border}`,
                borderRadius: DESIGN_TOKENS.borderRadius.base,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_TOKENS.spacing[2],
                fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                color: DESIGN_TOKENS.colors.neutralUsage.text,
                transition: DESIGN_TOKENS.transition.fast,
                minHeight: DESIGN_TOKENS.touchTarget.minimum,
                minWidth: '44px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget).style.backgroundColor = DESIGN_TOKENS.colors.neutral[50];
              }}
              onMouseLeave={(e) => {
                (e.currentTarget).style.backgroundColor = 'transparent';
              }}
            >
              <ChevronUp size={18} />
              COLLAPSE
            </button>
          </div>

          {/* Expanded Content */}
          <TripCardExpanded
            trip={trip}
            onCollapse={() => setIsExpanded(false)}
            onSelect={onSelectTrip}
          />
        </>
      )}
    </div>
  );
};

// ============================================================================
// MAIN CONTAINER: TripSelectionResults
// ============================================================================

interface TripSelectionResultsProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  initialExpandedTripId?: string;
}

export const TripSelectionResults: React.FC<TripSelectionResultsProps> = ({
  trips,
  onSelectTrip,
  initialExpandedTripId,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: DESIGN_TOKENS.spacing[4],
      }}
    >
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onSelectTrip={onSelectTrip}
          defaultExpanded={trip.id === initialExpandedTripId}
        />
      ))}
    </div>
  );
};

export default TripSelectionResults;
