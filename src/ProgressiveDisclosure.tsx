import React, { useState } from 'react'
import { ChevronUp, MapPin, Coffee, LifeBuoy, LogOut } from 'lucide-react'
import { tokens } from './design-tokens'

interface Trip {
  id: string
  date: string
  route: string
  price: number
  duration: string
  departure: string
  arrival: string
  zones: Zone[]
  landmarks: Landmark[]
}

interface Zone {
  id: string
  name: string
  class: 'ECONOMY' | 'TOURIST' | 'BUSINESS'
  position: { x: number; y: number; width: number; height: number }
  seats: Seat[]
}

interface Seat {
  id: string
  rowLetter: string
  columnNumber: number
  status: 'AVAILABLE' | 'SELECTED' | 'RESERVED' | 'BLOCKED'
  zone: string
}

interface Landmark {
  id: string
  type: 'TOILET' | 'EXIT' | 'LIFE_JACKET' | 'CANTEEN'
  zone: string
  position: { x: number; y: number }
}

// COMPONENT 1: Trip Card with Expanding Animation
export const ExpandingTripCard: React.FC<{
  trip: Trip
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
}> = ({ trip, isExpanded, onExpand, onCollapse }) => {
  return (
    <div
      className={`
        relative transition-all duration-400 cursor-pointer
        ${
          isExpanded
            ? 'fixed inset-0 z-50 flex items-center justify-center'
            : 'w-full h-24 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md'
        }
      `}
      onClick={!isExpanded ? onExpand : undefined}
    >
      {/* Backdrop */}
      {isExpanded && (
        <div
          className=" absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onCollapse}
          style={{
            animation: 'fadeIn 300ms ease-out',
          }}
        />
      )}

      {/* Card Content - Collapsed State */}
      {!isExpanded && (
        <div className="w-full h-full px-4 py-3 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{trip.route}</p>
            <p className="text-xs text-gray-500 mt-1">
              {trip.date} • {trip.duration}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">€{trip.price}</p>
            <p className="text-xs text-gray-500">{trip.departure} → {trip.arrival}</p>
          </div>
        </div>
      )}

      {/* Expanded State - Deck Overview */}
      {isExpanded && (
        <div
          className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: 'slideUpAndScale 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-6">
            {/* Bow Indicator - Always Visible */}
            <div className="flex items-center gap-2">
              <ChevronUp className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Front (Bow)
              </span>
            </div>
            <button
              onClick={onCollapse}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Trip Info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">{trip.route}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {trip.date} • Departs {trip.departure}
            </p>
          </div>

          {/* Deck Overview (2D Ship Silhouette) */}
          <div className="mb-8 p-6 bg-gradient-to-b from-blue-50 to-transparent rounded-lg border-2 border-blue-200">
            <div className="grid grid-cols-3 gap-4 min-h-[300px]">
              {trip.zones.map((zone) => (
                <DeckZoneButton key={zone.id} zone={zone} />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">
              Accommodation Classes
            </p>
            <div className="grid grid-cols-3 gap-3">
              {['ECONOMY', 'TOURIST', 'BUSINESS'].map((cls) => (
                <div key={cls} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor:
                        cls === 'ECONOMY'
                          ? '#10B981'
                          : cls === 'TOURIST'
                            ? '#F59E0B'
                            : '#8B5CF6',
                    }}
                  />
                  <span className="text-xs text-gray-600">{cls}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUpAndScale {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes seatPop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes particleRadiate {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

// HELPER: Deck Zone Button
const DeckZoneButton: React.FC<{ zone: Zone }> = ({ zone }) => {
  const classColors = {
    ECONOMY: 'bg-green-100 border-green-300 text-green-900',
    TOURIST: 'bg-amber-100 border-amber-300 text-amber-900',
    BUSINESS: 'bg-purple-100 border-purple-300 text-purple-900',
  }

  return (
    <button className={`
      p-4 rounded-lg border-2 transition-all duration-200
      hover:shadow-lg hover:scale-105 active:scale-95
      ${classColors[zone.class]}
    `}>
      <p className="font-semibold text-sm">{zone.name}</p>
      <p className="text-xs mt-1 opacity-75">{zone.class}</p>
    </button>
  )
}

// COMPONENT 2: Detailed Seat Map (shown after zone selection)
export const SeatMapView: React.FC<{
  zone: Zone
  selectedSeats: string[]
  landmarks: Landmark[]
  onSeatSelect: (seatId: string) => void
  onBack: () => void
}> = ({ zone, selectedSeats, landmarks, onSeatSelect, onBack }) => {
  const [animatingSeat, setAnimatingSeat] = useState<string | null>(null)

  const handleSeatClick = (seatId: string) => {
    setAnimatingSeat(seatId)
    setTimeout(() => setAnimatingSeat(null), 300)
    onSeatSelect(seatId)
  }

  return (
    <div className="animate-[slideUp_300ms_ease-out] relative">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-20 pb-4">
        <div className="flex items-center gap-2">
          <ChevronUp className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-semibold text-gray-600 uppercase">Front (Bow)</span>
        </div>
        <button
          onClick={onBack}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Zone Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">{zone.name}</h3>

      {/* Seat Grid */}
      <div className="relative bg-blue-50 p-6 rounded-lg border-2 border-blue-200 overflow-x-auto">
        <div className="flex flex-col gap-4" style={{ minWidth: 'max-content' }}>
          {/* Row Headers */}
          <div className="flex gap-4 items-center">
            <div className="w-12" />
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`col-${i}`} className="w-12 h-10 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-500">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Seats */}
          {Array.from({ length: 14 }).map((_, rowIdx) => (
            <div key={`row-${rowIdx}`} className="flex gap-4 items-center">
              {/* Row Label */}
              <div className="w-12 h-10 flex items-center justify-center sticky left-0 bg-white">
                <span className="text-xs font-bold text-gray-700">
                  {String.fromCharCode(65 + rowIdx)}
                </span>
              </div>

              {/* Seats in Row */}
              {Array.from({ length: 10 }).map((_, colIdx) => {
                const seatId = `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`
                const isSelected = selectedSeats.includes(seatId)
                const isReserved = Math.random() > 0.8
                const isBlocked = Math.random() > 0.9
                const isAnimating = animatingSeat === seatId

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    className={`
                      w-12 h-10 rounded transition-all duration-200
                      ${isBlocked ? 'bg-red-300 cursor-not-allowed opacity-50' : ''}
                      ${isReserved ? 'bg-amber-300 cursor-not-allowed opacity-70' : ''}
                      ${isSelected ? 'bg-blue-600 shadow-lg scale-105' : ''}
                      ${!isBlocked && !isReserved && !isSelected ? 'bg-green-400 hover:bg-green-500 cursor-pointer' : ''}
                      ${isAnimating ? 'animate-[seatPop_150ms_ease-out]' : ''}
                      font-semibold text-xs text-white
                      active:scale-95
                    `}
                    disabled={isBlocked || isReserved}
                    style={isAnimating ? { minHeight: '40px' } : {}}
                  >
                    {seatId}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Landmark Indicators */}
        <div className="mt-8 flex flex-wrap gap-4">
          {landmarks
            .filter((l) => l.zone === zone.id)
            .map((landmark) => (
              <div
                key={landmark.id}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200"
              >
                {landmark.type === 'TOILET' && <LogOut className="w-4 h-4 text-cyan-600" />}
                {landmark.type === 'CANTEEN' && <Coffee className="w-4 h-4 text-purple-600" />}
                {landmark.type === 'LIFE_JACKET' && <LifeBuoy className="w-4 h-4 text-orange-600" />}
                {landmark.type === 'EXIT' && <MapPin className="w-4 h-4 text-red-600" />}
                <span className="text-xs font-medium text-gray-700">
                  {landmark.type.replace('_', ' ')}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

// COMPONENT 3: Sticky Summary Bar with Floating Animation
export const StickySummaryBar: React.FC<{
  selectedSeats: string[]
  totalPrice: number
  isVisible: boolean
  onProceed: () => void
}> = ({ selectedSeats, totalPrice, isVisible, onProceed }) => {
  if (!isVisible) return null

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl
        ${isVisible ? 'animate-[slideUp_250ms_ease-out]' : 'translate-y-full'}
      `}
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Selected Seats Count */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-blue-100 rounded-full">
            <span className="text-sm font-bold text-blue-600">
              {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {selectedSeats.join(', ')}
          </span>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-xs text-gray-600">Total Price</p>
          <p className="text-2xl font-bold text-gray-900">€{totalPrice.toFixed(2)}</p>
        </div>

        {/* Proceed Button */}
        <button
          onClick={onProceed}
          className={`
            ml-4 px-6 py-3 rounded-lg font-semibold transition-all
            bg-blue-600 text-white hover:bg-blue-700 active:scale-95
            shadow-lg hover:shadow-xl
          `}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  )
}
