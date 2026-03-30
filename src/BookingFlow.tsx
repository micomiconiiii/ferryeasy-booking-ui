import React, { useState } from 'react'
import { ExpandingTripCard, SeatMapView, StickySummaryBar } from './ProgressiveDisclosure'

interface AppState {
  expandedTrip: string | null
  selectedZone: string | null
  selectedSeats: string[]
}

export default function BookingFlowApp() {
  const [state, setState] = useState<AppState>({
    expandedTrip: null,
    selectedZone: null,
    selectedSeats: [],
  })

  // Mock trips data
  const trips = [
    {
      id: 'trip-1',
      date: '2026-04-05',
      route: 'Piraeus → Mykonos',
      price: 45,
      duration: '2h 30m',
      departure: '08:00',
      arrival: '10:30',
      zones: [
        {
          id: 'zone-1',
          name: 'Front Deck',
          class: 'ECONOMY' as const,
          position: { x: 0, y: 0, width: 100, height: 100 },
          seats: [],
        },
        {
          id: 'zone-2',
          name: 'Middle Deck',
          class: 'TOURIST' as const,
          position: { x: 100, y: 0, width: 100, height: 100 },
          seats: [],
        },
        {
          id: 'zone-3',
          name: 'VIP Lounge',
          class: 'BUSINESS' as const,
          position: { x: 200, y: 0, width: 100, height: 100 },
          seats: [],
        },
      ],
      landmarks: [
        { id: 'toilet-1', type: 'TOILET' as const, zone: 'zone-1', position: { x: 40, y: 20 } },
        { id: 'exit-1', type: 'EXIT' as const, zone: 'zone-1', position: { x: 80, y: 50 } },
        { id: 'canteen-1', type: 'CANTEEN' as const, zone: 'zone-2', position: { x: 120, y: 40 } },
      ],
    },
    {
      id: 'trip-2',
      date: '2026-04-05',
      route: 'Mykonos → Naxos',
      price: 32,
      duration: '1h 15m',
      departure: '12:00',
      arrival: '13:15',
      zones: [
        {
          id: 'zone-4',
          name: 'Main Deck',
          class: 'ECONOMY' as const,
          position: { x: 0, y: 0, width: 150, height: 100 },
          seats: [],
        },
        {
          id: 'zone-5',
          name: 'Upper Deck',
          class: 'BUSINESS' as const,
          position: { x: 150, y: 0, width: 100, height: 100 },
          seats: [],
        },
      ],
      landmarks: [
        { id: 'toilet-2', type: 'TOILET' as const, zone: 'zone-4', position: { x: 50, y: 30 } },
      ],
    },
  ]

  const handleExpandTrip = (tripId: string) => {
    setState((prev) => ({
      ...prev,
      expandedTrip: tripId,
      selectedZone: null,
      selectedSeats: [],
    }))
  }

  const handleCollapseTrip = () => {
    setState((prev) => ({
      ...prev,
      expandedTrip: null,
      selectedZone: null,
      selectedSeats: [],
    }))
  }

  const handleSelectZone = (zoneId: string) => {
    setState((prev) => ({
      ...prev,
      selectedZone: zoneId,
    }))
  }

  const handleBackToDeck = () => {
    setState((prev) => ({
      ...prev,
      selectedZone: null,
    }))
  }

  const handleSelectSeat = (seatId: string) => {
    setState((prev) => ({
      ...prev,
      selectedSeats: prev.selectedSeats.includes(seatId)
        ? prev.selectedSeats.filter((s) => s !== seatId)
        : [...prev.selectedSeats, seatId],
    }))
  }

  const handleProceed = () => {
    alert(
      `Proceeding with seats: ${state.selectedSeats.join(', ')}\nTotal: €${state.selectedSeats.length * 45}`,
    )
  }

  const expandedTrip = trips.find((t) => t.id === state.expandedTrip)
  const selectedZone = expandedTrip?.zones.find((z) => z.id === state.selectedZone)
  const totalPrice = state.selectedSeats.length * (expandedTrip?.price || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⛴️ FerryEasy Booking</h1>
          <p className="text-gray-600">Select your perfect trip and seats</p>
        </header>

        {/* Main Content */}
        <div className="space-y-4">
          {state.expandedTrip && expandedTrip ? (
            // EXPANDED VIEW: Trip Card + Deck Overview OR Seat Map
            <div className="space-y-4">
              {!state.selectedZone ? (
                // Still showing Deck Overview
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <ExpandingTripCard
                    trip={expandedTrip}
                    isExpanded={true}
                    onExpand={() => {}}
                    onCollapse={handleCollapseTrip}
                  />

                  {/* Zone Selection Grid */}
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {expandedTrip.zones.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => handleSelectZone(zone.id)}
                        className={`
                          p-6 rounded-lg border-2 font-semibold transition-all transform
                          ${
                            zone.class === 'ECONOMY'
                              ? 'bg-green-50 border-green-300 text-green-900 hover:shadow-lg hover:scale-105'
                              : zone.class === 'TOURIST'
                                ? 'bg-amber-50 border-amber-300 text-amber-900 hover:shadow-lg hover:scale-105'
                                : 'bg-purple-50 border-purple-300 text-purple-900 hover:shadow-lg hover:scale-105'
                          }
                          active:scale-95
                        `}
                      >
                        <div className="text-lg">{zone.name}</div>
                        <div className="text-xs mt-2 opacity-75">{zone.class}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Showing Seat Map
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <SeatMapView
                    zone={selectedZone}
                    selectedSeats={state.selectedSeats}
                    landmarks={expandedTrip.landmarks}
                    onSeatSelect={handleSelectSeat}
                    onBack={handleBackToDeck}
                  />
                </div>
              )}
            </div>
          ) : (
            // TRIP LIST VIEW: Show all trips as collapsed cards
            <div className="space-y-3">
              {trips.map((trip) => (
                <ExpandingTripCard
                  key={trip.id}
                  trip={trip}
                  isExpanded={false}
                  onExpand={() => handleExpandTrip(trip.id)}
                  onCollapse={handleCollapseTrip}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Summary Bar - Only show when seats selected */}
      <StickySummaryBar
        selectedSeats={state.selectedSeats}
        totalPrice={totalPrice}
        isVisible={state.selectedSeats.length > 0}
        onProceed={handleProceed}
      />
    </div>
  )
}
