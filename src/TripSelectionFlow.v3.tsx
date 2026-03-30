/**
 * TripSelectionFlow.v3.tsx
 *
 * Two-Stage Ferry Booking: Trip Discovery + Seat Selection
 * =========================================================
 * Stage 1: Browse trip cards, expand one at a time
 * Stage 2: Select deck → Select seats → Confirm
 *
 * All on a single page with accordion logic
 *
 * @version 3.0
 * @author FerryEasy Design System
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, X, Check, ArrowLeft, Ship } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type SeatState = 'available' | 'selected' | 'occupied' | 'blocked';
export type AccommodationClass = 'economy' | 'tourist' | 'business';

export interface Seat {
  id: string;
  row: string;
  column: number;
  state: SeatState;
  class: AccommodationClass;
  price: number;
  isAccessible?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  class: AccommodationClass;
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
  description: string;
}

export interface Trip {
  id: string;
  from: { code: string; name: string };
  to: { code: string; name: string };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  vesselName: string;
  basePrice: number;
  decks: Deck[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

function generateMockSeats(classType: AccommodationClass, count: number = 42): Seat[] {
  const rows = 7;
  const cols = 6;
  const seats: Seat[] = [];
  const classPrice = { economy: 690, tourist: 1200, business: 1800 };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `${String.fromCharCode(65 + row)}${col + 1}`;
      const seatIndex = row * cols + col;
      let state: SeatState = 'available';

      if (seatIndex % 9 === 0) state = 'occupied';
      if (seatIndex % 13 === 0) state = 'blocked';
      if (Math.random() > 0.7) state = 'available';

      seats.push({
        id,
        row: String.fromCharCode(65 + row),
        column: col + 1,
        state,
        class: classType,
        price: classPrice[classType],
        isAccessible: seatIndex === 5 || seatIndex === 12,
      });
    }
  }

  return seats;
}

const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    from: { code: 'MNL', name: 'Manila' },
    to: { code: 'MDR', name: 'Mindoro' },
    departureTime: '08:00',
    arrivalTime: '10:30',
    duration: '2h 30m',
    vesselName: 'MV Pacific Voyager',
    basePrice: 690,
    decks: [
      {
        id: 'deck-1',
        name: 'Economy Deck',
        class: 'economy',
        totalSeats: 42,
        availableSeats: 38,
        seats: generateMockSeats('economy'),
        description: 'Lower deck, general seating',
      },
      {
        id: 'deck-2',
        name: 'Tourist Deck',
        class: 'tourist',
        totalSeats: 28,
        availableSeats: 25,
        seats: generateMockSeats('tourist'),
        description: 'Mid deck, comfort beds',
      },
      {
        id: 'deck-3',
        name: 'Business Cabins',
        class: 'business',
        totalSeats: 12,
        availableSeats: 10,
        seats: generateMockSeats('business'),
        description: 'Upper deck, premium rooms',
      },
    ],
  },
  {
    id: 'trip-2',
    from: { code: 'MNL', name: 'Manila' },
    to: { code: 'CXJ', name: 'Coron' },
    departureTime: '14:00',
    arrivalTime: '17:15',
    duration: '3h 15m',
    vesselName: 'MV Island Express',
    basePrice: 890,
    decks: [
      {
        id: 'deck-4',
        name: 'Economy Deck',
        class: 'economy',
        totalSeats: 50,
        availableSeats: 42,
        seats: generateMockSeats('economy'),
        description: 'Lower deck, general seating',
      },
    ],
  },
  {
    id: 'trip-3',
    from: { code: 'MNL', name: 'Manila' },
    to: { code: 'PPS', name: 'Puerto Princesa' },
    departureTime: '18:00',
    arrivalTime: '21:45',
    duration: '3h 45m',
    vesselName: 'MV Sunset Cruise',
    basePrice: 1250,
    decks: [
      {
        id: 'deck-5',
        name: 'Economy Deck',
        class: 'economy',
        totalSeats: 36,
        availableSeats: 28,
        seats: generateMockSeats('economy'),
        description: 'Lower deck, general seating',
      },
    ],
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Trip Card Header (Collapsed View)
 */
interface TripCardHeaderProps {
  trip: Trip;
  isExpanded: boolean;
  onToggle: () => void;
}

const TripCardHeader: React.FC<TripCardHeaderProps> = ({ trip, isExpanded, onToggle }) => {
  const totalCapacity =
    trip.decks.reduce((sum, deck) => sum + deck.totalSeats, 0);
  const totalAvailable = trip.decks.reduce((sum, deck) => sum + deck.availableSeats, 0);

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left transition-all ${isExpanded ? 'pb-6' : 'pb-4'}`}
      aria-expanded={isExpanded}
      aria-label={`Trip from ${trip.from.name} to ${trip.to.name}, ${trip.departureTime}, ₱${trip.basePrice} per seat`}
    >
      <div className="flex items-stretch gap-4">
        {/* Route & Time */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {trip.from.name} ({trip.from.code}) → {trip.to.name} ({trip.to.code})
          </h3>
          <p className="text-sm text-gray-600">
            {trip.departureTime} – {trip.arrivalTime} ({trip.duration})
          </p>
        </div>

        {/* Vessel & Price */}
        <div className="text-right">
          <p className="text-sm text-gray-700 font-semibold">
            🚢 {trip.vesselName}
          </p>
          <p className="text-lg font-bold text-blue-900">
            ₱{trip.basePrice}/seat
          </p>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🔋 {totalAvailable}/{totalCapacity}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
    </button>
  );
};

/**
 * Ship Overview (Deck Selection)
 */
interface ShipOverviewProps {
  trip: Trip;
  selectedDeckId: string | null;
  onDeckSelect: (deckId: string) => void;
}

const ShipOverview: React.FC<ShipOverviewProps> = ({
  trip,
  selectedDeckId,
  onDeckSelect,
}) => {
  return (
    <section className="py-8 border-b border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Select Your Deck</h3>
        <p className="text-sm text-gray-600">
          ▶ BOW (Front) — Choose your preferred accommodation — STERN (Back) ◀
        </p>
      </div>

      <div className="space-y-3">
        {trip.decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onDeckSelect(deck.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedDeckId === deck.id
                ? 'border-blue-900 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            aria-pressed={selectedDeckId === deck.id}
            aria-label={`${deck.name}, ${deck.availableSeats} of ${deck.totalSeats} seats available`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{deck.name}</p>
                <p className="text-sm text-gray-600">{deck.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-900">
                  {deck.availableSeats} Available
                </p>
                <p className="text-xs text-gray-500">of {deck.totalSeats}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

/**
 * Minimalist Seat Button
 */
interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seatId: string) => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({ seat, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isInteractive = seat.state === 'available' || seat.state === 'selected';

  const getStateClasses = (): string => {
    switch (seat.state) {
      case 'available':
        return isSelected
          ? 'bg-blue-900 text-white ring-2 ring-offset-2 ring-blue-900'
          : isHovered
            ? 'bg-blue-50 border-2 border-blue-900 shadow-md'
            : 'bg-white border-2 border-blue-300';

      case 'selected':
        return 'bg-blue-900 text-white ring-2 ring-offset-2 ring-blue-900';

      case 'occupied':
        return 'bg-gray-200 border border-gray-200 opacity-50 cursor-not-allowed';

      case 'blocked':
        return 'bg-red-100 border border-red-300 opacity-40 cursor-not-allowed';

      default:
        return 'bg-gray-100';
    }
  };

  return (
    <button
      onClick={() => {
        if (isInteractive) onSelect(seat.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={!isInteractive}
      className={`
        relative w-12 h-12 rounded flex items-center justify-center font-semibold text-xs
        transition-all duration-200 transform
        focus:outline-2 focus:outline-offset-2 focus:outline-blue-900
        ${getStateClasses()}
        ${isInteractive ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}
        ${isSelected ? 'animate-seatPop' : ''}
      `}
      aria-label={`Seat ${seat.id}, ${seat.state === 'occupied' ? 'Occupied' : 'Available'}, ₱${seat.price}`}
      aria-pressed={isSelected}
    >
      {isSelected ? (
        <Check className="w-5 h-5" />
      ) : isHovered && isInteractive ? (
        <span className="text-gray-900">{seat.id}</span>
      ) : null}

      {seat.isAccessible && (
        <span className="absolute top-0 right-0 text-xs" title="Wheelchair accessible">
          ♿
        </span>
      )}
    </button>
  );
};

/**
 * Seat Map Grid
 */
interface SeatMapProps {
  deck: Deck;
  selectedSeats: Set<string>;
  onSeatSelect: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ deck, selectedSeats, onSeatSelect }) => {
  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    deck.seats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    return Object.entries(grouped).sort();
  }, [deck.seats]);

  return (
    <section className="py-8 border-b border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{deck.name} - Select Seats</h3>

      {/* Seat Grid */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-8 mb-6">
        {/* BOW Label */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-gray-600 tracking-widest">
            ▶ BOW (FRONT) ▶
          </p>
        </div>

        {/* Seat Grid */}
        <div className="space-y-6 mb-6">
          {seatsByRow.map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-4">
              {/* Row label */}
              <span className="w-8 text-center font-bold text-gray-700 text-sm flex-shrink-0">
                {row}
              </span>

              {/* Left seat block */}
              <div className="flex gap-2">
                {rowSeats.slice(0, 3).map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeats.has(seat.id)}
                    onSelect={onSeatSelect}
                  />
                ))}
              </div>

              {/* Aisle */}
              <div className="w-16 h-12 flex items-center justify-center border-l-2 border-r-2 border-dashed border-gray-300">
                <span className="text-xs text-gray-400 font-semibold">AISLE</span>
              </div>

              {/* Right seat block */}
              <div className="flex gap-2">
                {rowSeats.slice(3, 6).map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeats.has(seat.id)}
                    onSelect={onSeatSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* STERN Label */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-600 tracking-widest">
            ◀ STERN (BACK) ◀
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200">
          <div className="w-6 h-6 bg-white border-2 border-blue-300 rounded" />
          <span className="text-xs font-medium text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200">
          <div className="w-6 h-6 bg-blue-900 rounded flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">Selected</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200">
          <div className="w-6 h-6 bg-gray-300 rounded opacity-50" />
          <span className="text-xs font-medium text-gray-700">Occupied</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200">
          <div className="w-6 h-6 bg-red-100 rounded border border-red-300" />
          <span className="text-xs font-medium text-gray-700">Blocked</span>
        </div>
      </div>
    </section>
  );
};

/**
 * Selection Summary Bar
 */
interface SelectionSummaryBarProps {
  selectedSeats: Seat[];
  totalPrice: number;
  deckName: string;
  isVisible: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

const SelectionSummaryBar: React.FC<SelectionSummaryBarProps> = ({
  selectedSeats,
  totalPrice,
  deckName,
  isVisible,
  onBack,
  onConfirm,
}) => {
  if (!isVisible) return null;

  const seatIds = selectedSeats.map((s) => s.id).join(', ');

  return (
    <section
      className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg animate-slideUp"
      role="region"
      aria-label="Selection summary"
    >
      <h3 className="font-bold text-gray-900 mb-3">Your Selection</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-600">Seats</p>
          <p className="text-lg font-bold text-blue-900">{seatIds}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Deck</p>
          <p className="text-lg font-bold text-blue-900">{deckName}</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded border border-blue-200">
        <p className="text-sm text-gray-600 mb-1">Total Fare</p>
        <p className="text-3xl font-bold text-blue-900">₱{totalPrice.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">
          {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} ×  ₱
          {(totalPrice / selectedSeats.length).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          aria-label="Back to deck selection"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-3 bg-blue-900 text-white rounded hover:bg-blue-800 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
          aria-label="Confirm and proceed to passenger details"
        >
          <Check className="w-4 h-4" />
          Confirm & Proceed
        </button>
      </div>
    </section>
  );
};

/**
 * Trip Card (Expandable)
 */
interface TripCardProps {
  trip: Trip;
  isExpanded: boolean;
  onToggle: (tripId: string) => void;
  onConfirm: (tripId: string, deckId: string, seatIds: string[]) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  isExpanded,
  onToggle,
  onConfirm,
}) => {
  const [stage, setStage] = useState<'overview' | 'seatMap'>('overview');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());

  const selectedDeck = trip.decks.find((d) => d.id === selectedDeckId);
  const selectedSeatsData = selectedDeck
    ? selectedDeck.seats.filter((s) => selectedSeatIds.has(s.id))
    : [];
  const totalPrice = selectedSeatsData.reduce((sum, s) => sum + s.price, 0);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleDeckSelect = useCallback((deckId: string) => {
    setSelectedDeckId(deckId);
    setStage('seatMap');
    setSelectedSeatIds(new Set()); // Clear previous selections
  }, []);

  const handleSeatSelect = useCallback((seatId: string) => {
    setSelectedSeatIds((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  }, []);

  const handleBack = useCallback(() => {
    setStage('overview');
    setSelectedDeckId(null);
    setSelectedSeatIds(new Set());
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedDeckId && selectedSeatIds.size > 0) {
      onConfirm(trip.id, selectedDeckId, Array.from(selectedSeatIds));
    }
  }, [trip.id, selectedDeckId, selectedSeatIds, onConfirm]);

  const handleClose = useCallback(() => {
    onToggle(trip.id);
    setStage('overview');
    setSelectedDeckId(null);
    setSelectedSeatIds(new Set());
  }, [trip.id, onToggle]);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-400 ${
        !prefersReducedMotion ? (isExpanded ? 'animate-slideDown' : '') : ''
      }`}
    >
      {/* Header (Always Visible) */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <TripCardHeader
              trip={trip}
              isExpanded={isExpanded}
              onToggle={() => onToggle(trip.id)}
            />
          </div>

          {/* Close Button */}
          {isExpanded && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close trip details"
              title="Close and browse other trips"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6">
          {stage === 'overview' && (
            <ShipOverview
              trip={trip}
              selectedDeckId={selectedDeckId}
              onDeckSelect={handleDeckSelect}
            />
          )}

          {stage === 'seatMap' && selectedDeck && (
            <>
              {/* Breadcrumb */}
              <button
                onClick={handleBack}
                className="mb-6 text-sm text-blue-900 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Deck Selection
              </button>

              {/* Seat Map */}
              <SeatMap
                deck={selectedDeck}
                selectedSeats={selectedSeatIds}
                onSeatSelect={handleSeatSelect}
              />

              {/* Summary Bar */}
              <SelectionSummaryBar
                selectedSeats={selectedSeatsData}
                totalPrice={totalPrice}
                deckName={selectedDeck.name}
                isVisible={selectedSeatIds.size > 0}
                onBack={handleBack}
                onConfirm={handleConfirm}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Main Component: Trip Selection Flow
 */
export interface TripSelectionFlowProps {
  onBookingConfirm?: (tripId: string, deckId: string, seatIds: string[]) => void;
}

export const TripSelectionFlow: React.FC<TripSelectionFlowProps> = ({
  onBookingConfirm,
}) => {
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  const handleTripToggle = useCallback((tripId: string) => {
    setExpandedTripId((prev) => (prev === tripId ? null : tripId));
  }, []);

  const handleBookingConfirm = useCallback(
    (tripId: string, deckId: string, seatIds: string[]) => {
      console.log('✅ Booking confirmed:', { tripId, deckId, seatIds });

      if (onBookingConfirm) {
        onBookingConfirm(tripId, deckId, seatIds);
      } else {
        const trip = MOCK_TRIPS.find((t) => t.id === tripId);
        const deck = trip?.decks.find((d) => d.id === deckId);
        const totalPrice = trip?.basePrice ? trip.basePrice * seatIds.length : 0;

        alert(
          `✓ Booking Confirmed!\n\n` +
          `Trip: ${trip?.from.name} → ${trip?.to.name}\n` +
          `Deck: ${deck?.name}\n` +
          `Seats: ${seatIds.join(', ')}\n` +
          `Total: ₱${totalPrice.toLocaleString()}\n\n` +
          `Proceeding to passenger details...`
        );
      }
    },
    [onBookingConfirm]
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Ship className="w-8 h-8 text-blue-900" />
            Select Your Trip & Seats
          </h1>
          <p className="text-gray-600 mt-1">
            Browse available departures, then choose your deck and seats
          </p>
        </div>
      </header>

      {/* Trip List */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {MOCK_TRIPS.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isExpanded={expandedTripId === trip.id}
              onToggle={handleTripToggle}
              onConfirm={handleBookingConfirm}
            />
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Click a trip card to expand and view available decks</li>
            <li>✓ Select a deck to see the seat map</li>
            <li>✓ Click seats to select them (green indicates available)</li>
            <li>✓ Your selection updates in real-time</li>
            <li>✓ Click the × button to close and compare other trips</li>
            <li>✓ Keyboard users: Tab to navigate, Space to select seats</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default TripSelectionFlow;
