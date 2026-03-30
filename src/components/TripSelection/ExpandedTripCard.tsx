import React, { useState, useMemo } from 'react';
import { ChevronUp, X, AlertCircle } from 'lucide-react';

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
  const isFerry = vesselType.toLowerCase() === 'ferry';

  return (
    <div className="mb-8 p-6 bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg border border-slate-200">
      <h3 className="text-sm font-bold text-slate-600 uppercase mb-6">Ship Layout Overview</h3>

      {/* Simple Ship Diagram */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
        <div className="text-center">
          {/* Simple text-based ship visualization */}
          <div className="font-mono text-xs leading-loose">
            <div className="text-red-600 font-bold">↑ BOW</div>
            <div className="text-2xl my-2">███████████</div>
            <div className="text-slate-700 text-sm mb-2">Main Hull (Ship's Body)</div>
            <div className="grid grid-cols-5 gap-2 my-4 place-items-center">
              {Array.from({ length: decks }).map((_, i) => (
                <div
                  key={i}
                  className="w-full px-3 py-2 bg-slate-200 border border-slate-400 rounded text-xs font-bold text-slate-700"
                >
                  D{i + 1}
                </div>
              ))}
            </div>
            <div className="text-slate-600 text-xs mb-2">Decks (Floors)</div>
            <div className="text-2xl my-2">███████████</div>
            <div className="text-blue-600 font-bold">↓ STERN</div>
          </div>
        </div>
      </div>

      {/* Ship Info */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-slate-200">
        <div className="text-center">
          <p className="text-xs text-slate-600 font-semibold">TYPE</p>
          <p className="text-sm font-bold text-slate-900 capitalize">{vesselType}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-600 font-semibold">DECKS</p>
          <p className="text-sm font-bold text-slate-900">{decks}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-600 font-semibold">CAPACITY</p>
          <p className="text-sm font-bold text-slate-900">500+ pax</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ACCOMMODATION TABS COMPONENT
// ============================================================================

interface AccommodationTabsProps {
  accommodations: AccommodationClass[];
  selectedType: string;
  onSelectType: (type: string) => void;
}

const AccommodationTabs: React.FC<AccommodationTabsProps> = ({
  accommodations,
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-slate-600 uppercase mb-4">
        Choose Your Accommodation
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {accommodations.map((acc) => (
          <button
            key={acc.type}
            onClick={() => onSelectType(acc.type)}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              selectedType === acc.type
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <p className="text-lg font-bold text-slate-900 capitalize">{acc.label}</p>
            <p className="text-xs text-slate-600 mt-2">
              {acc.available}/{acc.total} available
            </p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              ₱{acc.basePrice.toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// CLASS SELECTION COMPONENT
// ============================================================================

interface ClassSelectionProps {
  classes: AccommodationClass['classes'];
  selectedClass: string | null;
  onSelectClass: (className: string) => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({
  classes,
  selectedClass,
  onSelectClass,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-slate-600 uppercase mb-4">
        Select Class
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {classes.map((cls) => (
          <button
            key={cls.name}
            onClick={() => onSelectClass(cls.name)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedClass === cls.name
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <p className="text-base font-bold text-slate-900">{cls.label}</p>
            <ul className="text-xs text-slate-600 mt-2 space-y-1">
              {cls.features.slice(0, 2).map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mt-2 font-semibold">
              {cls.seats.filter((s) => s.status === 'available').length} available
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SEAT MAP COMPONENT
// ============================================================================

interface SeatMapProps {
  seats: SeatPosition[];
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
  maxSeats: number;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onToggleSeat, maxSeats }) => {
  const rows = Math.max(...seats.map((s) => s.row)) + 1;
  const cols = Math.max(...seats.map((s) => s.column)) + 1;
  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      seats.find((s) => s.row === r && s.column === c)
    )
  );

  const rowLabels = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const canAddMore = selectedSeats.length < maxSeats;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-600 uppercase">Select Your Seats</h3>
        <p className="text-xs text-slate-600 font-semibold">
          {selectedSeats.length} / {maxSeats} selected
        </p>
      </div>

      {/* Seat legend */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-green-600 rounded" />
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-300 rounded" />
          <span className="text-slate-600">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span className="text-slate-600">Selected</span>
        </div>
      </div>

      {/* Seat grid */}
      <div className="bg-slate-50 p-4 rounded-lg overflow-x-auto border border-slate-200">
        <div className="inline-block">
          {/* Column headers */}
          <div className="flex gap-1 mb-2">
            <div className="w-6" />
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} className="w-8 h-6 flex items-center justify-center text-xs font-semibold text-slate-600">
                {c + 1}
              </div>
            ))}
          </div>

          {/* Rows */}
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 mb-2">
              <div className="w-6 h-8 flex items-center justify-center text-xs font-semibold text-slate-600">
                {rowLabels[rowIdx]}
              </div>
              {row.map((seat, colIdx) => {
                if (!seat) {
                  return (
                    <div
                      key={`empty-${rowIdx}-${colIdx}`}
                      className="w-8 h-8 flex-shrink-0"
                    />
                  );
                }

                const isSelected = selectedSeats.includes(seat.id);

                return (
                  <button
                    key={seat.id}
                    onClick={() => {
                      if (seat.status === 'occupied') return;
                      if (isSelected || canAddMore) {
                        onToggleSeat(seat.id);
                      }
                    }}
                    disabled={seat.status === 'occupied'}
                    className={`w-8 h-8 rounded flex-shrink-0 transition-all ${
                      seat.status === 'occupied'
                        ? 'bg-slate-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 border-2 border-blue-800 cursor-pointer hover:bg-blue-700'
                        : 'bg-white border-2 border-green-600 cursor-pointer hover:bg-green-50'
                    }`}
                    title={`${seat.id} - ${seat.status}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {!canAddMore && selectedSeats.length > 0 && (
        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
          <AlertCircle size={14} /> Maximum {maxSeats} seat(s) selected
        </p>
      )}
    </div>
  );
};

// ============================================================================
// MAIN EXPANDED TRIP CARD COMPONENT
// ============================================================================

export const ExpandedTripCard: React.FC<ExpandedTripCardProps> = ({
  trip,
  isExpanded,
  onClose,
}) => {
  const [step, setStep] = useState<'overview' | 'accommodation' | 'class' | 'seats'>('overview');
  const [selectedAccommodationType, setSelectedAccommodationType] = useState<string>(
    trip.accommodations[0]?.type || 'seats'
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
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

  return (
    <div className="w-full bg-white border-2 border-blue-300 rounded-lg overflow-hidden shadow-lg">
      {/* Expanded Trip Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{trip.vessel.name}</h2>
          <p className="text-sm text-blue-100">
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

      {/* Expanded Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Step 1: Ship Overview */}
        {step === 'overview' && (
          <>
            <ShipSilhouette vesselType={trip.vessel.type} decks={trip.vessel.decks} />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('accommodation')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step 2: Accommodation Selection */}
        {step === 'accommodation' && (
          <>
            <AccommodationTabs
              accommodations={trip.accommodations}
              selectedType={selectedAccommodationType}
              onSelectType={(type) => {
                setSelectedAccommodationType(type);
                setSelectedClass(null);
                setSelectedSeats([]);
              }}
            />

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setStep('overview')}
                className="px-6 py-3 text-slate-700 font-semibold bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('class')}
                disabled={!selectedAccommodationType}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Class Selection */}
        {step === 'class' && currentAccommodation && (
          <>
            <ClassSelection
              classes={currentAccommodation.classes}
              selectedClass={selectedClass}
              onSelectClass={(name) => {
                setSelectedClass(name);
                setSelectedSeats([]);
                setStep('seats');
              }}
            />

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setStep('accommodation')}
                className="px-6 py-3 text-slate-700 font-semibold bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('seats')}
                disabled={!selectedClass}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step 4: Seat Selection */}
        {step === 'seats' && selectedClass && currentClassObj && (
          <>
            <SeatMap
              seats={currentClassObj.seats}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
              maxSeats={3}
            />

            {selectedSeats.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 mb-6">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">Selected Seats:</span> {selectedSeats.join(', ')}
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  ₱{totalPrice.toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setStep('class')}
                className="px-6 py-3 text-slate-700 font-semibold bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (selectedSeats.length > 0) {
                    alert(`Booking confirmed: ${selectedSeats.join(', ')} - ₱${totalPrice.toLocaleString()}`);
                  }
                }}
                disabled={selectedSeats.length === 0}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-lg"
              >
                ✓ Confirm Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpandedTripCard;
