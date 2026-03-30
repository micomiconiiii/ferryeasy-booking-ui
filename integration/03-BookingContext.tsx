/**
 * STEP 3: Booking Context (State Management)
 * Location: src/context/BookingContext.tsx
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Trip, SearchParams } from '@/components/TripSelection/types';

interface BookingContextType {
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  selectedTrip: Trip | null;
  setSelectedTrip: (trip: Trip) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const clearBooking = useCallback(() => {
    setSearchParams(null);
    setSelectedTrip(null);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedTrip,
        setSelectedTrip,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error(
      'useBookingContext must be used within BookingProvider'
    );
  }
  return context;
}
