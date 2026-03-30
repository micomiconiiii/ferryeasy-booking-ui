/**
 * SeatSelectionBooking.tsx
 *
 * Progressive Disclosure Seat Selection Component
 * - Vessel Overview (orientation context)
 * - Accommodation Class Switcher (Economy/Tourist/Business)
 * - Interactive Seat Map (48×48px touch targets, WCAG AAA)
 * - Sticky Summary Bar (floating checkout)
 *
 * @author FerryEasy Design System
 * @version 2.0
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Ship,
  DoorOpen,
  AlertTriangle,
  Coffee,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type SeatState = 'available' | 'selected' | 'reserved' | 'blocked';
export type AccommodationClass = 'economy' | 'tourist' | 'business';

export interface Seat {
  id: string;
  row: string;
  column: number;
  state: SeatState;
  class: AccommodationClass;
  price: number;
}

export interface Deck {
  id: string;
  name: string;
  zones: Zone[];
}

export interface Zone {
  id: string;
  name: string;
  class: AccommodationClass;
  seats: Seat[];
  position: { x: number; y: number; width: number; height: number };
}

export interface Landmark {
  id: string;
  type: 'toilet' | 'exit' | 'life_jacket' | 'canteen';
  label: string;
  position: { x: number; y: number };
  zone: string;
}

// ============================================================================
// MOCK DATA (Replace with API calls)
// ============================================================================

function generateMockSeats(classType: AccommodationClass, count: number = 42): Seat[] {
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
      let state: SeatState = 'available';

      if (seatIndex % 9 === 0) state = 'reserved';
      if (seatIndex % 5 === 0) state = 'selected';
      if (seatIndex % 13 === 0) state = 'blocked';
      if (Math.random() > 0.7) state = 'available';

      seats.push({
        id,
        row: String.fromCharCode(65 + row),
        column: col + 1,
        state,
        class: classType,
        price: classPrice[classType],
      });
    }
  }

  return seats;
}

const MOCK_ZONES: Zone[] = [
  {
    id: 'zone-1',
    name: 'Lower Deck',
    class: 'economy',
    seats: generateMockSeats('economy'),
    position: { x: 0, y: 0, width: 100, height: 100 },
  },
  {
    id: 'zone-2',
    name: 'Middle Deck',
    class: 'tourist',
    seats: generateMockSeats('tourist'),
    position: { x: 0, y: 0, width: 100, height: 100 },
  },
  {
    id: 'zone-3',
    name: 'Upper Deck',
    class: 'business',
    seats: generateMockSeats('business'),
    position: { x: 0, y: 0, width: 100, height: 100 },
  },
];

const MOCK_LANDMARKS: Landmark[] = [
  { id: 'l1', type: 'toilet', label: 'Toilets', position: { x: 10, y: 50 }, zone: 'zone-1' },
  { id: 'l2', type: 'exit', label: 'Exit', position: { x: 90, y: 50 }, zone: 'zone-1' },
  { id: 'l3', type: 'life_jacket', label: 'Life Jackets', position: { x: 50, y: 10 }, zone: 'zone-1' },
  { id: 'l4', type: 'canteen', label: 'Canteen', position: { x: 50, y: 90 }, zone: 'zone-1' },
];

// ============================================================================
// HELPER: Seat Color & Icons
// ============================================================================

function getSeatColor(state: SeatState): string {
  const colors: Record<SeatState, string> = {
    available: 'bg-green-500 hover:bg-green-600',
    selected: 'bg-blue-700 hover:bg-blue-800',
    reserved: 'bg-amber-400 hover:bg-amber-500',
    blocked: 'bg-red-500 hover:bg-red-600',
  };
  return colors[state];
}

function getSeatLabel(state: SeatState): string {
  const labels: Record<SeatState, string> = {
    available: 'Available',
    selected: 'Your Seat',
    reserved: 'Reserved',
    blocked: 'Blocked',
  };
  return labels[state];
}

function getLandmarkIcon(type: string) {
  const icons: Record<string, React.ReactNode> = {
    toilet: '🚻',
    exit: '🚪',
    life_jacket: '🦺',
    canteen: '☕',
  };
  return icons[type] || '📍';
}

// ============================================================================
// COMPONENT: Vessel Overview
// ============================================================================

interface VesselOverviewProps {
  title?: string;
}

const VesselOverview: React.FC<VesselOverviewProps> = ({ title = 'Ferry Orientation' }) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      className={`bg-gray-50 p-8 border-b border-gray-200 ${
        !prefersReducedMotion ? 'animate-slideDown' : ''
      }`}
      aria-label="Ferry vessel orientation guide"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
        <p className="text-sm text-gray-600 mb-6">
          Upper Deck (Business Class) • Main Deck (Tourist Class) • Lower Deck (Economy Class)
        </p>

        {/* Simplified Vessel Graphic */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-bold text-blue-900 flex items-center gap-2">
            <span className="text-xl">▶</span>
            <span>FRONT (BOW)</span>
          </div>

          <div className="flex-1 mx-8 h-20 border-4 border-blue-900 rounded-lg bg-white flex items-center justify-center relative">
            <Ship className="w-12 h-12 text-blue-900 opacity-30" />
            <div className="absolute inset-0 grid grid-cols-3 divide-x divide-blue-900 opacity-20">
              <div />
              <div />
              <div />
            </div>
          </div>

          <div className="text-sm font-bold text-blue-900 flex items-center gap-2">
            <span>BACK (STERN)</span>
            <span className="text-xl">◀</span>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          The deck is oriented from Bow (front) to Stern (back). Seats closer to the bow may experience more motion in rough seas.
        </p>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: Class Switcher (Tabs)
// ============================================================================

interface ClassSwitcherProps {
  currentClass: AccommodationClass;
  onClassChange: (newClass: AccommodationClass) => void;
}

const ClassSwitcher: React.FC<ClassSwitcherProps> = ({ currentClass, onClassChange }) => {
  const classes: Array<{ id: AccommodationClass; icon: string; label: string }> = [
    { id: 'economy', icon: '🚢', label: 'Economy (Lower)' },
    { id: 'tourist', icon: '🛏️', label: 'Tourist (Middle)' },
    { id: 'business', icon: '👑', label: 'Business (Upper)' },
  ];

  return (
    <section
      className="bg-gray-100 px-8 py-6 border-b border-gray-200"
      aria-label="Select accommodation class"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Select Your Cabin Class</h2>

        <div className="flex gap-4">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => onClassChange(cls.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                currentClass === cls.id
                  ? 'bg-white border-2 border-blue-900 text-blue-900 shadow-md'
                  : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
              aria-pressed={currentClass === cls.id}
              aria-label={`Select ${cls.label} class`}
            >
              <span className="text-lg mr-2">{cls.icon}</span>
              {cls.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: Seat Map
// ============================================================================

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Set<string>;
  onSeatClick: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onSeatClick }) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Group seats by row for rendering
  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    return Object.entries(grouped).sort();
  }, [seats]);

  return (
    <section
      className={`bg-white px-8 py-8 border-b border-gray-200 ${
        !prefersReducedMotion ? 'animate-slideUp' : ''
      }`}
      aria-label="Seat selection map"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Select Your Seats</h2>
        <p className="text-sm text-gray-600 mb-6">
          ▶ FRONT (BOW) — Larger touch targets (48×48px) for accessibility — BACK (STERN) ◀
        </p>

        {/* Seat Grid */}
        <div className="space-y-3 mb-8 bg-gray-50 p-6 rounded-lg">
          {seatsByRow.map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-4">
              {/* Row label */}
              <span className="w-8 text-center font-bold text-gray-700 text-sm">
                {row}
              </span>

              {/* Seats in row */}
              <div className="flex gap-2">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => {
                      if (seat.state === 'available' || seat.state === 'selected') {
                        onSeatClick(seat.id);
                      }
                    }}
                    disabled={seat.state === 'reserved' || seat.state === 'blocked'}
                    className={`
                      w-12 h-12 rounded font-semibold text-xs text-white
                      transition-all transform focus:outline-2 focus:outline-offset-2 focus:outline-blue-600
                      ${getSeatColor(seat.state)}
                      ${
                        seat.state === 'available' || seat.state === 'selected'
                          ? 'cursor-pointer active:scale-95'
                          : 'cursor-not-allowed opacity-60'
                      }
                      ${selectedSeats.has(seat.id) ? 'ring-2 ring-offset-2 ring-blue-900' : ''}
                    `}
                    aria-label={`Seat ${seat.id}, ${getSeatLabel(seat.state)}, ₱${seat.price}`}
                    aria-pressed={selectedSeats.has(seat.id)}
                    title={`${seat.id} - ${getSeatLabel(seat.state)} - ₱${seat.price}`}
                  >
                    {selectedSeats.has(seat.id) && <Check className="w-5 h-5" />}
                    {!selectedSeats.has(seat.id) && seat.column}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded" />
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-700 rounded" />
            <span className="text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-400 rounded" />
            <span className="text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded" />
            <span className="text-gray-700">Blocked</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: Landmarks Legend
// ============================================================================

interface LandmarksLegendProps {
  landmarks: Landmark[];
}

const LandmarksLegend: React.FC<LandmarksLegendProps> = ({ landmarks }) => {
  const uniqueLandmarks = useMemo(() => {
    const seen = new Set<string>();
    return landmarks.filter((l) => {
      if (seen.has(l.type)) return false;
      seen.add(l.type);
      return true;
    });
  }, [landmarks]);

  return (
    <section
      className="bg-gray-50 px-8 py-6 border-b border-gray-200"
      aria-label="Onboard facilities and services"
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Facilities & Services on Deck</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {uniqueLandmarks.map((lm) => (
            <div
              key={lm.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <span className="text-2xl">{getLandmarkIcon(lm.type)}</span>
              <span className="text-sm font-medium text-gray-700">{lm.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENT: Sticky Summary Bar
// ============================================================================

interface StickySummaryBarProps {
  selectedSeats: Seat[];
  totalPrice: number;
  isVisible: boolean;
  onProceed: () => void;
  onClear: () => void;
}

const StickySummaryBar: React.FC<StickySummaryBarProps> = ({
  selectedSeats,
  totalPrice,
  isVisible,
  onProceed,
  onClear,
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isVisible) return null;

  const seatIds = selectedSeats.map((s) => s.id).join(', ');
  const className = selectedSeats[0]?.class || 'economy';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-blue-900 text-white shadow-2xl p-4 z-50 transition-transform ${
        !prefersReducedMotion && isVisible ? 'animate-slideUp' : ''
      }`}
      role="region"
      aria-label="Booking summary and checkout"
      aria-live="polite"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Seats Info */}
        <div>
          <p className="text-xs font-semibold opacity-75">Selected Seats</p>
          <p className="text-lg font-bold text-yellow-300">{seatIds}</p>
          <p className="text-xs opacity-75">{className.charAt(0).toUpperCase() + className.slice(1)} Class</p>
        </div>

        {/* Center: Total Price */}
        <div className="flex-1">
          <p className="text-xs font-semibold opacity-75">Total Fare</p>
          <p className="text-3xl font-bold text-yellow-300">₱ {totalPrice.toFixed(2)}</p>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            aria-label="Clear seat selection"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={onProceed}
            className="px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-blue-900 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-lg"
            aria-label="Proceed to checkout"
          >
            <Check className="w-4 h-4" />
            Book Now
          </button>
        </div>
      </div>

      {/* Mobile-optimized summary (appears on small screens) */}
      <div className="sm:hidden mt-3 text-center">
        <p className="text-xs opacity-75">
          {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT: SeatSelectionBooking
// ============================================================================

export interface SeatSelectionBookingProps {
  tripId: string;
  tripName?: string;
  onBookingSubmit?: (selectedSeats: Seat[]) => void;
}

export const SeatSelectionBooking: React.FC<SeatSelectionBookingProps> = ({
  tripId,
  tripName = 'Ferry Booking',
  onBookingSubmit,
}) => {
  const [currentClass, setCurrentClass] = useState<AccommodationClass>('economy');
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());

  // Get current zone/seats
  const currentZone = MOCK_ZONES.find((z) => z.class === currentClass) || MOCK_ZONES[0];
  const currentSeats = currentZone.seats;

  // Get selected seats with full data
  const selectedSeatsData = useMemo(
    () => currentSeats.filter((s) => selectedSeatIds.has(s.id)),
    [currentSeats, selectedSeatIds]
  );

  // Calculate total price
  const totalPrice = useMemo(
    () => selectedSeatsData.reduce((sum, s) => sum + s.price, 0),
    [selectedSeatsData]
  );

  // Handlers
  const handleSeatClick = useCallback(
    (seatId: string) => {
      setSelectedSeatIds((prev) => {
        const next = new Set(prev);
        if (next.has(seatId)) {
          next.delete(seatId);
        } else {
          next.add(seatId);
        }
        return next;
      });
    },
    []
  );

  const handleClassChange = useCallback((newClass: AccommodationClass) => {
    setCurrentClass(newClass);
    setSelectedSeatIds(new Set()); // Clear selection when switching classes
  }, []);

  const handleProceed = useCallback(() => {
    if (onBookingSubmit && selectedSeatsData.length > 0) {
      onBookingSubmit(selectedSeatsData);
    } else {
      alert(`Booked: ${selectedSeatsData.map((s) => s.id).join(', ')} - ₱${totalPrice.toFixed(2)}`);
    }
  }, [selectedSeatsData, totalPrice, onBookingSubmit]);

  const handleClear = useCallback(() => {
    setSelectedSeatIds(new Set());
  }, []);

  return (
    <div className="w-full bg-white min-h-screen pb-32">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">{tripName}</h1>
          <p className="text-blue-100 text-sm">Trip ID: {tripId}</p>
        </div>
      </header>

      {/* Progressive Disclosure Sections */}
      <VesselOverview title="Select Your Seat" />
      <ClassSwitcher currentClass={currentClass} onClassChange={handleClassChange} />
      <SeatMap seats={currentSeats} selectedSeats={selectedSeatIds} onSeatClick={handleSeatClick} />
      <LandmarksLegend landmarks={MOCK_LANDMARKS} />

      {/* Sticky Summary */}
      <StickySummaryBar
        selectedSeats={selectedSeatsData}
        totalPrice={totalPrice}
        isVisible={selectedSeatsData.length > 0}
        onProceed={handleProceed}
        onClear={handleClear}
      />

      {/* Empty State */}
      {selectedSeatsData.length === 0 && (
        <div className="max-w-6xl mx-auto px-8 py-12 text-center text-gray-500">
          <p className="text-lg">No seats selected yet. Tap a seat to begin booking.</p>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionBooking;
