import React from 'react';
import { TripsList } from '../components/TripSelection/TripsList';

const MOCK_SEATS = (deckCount: number) => {
  const seats = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 6; col++) {
      // Add aisles (skip every 3rd column for visual separation)
      if (col === 3) {
        // Skip - this is an aisle
        continue;
      }

      const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
      const occupied = Math.random() < 0.15; // 15% occupied

      seats.push({
        id: seatId,
        row,
        column: col < 3 ? col : col - 1, // Adjust for aisle
        class: Math.random() < 0.6 ? 'economy' : 'business',
        status: occupied ? 'occupied' : 'available',
      });
    }
  }
  return seats;
};

const mockTrips = [
  {
    id: 'trip-001',
    vessel: {
      name: 'MV Pacific Voyager',
      type: 'Ferry',
      capacity: 500,
      decks: 4,
      amenities: ['Restaurant', 'Lounge', 'WiFi'],
    },
    route: {
      from: 'Manila (MNL)',
      to: 'Mindoro (MDR)',
      departure: '08:00',
      arrival: '10:30',
      duration: '2h 30m',
    },
    price: 690,
    accommodations: [
      {
        type: 'seats',
        label: 'Seats',
        total: 42,
        available: 38,
        basePrice: 690,
        classes: [
          {
            name: 'economy',
            label: 'Economy',
            features: ['Open air seating', 'Ocean views', 'Ventilated'],
            seats: MOCK_SEATS(4).filter((s) => s.class === 'economy').slice(0, 28),
          },
          {
            name: 'business',
            label: 'Business',
            features: ['Reclining seats', 'Priority boarding', 'Extra legroom'],
            seats: MOCK_SEATS(4).filter((s) => s.class === 'business').slice(0, 14),
          },
        ],
      },
      {
        type: 'beds',
        label: 'Beds',
        total: 28,
        available: 22,
        basePrice: 1200,
        classes: [
          {
            name: 'economy',
            label: 'Economy Berth',
            features: ['2-4 person berth', 'Climate-controlled', 'Private curtain'],
            seats: MOCK_SEATS(4).filter((s) => s.class === 'economy').slice(0, 18),
          },
          {
            name: 'business',
            label: 'Business Cabin',
            features: ['Private cabin', 'En-suite bathroom', 'Flat-screen TV'],
            seats: MOCK_SEATS(4).filter((s) => s.class === 'business').slice(0, 10),
          },
        ],
      },
      {
        type: 'cabins',
        label: 'Cabins',
        total: 12,
        available: 10,
        basePrice: 2890,
        classes: [
          {
            name: 'economy',
            label: 'Standard Cabin',
            features: ['Private cabin', 'Bathroom', 'TV'],
            seats: MOCK_SEATS(4).slice(0, 8),
          },
          {
            name: 'business',
            label: 'Deluxe Suite',
            features: ['Luxury suite', 'Jacuzzi bath', 'Butler service'],
            seats: MOCK_SEATS(4).slice(0, 4),
          },
        ],
      },
    ],
  },
  {
    id: 'trip-002',
    vessel: {
      name: 'MV Island Express',
      type: 'Catamaran',
      capacity: 350,
      decks: 2,
      amenities: ['WiFi', 'Restaurant'],
    },
    route: {
      from: 'Manila (MNL)',
      to: 'Mindoro (MDR)',
      departure: '14:00',
      arrival: '17:15',
      duration: '3h 15m',
    },
    price: 890,
    accommodations: [
      {
        type: 'seats',
        label: 'Seats',
        total: 50,
        available: 48,
        basePrice: 890,
        classes: [
          {
            name: 'economy',
            label: 'Economy',
            features: ['Reclining seats', 'Air vents', 'USB charging'],
            seats: MOCK_SEATS(2).filter((s) => s.class === 'economy').slice(0, 35),
          },
          {
            name: 'business',
            label: 'Business',
            features: ['Premium seat', 'Power outlet', 'Blanket & pillow'],
            seats: MOCK_SEATS(2).filter((s) => s.class === 'business').slice(0, 15),
          },
        ],
      },
      {
        type: 'beds',
        label: 'Beds',
        total: 18,
        available: 14,
        basePrice: 1500,
        classes: [
          {
            name: 'economy',
            label: 'Economy Berth',
            features: ['2-person berth', 'AC', 'Shared bathroom'],
            seats: MOCK_SEATS(2).filter((s) => s.class === 'economy').slice(0, 12),
          },
          {
            name: 'business',
            label: 'Business Cabin',
            features: ['2-person luxury', 'En-suite', 'TV'],
            seats: MOCK_SEATS(2).filter((s) => s.class === 'business').slice(0, 6),
          },
        ],
      },
      {
        type: 'cabins',
        label: 'Cabins',
        total: 8,
        available: 6,
        basePrice: 3290,
        classes: [
          {
            name: 'economy',
            label: 'Standard Cabin',
            features: ['Cabin', 'Bathroom', 'AC'],
            seats: MOCK_SEATS(2).slice(0, 5),
          },
          {
            name: 'business',
            label: 'Premium Suite',
            features: ['Luxury suite', 'Mini bar', 'Concierge'],
            seats: MOCK_SEATS(2).slice(0, 3),
          },
        ],
      },
    ],
  },
  {
    id: 'trip-003',
    vessel: {
      name: 'MV Sunset Cruise',
      type: 'Ferry',
      capacity: 600,
      decks: 5,
      amenities: ['Restaurant', 'Lounge', 'WiFi', 'Medical'],
    },
    route: {
      from: 'Manila (MNL)',
      to: 'Mindoro (MDR)',
      departure: '18:00',
      arrival: '21:30',
      duration: '3h 30m',
    },
    price: 1250,
    accommodations: [
      {
        type: 'seats',
        label: 'Seats',
        total: 36,
        available: 28,
        basePrice: 1250,
        classes: [
          {
            name: 'economy',
            label: 'Economy',
            features: ['Sunset views', 'Open platform', 'Extended legroom'],
            seats: MOCK_SEATS(5).filter((s) => s.class === 'economy').slice(0, 22),
          },
          {
            name: 'business',
            label: 'Business',
            features: ['Premium sunset', 'VIP lounge access', 'Dinner included'],
            seats: MOCK_SEATS(5).filter((s) => s.class === 'business').slice(0, 14),
          },
        ],
      },
      {
        type: 'beds',
        label: 'Beds',
        total: 32,
        available: 20,
        basePrice: 1800,
        classes: [
          {
            name: 'economy',
            label: 'Economy Berth',
            features: ['Double berth', 'Private balcony', 'Shower'],
            seats: MOCK_SEATS(5).filter((s) => s.class === 'economy').slice(0, 15),
          },
          {
            name: 'business',
            label: 'Business Cabin',
            features: ['Luxury berth', 'Jacuzzi', 'Concierge'],
            seats: MOCK_SEATS(5).filter((s) => s.class === 'business').slice(0, 5),
          },
        ],
      },
      {
        type: 'cabins',
        label: 'Cabins',
        total: 20,
        available: 16,
        basePrice: 3990,
        classes: [
          {
            name: 'economy',
            label: 'Standard Cabin',
            features: ['Master cabin', 'Bathroom', 'Balcony'],
            seats: MOCK_SEATS(5).slice(0, 12),
          },
          {
            name: 'business',
            label: 'Executive Suite',
            features: ['Master suite', 'Jacuzzi', 'Butler service'],
            seats: MOCK_SEATS(5).slice(0, 8),
          },
        ],
      },
    ],
  },
];

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🚢 FerryEasy Trip Selection
          </h1>
          <p className="text-lg text-slate-600">
            Select a trip and click "View Details" to explore seats, beds, or cabins
          </p>
        </div>

        {/* Trip Info */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-slate-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600 font-semibold">From</p>
              <p className="text-slate-900">Manila (MNL)</p>
            </div>
            <div>
              <p className="text-slate-600 font-semibold">To</p>
              <p className="text-slate-900">Mindoro (MDR)</p>
            </div>
            <div>
              <p className="text-slate-600 font-semibold">Date</p>
              <p className="text-slate-900">April 5, 2026</p>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-3">
          <TripsList trips={mockTrips} />
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-700">
          <h3 className="font-semibold text-slate-900 mb-2">✨ How to Use</h3>
          <ul className="space-y-1 text-sm">
            <li>• Click any trip card to expand it</li>
            <li>• Stage 1: Review the ship's deck overview</li>
            <li>• Stage 2: Choose accommodation type (Seats, Beds, or Cabins)</li>
            <li>• Stage 3: Select a class (Economy or Business)</li>
            <li>• Stage 4: Click seats to select them (green = available, grey = occupied, blue = selected)</li>
            <li>• Use the sticky footer to navigate between stages</li>
            <li>• Only one trip can be expanded at a time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
