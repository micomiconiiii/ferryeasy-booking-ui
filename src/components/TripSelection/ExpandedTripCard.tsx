import React, { useState, useMemo } from 'react';
import { ChevronUp, AlertCircle } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SeatPosition {
  id: string;
  row: number;
  column: number;
  class: 'economy' | 'business';
  status: 'available' | 'occupied' | 'selected';
}

interface AccommodationClass {
  type: 'seats' | 'beds' | 'cabins';
  label: string;
  total: number;
  available: number;
  basePrice: number;
  classes: {
    name: 'economy' | 'business';
    label: string;
    seats: SeatPosition[];
    features: string[];
  }[];
}

interface Trip {
  id: string;
  vessel: {
    name: string;
    type: string;
    capacity: number;
    decks: number;
    amenities: string[];
  };
  route: {
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
  };
  price: number;
  accommodations: AccommodationClass[];
}

interface ExpandedTripCardProps {
  trip: Trip;
  isExpanded: boolean;
  onClose: () => void;
}

// ============================================================================
// SHIP SILHOUETTE COMPONENT
// ============================================================================

const ShipSilhouette: React.FC<{ vesselType: string; decks: number }> = ({ vesselType, decks }) => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg border border-slate-200">
      <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">Ship Layout Overview</h3>

      {/* Simple Ship Diagram */}
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-center">
          <div className="font-mono text-xs leading-relaxed">
            <div className="text-red-600 font-bold text-sm">↑ BOW</div>
            <div className="text-xl my-1">███████</div>
            <div className="grid grid-cols-4 gap-1 my-2 place-items-center">
              {Array.from({ length: Math.min(decks, 4) }).map((_, i) => (
                <div
                  key={i}
                  className="w-full px-2 py-1 bg-slate-200 border border-slate-400 rounded text-xs font-bold text-slate-700"
                >
                  D{i + 1}
                </div>
              ))}
            </div>
            <div className="text-xl my-1">███████</div>
            <div className="text-blue-600 font-bold text-sm">↓ STERN</div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
        <div className="text-center p-2 bg-white rounded border border-slate-200">
          <p className="text-slate-600 font-semibold">{vesselType}</p>
        </div>
        <div className="text-center p-2 bg-white rounded border border-slate-200">
          <p className="text-slate-600 font-semibold">{decks} Decks</p>
        </div>
        <div className="text-center p-2 bg-white rounded border border-slate-200">
          <p className="text-slate-600 font-semibold">500+ pax</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EXPANDED TRIP CARD COMPONENT (ONE FRAME)
// ============================================================================

export const ExpandedTripCard: React.FC<ExpandedTripCardProps> = ({
  trip,
  isExpanded,
  onClose,
}) => {
  const [selectedAccommodationType, setSelectedAccommodationType] = useState<string>(
    trip.accommodations[0]?.type || 'seats'
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    trip.accommodations[0]?.classes[0]?.name || 'economy'
  );
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const currentAccommodation = trip.accommodations.find(
    (acc) => acc.type === selectedAccommodationType
  );

  const currentClassObj = currentAccommodation?.classes.find(
    (cls) => cls.name === selectedClass
  );

  const handleToggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const totalPrice = useMemo(() => {
    if (!currentAccommodation) return 0;
    return selectedSeats.length * currentAccommodation.basePrice;
  }, [selectedSeats, currentAccommodation]);

  if (!isExpanded) return null;

  // Generate seat grid
  const seats = currentClassObj?.seats || [];
  const rows = seats.length > 0 ? Math.max(...seats.map((s) => s.row)) + 1 : 0;
  const cols = seats.length > 0 ? Math.max(...seats.map((s) => s.column)) + 1 : 0;
  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      seats.find((s) => s.row === r && s.column === c)
    )
  );
  const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="w-full bg-white border-2 border-blue-300 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex-1">
          <h2 className="text-lg font-bold">{trip.vessel.name}</h2>
          <p className="text-xs text-blue-100">
            {trip.route.from} → {trip.route.to} | {trip.route.departure} - {trip.route.arrival}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          title="Collapse"
        >
          <ChevronUp size={24} />
        </button>
      </div>

      {/* Single-Frame Content - All in One */}
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        {/* 1. Ship Silhouette */}
        <ShipSilhouette vesselType={trip.vessel.type} decks={trip.vessel.decks} />

        {/* 2. Accommodation Type Selection */}
        <div>
          <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">
            Accommodation Type
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {trip.accommodations.map((acc) => (
              <button
                key={acc.type}
                onClick={() => {
                  setSelectedAccommodationType(acc.type);
                  setSelectedClass(acc.classes[0]?.name || 'economy');
                  setSelectedSeats([]);
                }}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedAccommodationType === acc.type
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="text-sm font-bold text-slate-900 capitalize">{acc.label}</p>
                <p className="text-xs text-slate-600 mt-1">
                  {acc.available}/{acc.total}
                </p>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  ₱{acc.basePrice.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Class Selection */}
        {currentAccommodation && (
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">
              Select Class
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {currentAccommodation.classes.map((cls) => (
                <button
                  key={cls.name}
                  onClick={() => {
                    setSelectedClass(cls.name);
                    setSelectedSeats([]);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedClass === cls.name
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">{cls.label}</p>
                  <ul className="text-xs text-slate-600 mt-1 space-y-0.5">
                    {cls.features.slice(0, 2).map((feature, i) => (
                      <li key={i}>✓ {feature}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    {cls.seats.filter((s) => s.status === 'available').length} available
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Seat Map */}
        {currentClassObj && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase">
                Select Your Seats
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                {selectedSeats.length} selected
              </p>
            </div>

            {/* Seat Legend */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border-2 border-green-600 rounded" />
                <span className="text-slate-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-300 rounded" />
                <span className="text-slate-600">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded" />
                <span className="text-slate-600">Selected</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="bg-slate-50 p-3 rounded-lg overflow-x-auto border border-slate-200">
              <div className="inline-block">
                {/* Column headers */}
                <div className="flex gap-0.5 mb-2">
                  <div className="w-5" />
                  {Array.from({ length: cols }, (_, c) => (
                    <div
                      key={c}
                      className="w-6 h-5 flex items-center justify-center text-xs font-semibold text-slate-600"
                    >
                      {c + 1}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {grid.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-0.5 mb-2">
                    <div className="w-5 h-6 flex items-center justify-center text-xs font-semibold text-slate-600">
                      {rowLabels[rowIdx]}
                    </div>
                    {row.map((seat, colIdx) => {
                      if (!seat) {
                        return (
                          <div
                            key={`empty-${rowIdx}-${colIdx}`}
                            className="w-6 h-6 flex-shrink-0"
                          />
                        );
                      }

                      const isSelected = selectedSeats.includes(seat.id);

                      return (
                        <button
                          key={seat.id}
                          onClick={() => {
                            if (seat.status === 'occupied') return;
                            handleToggleSeat(seat.id);
                          }}
                          disabled={seat.status === 'occupied'}
                          className={`w-6 h-6 rounded flex-shrink-0 transition-all ${
                            seat.status === 'occupied'
                              ? 'bg-slate-300 cursor-not-allowed'
                              : isSelected
                              ? 'bg-blue-600 border-2 border-blue-800 cursor-pointer hover:bg-blue-700'
                              : 'bg-white border-2 border-green-600 cursor-pointer hover:bg-green-50'
                          }`}
                          title={`${seat.id}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {selectedSeats.length === 0 && (
              <p className="text-xs text-slate-500 mt-2 italic">
                Click seats to select them
              </p>
            )}
          </div>
        )}

        {/* 5. Summary & Booking */}
        {selectedSeats.length > 0 && (
          <div className="sticky bottom-0 bg-gradient-to-t from-white to-white pt-4 border-t-2 border-blue-200 -mx-6 px-6 pb-6">
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 mb-4">
              <p className="text-sm text-slate-700 mb-2">
                <span className="font-bold">Selected:</span> {selectedSeats.join(', ')}
              </p>
              <p className="text-xs text-slate-600 mb-3">
                {selectedAccommodationType} • {selectedClass}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ₱{totalPrice.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                alert(
                  `✓ Booking confirmed!\n\nSeats: ${selectedSeats.join(', ')}\nPrice: ₱${totalPrice.toLocaleString()}`
                );
              }}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              ✓ Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandedTripCard;
