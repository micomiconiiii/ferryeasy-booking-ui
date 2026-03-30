/**
 * STEP 4: Unit Tests
 * Location: src/components/TripSelection/__tests__/TripSelectionComponents.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TripCard, TripSelectionResults } from '../TripSelectionComponents';
import { Trip } from '../types';

// Mock trip data
const mockTrip: Trip = {
  id: 'trip-001',
  vessel: {
    name: 'MV Test Vessel',
    type: 'ferry',
    capacity: 500,
    decks: 4,
    yearBuilt: 2020,
    lastInspection: '2026-01-15',
    amenities: ['wifi', 'restaurant'],
  },
  route: {
    departure: {
      location: 'Port A',
      code: 'PTA',
      time: '08:00',
    },
    arrival: {
      location: 'Port B',
      code: 'PTB',
      time: '10:30',
    },
    durationMinutes: 150,
  },
  accommodations: {
    seats: {
      type: 'seats',
      label: 'Seats',
      total: 42,
      available: 38,
      reserved: 4,
      location: 'Deck 1-2',
      features: ['Open deck', 'Ocean views'],
      pricing: { base: 690, upgrades: { 'Extra Legroom': 150 } },
    },
    beds: {
      type: 'beds',
      label: 'Beds',
      total: 28,
      available: 22,
      reserved: 6,
      location: 'Deck 2-3',
      features: ['Climate-controlled', 'Private'],
      pricing: { base: 1200, upgrades: { Breakfast: 180 } },
    },
    cabins: {
      type: 'cabins',
      label: 'Cabins',
      total: 12,
      available: 10,
      reserved: 2,
      location: 'Deck 4',
      features: ['Luxury', 'Private bathroom'],
      pricing: { base: 2890, upgrades: { 'Lounge Access': 200 } },
    },
  },
};

describe('TripCard', () => {
  it('renders collapsed by default', () => {
    const mockSelect = jest.fn();
    render(
      <TripCard trip={mockTrip} onSelectTrip={mockSelect} defaultExpanded={false} />
    );

    expect(screen.getByText('EXPAND')).toBeInTheDocument();
    expect(screen.queryByText('Vessel Information')).not.toBeInTheDocument();
  });

  it('expands on button click', async () => {
    const mockSelect = jest.fn();
    render(
      <TripCard trip={mockTrip} onSelectTrip={mockSelect} defaultExpanded={false} />
    );

    const expandButton = screen.getByText('EXPAND');
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText('Vessel Information')).toBeInTheDocument();
    });
  });

  it('collapses when expanded then collapse clicked', async () => {
    const mockSelect = jest.fn();
    render(
      <TripCard trip={mockTrip} onSelectTrip={mockSelect} defaultExpanded={true} />
    );

    expect(screen.getByText('Vessel Information')).toBeInTheDocument();

    const collapseButton = screen.getByText('COLLAPSE');
    fireEvent.click(collapseButton);

    await waitFor(() => {
      expect(screen.queryByText('Vessel Information')).not.toBeInTheDocument();
    });
  });

  it('calls onSelectTrip when select button clicked', async () => {
    const mockSelect = jest.fn();
    render(
      <TripCard trip={mockTrip} onSelectTrip={mockSelect} defaultExpanded={true} />
    );

    const selectButton = screen.getByText('SELECT TRIP');
    fireEvent.click(selectButton);

    expect(mockSelect).toHaveBeenCalledWith('trip-001');
  });

  it('displays vessel name', () => {
    const mockSelect = jest.fn();
    render(
      <TripCard trip={mockTrip} onSelectTrip={mockSelect} />
    );

    expect(screen.getByText(/MV Test Vessel/)).toBeInTheDocument();
  });

  it('displays accommodation availability', () => {
    const mockSelect = jest.fn();
    render(
      <TripCard trip={mockTrip} onSelectTrip={mockSelect} />
    );

    expect(screen.getByText(/Seats.*38\/42/)).toBeInTheDocument();
    expect(screen.getByText(/Beds.*22\/28/)).toBeInTheDocument();
    expect(screen.getByText(/Cabins.*10\/12/)).toBeInTheDocument();
  });
});

describe('TripSelectionResults', () => {
  it('renders multiple trip cards', () => {
    const trips = [
      mockTrip,
      { ...mockTrip, id: 'trip-002', vessel: { ...mockTrip.vessel, name: 'MV Second' } },
    ];
    const mockSelect = jest.fn();

    render(
      <TripSelectionResults trips={trips} onSelectTrip={mockSelect} />
    );

    expect(screen.getByText('MV Test Vessel')).toBeInTheDocument();
    expect(screen.getByText('MV Second')).toBeInTheDocument();
  });

  it('expands first trip by default when initialExpandedTripId provided', () => {
    const trips = [mockTrip];
    const mockSelect = jest.fn();

    render(
      <TripSelectionResults
        trips={trips}
        onSelectTrip={mockSelect}
        initialExpandedTripId="trip-001"
      />
    );

    expect(screen.getByText('Vessel Information')).toBeInTheDocument();
  });

  it('calls onSelectTrip with correct id for any card', async () => {
    const trips = [
      mockTrip,
      { ...mockTrip, id: 'trip-002' },
    ];
    const mockSelect = jest.fn();

    render(
      <TripSelectionResults
        trips={trips}
        onSelectTrip={mockSelect}
        initialExpandedTripId="trip-001"
      />
    );

    const selectButtons = screen.getAllByText('SELECT TRIP');
    fireEvent.click(selectButtons[0]);

    expect(mockSelect).toHaveBeenCalledWith('trip-001');
  });
});
