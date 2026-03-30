/**
 * SeatSelectionBooking.v2.tsx
 *
 * Industry-Standard Ferry Seat Selection Component
 * ============================================
 * - Minimalist seat design (no icons)
 * - Progressive disclosure (smart summary bar)
 * - Frictionless interactions (instant feedback)
 * - Spacious layout with clear aisles
 * - WCAG 2.1 AA Enhanced accessibility
 *
 * @version 2.0 Industry Standard Edition
 * @author FerryEasy Design Team
 */

'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Ship, Check, RotateCcw, ChevronDown } from 'lucide-react';

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

export interface Zone {
  id: string;
  name: string;
  class: AccommodationClass;
  seats: Seat[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

function generateMockSeats(classType: AccommodationClass): Seat[] {
  const rows = 7;
  const cols = 6;
  const seats: Seat[] = [];

  const classPrice = { economy: 1500, tourist: 2000, business: 2700 };

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
        isAccessible: seatIndex === 5 || seatIndex === 12, // A6, B6 accessible
      });
    }
  }

  return seats;
}

const MOCK_ZONES: Zone[] = [
  {
    id: 'zone-1',
    name: 'Economy Deck',
    class: 'economy',
    seats: generateMockSeats('economy'),
  },
  {
    id: 'zone-2',
    name: 'Tourist Deck',
    class: 'tourist',
    seats: generateMockSeats('tourist'),
  },
  {
    id: 'zone-3',
    name: 'Business Deck',
    class: 'business',
    seats: generateMockSeats('business'),
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Sticky Trip Header
 * Shows trip overview, selection count, and base price
 */
interface StickyHeaderProps {
  tripName: string;
  basePrice: number;
  selectedCount: number;
  isCollapsed?: boolean;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  tripName,
  basePrice,
  selectedCount,
  isCollapsed = false,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-all ${
        isCollapsed ? 'py-2' : 'py-4'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Ship className="w-5 h-5 text-blue-900" />
          <div className={`${isCollapsed ? 'text-sm' : 'text-base'}`}>
            <p className="font-bold text-gray-900">{tripName}</p>
            {!isCollapsed && (
              <p className="text-xs text-gray-600">Base: ₱{basePrice.toLocaleString()}/seat</p>
            )}
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="text-right text-sm">
            <p className="font-semibold text-blue-900">{selectedCount} Selected</p>
            <p className="text-xs text-gray-600">→ Book when ready</p>
          </div>
        )}
      </div>
    </header>
  );
};

/**
 * Accommodation Class Selector
 */
interface ClassSelectorProps {
  currentClass: AccommodationClass;
  onClassChange: (newClass: AccommodationClass) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ currentClass, onClassChange }) => {
  const classes = [
    { id: 'economy', name: 'Economy Deck', icon: '🚢', desc: 'Standard Seating' },
    { id: 'tourist', name: 'Tourist Deck', icon: '🛏️', desc: 'Comfort Beds' },
    { id: 'business', name: 'Business Deck', icon: '👑', desc: 'Premium Cabins' },
  ];

  return (
    <section
      className="bg-gray-50 px-6 py-6 border-b border-gray-200"
      aria-label="Select accommodation class"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-gray-900 mb-4">Your Cabin</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => onClassChange(cls.id as AccommodationClass)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                currentClass === cls.id
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
              aria-selected={currentClass === cls.id}
              aria-label={`${cls.name}: ${cls.desc}`}
            >
              <span className="text-lg mr-2">{cls.icon}</span>
              <div className="text-left">
                <div>{cls.name}</div>
                <div className="text-xs opacity-75">{cls.desc}</div>
              </div>
            </button>
          ))}
        </div>
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
        if (isInteractive) {
          onSelect(seat.id);
        }
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
      aria-label={`Seat ${seat.id}, ${seat.state === 'occupied' ? 'Occupied' : 'Available'}, ${seat.class} class, ₱${seat.price}`}
      aria-pressed={isSelected}
      title={`${seat.id} - ${seat.state} - ₱${seat.price}`}
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
 * Seat Map Grid with Aisle Visualization
 */
interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Set<string>;
  onSeatSelect: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onSeatSelect }) => {
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
      className="bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-12 border-b border-gray-200"
      aria-label="Seat selection grid"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Seats</h2>
          <p className="text-sm text-gray-600">Click any green seat to book • Tap to select</p>
        </div>

        {/* Deck Floor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 overflow-auto">
          {/* BOW Label */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-600 tracking-widest">▶ BOW (FRONT) ▶</p>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-6">
            {seatsByRow.map(([row, rowSeats]) => (
              <div key={row} className="flex items-center gap-4">
                {/* Row Label */}
                <span className="w-8 text-center font-bold text-gray-700 text-sm flex-shrink-0">
                  {row}
                </span>

                {/* Seat Block 1 (Left side) */}
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

                {/* Seat Block 2 (Right side) */}
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
          <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-600 tracking-widest">◀ STERN (BACK) ◀</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <div className="w-6 h-6 bg-white border-2 border-blue-300 rounded" />
            <span className="text-sm font-medium text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <div className="w-6 h-6 bg-blue-900 rounded flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <div className="w-6 h-6 bg-gray-300 rounded opacity-50" />
            <span className="text-sm font-medium text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <div className="w-6 h-6 bg-red-100 rounded border border-red-300" />
            <span className="text-sm font-medium text-gray-700">Blocked</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Sticky Summary Bar
 * Progressive disclosure: only appears when seats selected
 */
interface StickySummaryBarProps {
  selectedSeats: Seat[];
  totalPrice: number;
  isVisible: boolean;
  onBooking: () => void;
  onClear: () => void;
  prefersReducedMotion: boolean;
}

const StickySummaryBar: React.FC<StickySummaryBarProps> = ({
  selectedSeats,
  totalPrice,
  isVisible,
  onBooking,
  onClear,
  prefersReducedMotion,
}) => {
  if (!isVisible) return null;

  const seatIds = selectedSeats.map((s) => s.id).join(', ');

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-blue-900 text-white shadow-2xl border-t-4 border-yellow-400 z-50 transition-transform ${
        !prefersReducedMotion ? 'animate-slideUp' : ''
      }`}
      role="region"
      aria-label="Booking summary"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Selected Seats */}
        <div>
          <p className="text-xs font-semibold opacity-75">SELECTED SEATS</p>
          <p className="text-lg font-bold text-yellow-300">{seatIds}</p>
        </div>

        {/* Center: Total Price */}
        <div className="flex-1">
          <p className="text-xs font-semibold opacity-75">TOTAL FARE</p>
          <p className="text-3xl font-bold text-yellow-300">₱{totalPrice.toLocaleString()}</p>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition-colors"
            aria-label="Clear seat selection"
          >
            Clear
          </button>
          <button
            onClick={onBooking}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded font-bold text-sm transition-colors shadow-lg"
            aria-label="Proceed to booking"
          >
            ✓ BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export interface SeatSelectionBookingV2Props {
  tripId: string;
  tripName?: string;
  basePrice?: number;
  onBookingSubmit?: (selectedSeats: Seat[]) => void;
}

export const SeatSelectionBookingV2: React.FC<SeatSelectionBookingV2Props> = ({
  tripId,
  tripName = 'Ferry Booking',
  basePrice = 1500,
  onBookingSubmit,
}) => {
  const [currentClass, setCurrentClass] = useState<AccommodationClass>('economy');
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const handleSeatClick = useCallback((seatId: string) => {
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

  const handleClassChange = useCallback((newClass: AccommodationClass) => {
    setCurrentClass(newClass);
    setSelectedSeatIds(new Set()); // Clear selection when switching classes
  }, []);

  const handleBooking = useCallback(() => {
    if (onBookingSubmit && selectedSeatsData.length > 0) {
      onBookingSubmit(selectedSeatsData);
    } else {
      alert(`✓ Booking confirmed!\n\nSeats: ${selectedSeatsData.map((s) => s.id).join(', ')}\nTotal: ₱${totalPrice.toLocaleString()}`);
    }
  }, [selectedSeatsData, totalPrice, onBookingSubmit]);

  const handleClear = useCallback(() => {
    setSelectedSeatIds(new Set());
  }, []);

  return (
    <div className="w-full min-h-screen bg-white pb-24">
      {/* Sticky Header */}
      <StickyHeader
        tripName={tripName}
        basePrice={basePrice}
        selectedCount={selectedSeatsData.length}
        isCollapsed={isHeaderCollapsed}
      />

      {/* Accommodation Selector */}
      <ClassSelector currentClass={currentClass} onClassChange={handleClassChange} />

      {/* Main Seat Map */}
      <SeatMap seats={currentSeats} selectedSeats={selectedSeatIds} onSeatSelect={handleSeatClick} />

      {/* Sticky Summary Bar (Progressive Disclosure) */}
      <StickySummaryBar
        selectedSeats={selectedSeatsData}
        totalPrice={totalPrice}
        isVisible={selectedSeatsData.length > 0}
        onBooking={handleBooking}
        onClear={handleClear}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Empty State */}
      {selectedSeatsData.length === 0 && (
        <section className="text-center py-16 text-gray-500">
          <p className="text-lg">👇 Start by selecting a seat above</p>
        </section>
      )}
    </div>
  );
};

export default SeatSelectionBookingV2;
