/**
 * STEP 2: useTrip Selection Hook
 * Location: src/hooks/useTripSelection.ts
 */

import { useState, useEffect, useCallback } from 'react';
import { Trip, SearchParams } from '@/components/TripSelection/types';
import {
  fetchTrips,
  getCachedTrips,
  setCachedTrips,
} from '@/services/tripService';

interface UseTripSelectionState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  selectedTripId: string | null;
  refetch: () => Promise<void>;
  selectTrip: (tripId: string) => void;
  clearSelection: () => void;
}

export function useTripSelection(params: SearchParams): UseTripSelectionState {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Generate cache key
  const cacheKey = `${params.from}-${params.to}-${params.date}-${params.passengers}`;

  // Fetch trips
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedTrips(cacheKey);
      if (cached) {
        setTrips(cached);
        setLoading(false);
        return;
      }

      // Fetch from API
      const data = await fetchTrips(params);
      setTrips(data);
      setCachedTrips(cacheKey, data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load trips';
      setError(message);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [params, cacheKey]);

  // Fetch on params change
  useEffect(() => {
    if (params.from && params.to && params.date) {
      fetchData();
    }
  }, [params, fetchData]);

  const selectTrip = useCallback((tripId: string) => {
    setSelectedTripId(tripId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTripId(null);
  }, []);

  return {
    trips,
    loading,
    error,
    selectedTripId,
    refetch: fetchData,
    selectTrip,
    clearSelection,
  };
}
