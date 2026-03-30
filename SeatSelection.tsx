import React, { useState, useMemo } from 'react';
import { Check, X, AlertCircle, Coffee } from 'lucide-react';

// Design Tokens - Atomic Design System
const TOKENS = {
  colors: {
    semantic: {
      available: '#10B981',    // Green (from legacy #90EE90 equivalent)
      selected: '#0066CC',     // Navy blue (primary)
      reserved: '#F59E0B',     // Amber/Orange
      blocked: '#EF4444',      // Red
      landmark: {
        toilet: '#06B6D4',     // Cyan
        exit: '#F97316',       // Orange
        lifeJacket: '#FBBF24', // Yellow
        canteen: '#A855F7',    // Purple
      },
    },
    neutral: {
      surface: '#F9FAFB',
      border: '#E5E7EB',
      text: '#1F2937',
      textLight: '#6B7280',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  touchTarget: '44px', // WCAG minimum
};

// Seat Types
type SeatState = 'available' | 'selected' | 'reserved' | 'blocked';
type LandmarkType = 'toilet' | 'exit' | 'lifeJacket' | 'canteen' | null;

interface Seat {
  id: string;
  row: string;
  col: number;
  state: SeatState;
  price: number;
  class: 'economy' | 'tourist' | 'business';
  landmark?: LandmarkType;
}

interface SelectionFeedback {
  seatId: string;
  seatName: string;
  price: number;
  class: string;
}

// Landmark Renderer
const LandmarkIcon: React.FC<{ type: LandmarkType; size: number }> = ({ type, size }) => {
  const baseProps = { size, strokeWidth: 1.5 };
  switch (type) {
    case 'toilet':
      return <span style={{ fontSize: `${size}px` }}>🚻</span>;
    case 'exit':
      return <AlertCircle {...baseProps} color={TOKENS.colors.semantic.landmark.exit} />;
    case 'lifeJacket':
      return <span style={{ fontSize: `${size}px` }}>🦺</span>;
    case 'canteen':
      return <Coffee {...baseProps} color={TOKENS.colors.semantic.landmark.canteen} />;
    default:
      return null;
  }
};

// Seat Component
const SeatButton: React.FC<{
  seat: Seat;
  isSelected: boolean;
  onSelect: (seat: Seat) => void;
  onDeselect: (seatId: string) => void;
}> = ({ seat, isSelected, onSelect, onDeselect }) => {
  const baseColor = {
    available: TOKENS.colors.semantic.available,
    selected: TOKENS.colors.semantic.selected,
    reserved: TOKENS.colors.semantic.reserved,
    blocked: TOKENS.colors.semantic.blocked,
  }[seat.state];

  const isDisabled = seat.state === 'reserved' || seat.state === 'blocked';
  const cursor = isDisabled ? 'not-allowed' : 'pointer';

  // Landmark seats don't show traditional seat styling
  if (seat.landmark) {
    return (
      <div
        style={{
          width: TOKENS.touchTarget,
          height: TOKENS.touchTarget,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: {
            toilet: TOKENS.colors.semantic.landmark.toilet,
            exit: TOKENS.colors.semantic.landmark.exit,
            lifeJacket: TOKENS.colors.semantic.landmark.lifeJacket,
            canteen: TOKENS.colors.semantic.landmark.canteen,
          }[seat.landmark],
          borderRadius: '6px',
          opacity: 0.2,
          cursor: 'default',
          border: `2px solid ${TOKENS.colors.neutral.border}`,
        }}
        title={seat.landmark.toUpperCase()}
        className="flex-shrink-0"
      >
        <LandmarkIcon type={seat.landmark} size={20} />
      </div>
    );
  }

  return (
    <button
      onClick={() => (isSelected ? onDeselect(seat.id) : onSelect(seat))}
      disabled={isDisabled}
      style={{
        width: TOKENS.touchTarget,
        height: TOKENS.touchTarget,
        backgroundColor: isSelected ? baseColor : TOKENS.colors.neutral.surface,
        border: `2px solid ${baseColor}`,
        borderRadius: '6px',
        cursor,
        fontSize: '12px',
        fontWeight: isSelected ? '600' : '500',
        color: isSelected ? 'white' : TOKENS.colors.semantic.landmark.exit,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        opacity: isDisabled ? 0.5 : 1,
      }}
      className="flex-shrink-0 hover:shadow-md active:scale-95"
      title={`${seat.row}${seat.col} - ${seat.state} (${seat.class})`}
    >
      {isSelected && <Check size={16} />}
      {!isSelected && !isDisabled && <span>{seat.row}{seat.col}</span>}
      {isDisabled && <X size={16} />}
    </button>
  );
};

// Legend
const Legend: React.FC = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: TOKENS.spacing.md,
      marginBottom: TOKENS.spacing.lg,
      padding: TOKENS.spacing.md,
      backgroundColor: TOKENS.colors.neutral.surface,
      borderRadius: '8px',
    }}
  >
    {[
      { label: 'Available', color: TOKENS.colors.semantic.available },
      { label: 'Selected', color: TOKENS.colors.semantic.selected },
      { label: 'Reserved', color: TOKENS.colors.semantic.reserved },
      { label: 'Blocked', color: TOKENS.colors.semantic.blocked },
    ].map(({ label, color }) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: TOKENS.spacing.sm }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '4px',
            border: `2px solid ${color}`,
          }}
        />
        <span style={{ fontSize: '12px', color: TOKENS.colors.neutral.textLight }}>{label}</span>
      </div>
    ))}
  </div>
);

// Class Switcher (Horizontal Cards)
const ClassSwitcher: React.FC<{
  selectedClass: string;
  onSelectClass: (classType: string) => void;
}> = ({ selectedClass, onSelectClass }) => {
  const classes = [
    { id: 'economy', label: 'Economy', icon: '🪑', count: 120 },
    { id: 'tourist', label: 'Tourist', icon: '🛋️', count: 45 },
    { id: 'business', label: 'Business', icon: '💼', count: 30 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: TOKENS.spacing.md,
        overflowX: 'auto',
        paddingBottom: TOKENS.spacing.md,
        marginBottom: TOKENS.spacing.lg,
      }}
      className="scrollbar-hide"
    >
      {classes.map(({ id, label, icon, count }) => (
        <button
          key={id}
          onClick={() => onSelectClass(id)}
          style={{
            minWidth: '140px',
            padding: TOKENS.spacing.lg,
            backgroundColor: selectedClass === id ? TOKENS.colors.semantic.selected : TOKENS.colors.neutral.surface,
            border: `2px solid ${TOKENS.colors.neutral.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            color: selectedClass === id ? 'white' : TOKENS.colors.neutral.text,
          }}
          className="hover:shadow-md flex-shrink-0"
        >
          <div style={{ fontSize: '24px', marginBottom: TOKENS.spacing.xs }}>{icon}</div>
          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: TOKENS.spacing.xs }}>{label}</div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>({count} seats)</div>
        </button>
      ))}
    </div>
  );
};

// Seat Grid with Row Labels
const SeatGrid: React.FC<{
  seats: Seat[];
  selectedSeats: Set<string>;
  onSelect: (seat: Seat) => void;
  onDeselect: (seatId: string) => void;
}> = ({ seats, selectedSeats, onSelect, onDeselect }) => {
  // Group seats by row
  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    return grouped;
  }, [seats]);

  const rows = Object.keys(seatsByRow).sort();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing.lg }}>
      {rows.map((row) => (
        <div key={row} style={{ display: 'flex', gap: TOKENS.spacing.md, alignItems: 'flex-start' }}>
          {/* Row Label */}
          <div
            style={{
              width: TOKENS.touchTarget,
              height: TOKENS.touchTarget,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              color: TOKENS.colors.semantic.blocked,
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            {row}
          </div>

          {/* Seats in Row */}
          <div style={{ display: 'flex', gap: TOKENS.spacing.md, flexWrap: 'wrap' }}>
            {seatsByRow[row]
              .sort((a, b) => a.col - b.col)
              .map((seat) => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeats.has(seat.id)}
                  onSelect={onSelect}
                  onDeselect={onDeselect}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Bottom Selection Feedback Bar
const SelectionFeedbackBar: React.FC<{
  selections: SelectionFeedback[];
  onContinue: () => void;
}> = ({ selections, onContinue }) => {
  const totalPrice = selections.reduce((sum, s) => sum + s.price, 0);

  if (selections.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: TOKENS.colors.semantic.selected,
        color: 'white',
        padding: TOKENS.spacing.lg,
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div>
        <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: TOKENS.spacing.xs }}>
          {selections.length} seat{selections.length > 1 ? 's' : ''} selected
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₱ {totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
        <div style={{ fontSize: '11px', opacity: 0.8, marginTop: TOKENS.spacing.xs }}>
          {selections.map((s) => `${s.seatName}`).join(', ')}
        </div>
      </div>

      <button
        onClick={onContinue}
        style={{
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
          padding: `${TOKENS.spacing.md} ${TOKENS.spacing.xl}`,
          borderRadius: '6px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '14px',
        }}
        className="hover:bg-green-600 active:scale-95"
      >
        Continue
      </button>
    </div>
  );
};

// Main Component
export const SeatSelectionUI: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('economy');
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Mock seat data - realistic ferry configuration
  const mockSeats: Seat[] = useMemo(() => {
    const seats: Seat[] = [];

    // Row A-D: Economy (44 seats)
    for (let row of ['A', 'B', 'C', 'D']) {
      for (let col = 1; col <= 11; col++) {
        const id = `${row}${col}`;
        // Add a toilet at D11
        if (id === 'D11') {
          seats.push({
            id,
            row,
            col,
            state: 'blocked',
            price: 0,
            class: 'economy',
            landmark: 'toilet',
          });
        } else {
          seats.push({
            id,
            row,
            col,
            state: Math.random() > 0.7 ? 'reserved' : 'available',
            price: 2469,
            class: 'economy',
          });
        }
      }
      // Add exit marker
      seats.push({
        id: `${row}-EXIT`,
        row,
        col: 12,
        state: 'blocked',
        price: 0,
        class: 'economy',
        landmark: 'exit',
      });
    }

    // Row E-F: Tourist (30 seats)
    for (let row of ['E', 'F']) {
      for (let col = 1; col <= 15; col++) {
        const id = `${row}${col}`;
        if (id === 'E15') {
          seats.push({
            id,
            row,
            col,
            state: 'blocked',
            price: 0,
            class: 'tourist',
            landmark: 'lifeJacket',
          });
        } else {
          seats.push({
            id,
            row,
            col,
            state: Math.random() > 0.6 ? 'reserved' : 'available',
            price: 3500,
            class: 'tourist',
          });
        }
      }
    }

    // Row G-H: Business (20 seats)
    for (let row of ['G', 'H']) {
      for (let col = 1; col <= 10; col++) {
        const id = `${row}${col}`;
        seats.push({
          id,
          row,
          col,
          state: Math.random() > 0.8 ? 'reserved' : 'available',
          price: 5999,
          class: 'business',
        });
      }
    }

    // Add canteen landmark
    seats.push({
      id: 'CANTEEN-1',
      row: 'H',
      col: 10,
      state: 'blocked',
      price: 0,
      class: 'business',
      landmark: 'canteen',
    });

    return seats;
  }, []);

  const filteredSeats = useMemo(() => mockSeats.filter((s) => s.class === selectedClass), [mockSeats, selectedClass]);

  const handleSelectSeat = (seat: Seat) => {
    const newSet = new Set(selectedSeats);
    newSet.add(seat.id);
    setSelectedSeats(newSet);
  };

  const handleDeselectSeat = (seatId: string) => {
    const newSet = new Set(selectedSeats);
    newSet.delete(seatId);
    setSelectedSeats(newSet);
  };

  const selections: SelectionFeedback[] = Array.from(selectedSeats)
    .map((id) => mockSeats.find((s) => s.id === id))
    .filter((s): s is Seat => s !== undefined && !s.landmark)
    .map((s) => ({
      seatId: s.id,
      seatName: `${s.row}${s.col}`,
      price: s.price,
      class: s.class,
    }));

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: TOKENS.colors.neutral.surface,
        padding: TOKENS.spacing.lg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: TOKENS.spacing.xl }}>
        <h1 style={{ color: TOKENS.colors.neutral.text, fontSize: '24px', fontWeight: '700', marginBottom: TOKENS.spacing.sm }}>
          Select Your Seats
        </h1>
        <p style={{ color: TOKENS.colors.neutral.textLight, fontSize: '14px' }}>
          Choose your preferred accommodation • {filteredSeats.filter((s) => s.state === 'available').length} available
        </p>
      </div>

      {/* Legend */}
      <Legend />

      {/* Class Switcher */}
      <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: TOKENS.spacing.md, color: TOKENS.colors.neutral.text }}>
        Accommodation Class
      </h2>
      <ClassSwitcher selectedClass={selectedClass} onSelectClass={setSelectedClass} />

      {/* Vessel Info Card */}
      <div
        style={{
          backgroundColor: 'white',
          padding: TOKENS.spacing.lg,
          borderRadius: '8px',
          marginBottom: TOKENS.spacing.xl,
          border: `1px solid ${TOKENS.colors.neutral.border}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: TOKENS.spacing.md }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: TOKENS.colors.neutral.text }}>Ferry: MTCC Superferry 3</h3>
            <p style={{ fontSize: '13px', color: TOKENS.colors.neutral.textLight }}>Manila → Cebu • 16:30 - 06:30+1</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: TOKENS.colors.neutral.textLight }}>From</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: TOKENS.colors.semantic.selected }}>₱2,469</div>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div style={{ marginBottom: '200px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: TOKENS.spacing.md, color: TOKENS.colors.neutral.text }}>
          {selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)} Class Seating
        </h2>
        <SeatGrid seats={filteredSeats} selectedSeats={selectedSeats} onSelect={handleSelectSeat} onDeselect={handleDeselectSeat} />
      </div>

      {/* Bottom Feedback Bar */}
      <SelectionFeedbackBar selections={selections} onContinue={() => alert(`Proceeding with: ${selections.map((s) => s.seatName).join(', ')}`)} />
    </div>
  );
};

export default SeatSelectionUI;
