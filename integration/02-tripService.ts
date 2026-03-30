/**
 * STEP 2: API Service & Data Mapping
 * Location: src/services/tripService.ts
 */

import { Trip, TripApiResponse, SearchParams } from '@/components/TripSelection/types';

/**
 * Map API response to Trip type
 * Handles null/undefined values gracefully
 */
export function mapApiResponseToTrip(apiTrip: TripApiResponse): Trip {
  return {
    id: apiTrip.trip_id,
    vessel: {
      name: apiTrip.vessel_name || 'Unknown Vessel',
      type: apiTrip.vessel_type || 'ferry',
      capacity: apiTrip.total_capacity || 0,
      decks: apiTrip.deck_count || 1,
      yearBuilt: apiTrip.vessel_year || new Date().getFullYear(),
      lastInspection: apiTrip.last_survey_date || 'N/A',
      amenities: (apiTrip.amenity_flags || []) as any[],
    },
    route: {
      departure: {
        location: apiTrip.departure_port || '',
        code: apiTrip.departure_code || '',
        time: apiTrip.departure_time || '',
      },
      arrival: {
        location: apiTrip.arrival_port || '',
        code: apiTrip.arrival_code || '',
        time: apiTrip.arrival_time || '',
      },
      durationMinutes: apiTrip.voyage_duration_minutes || 0,
    },
    accommodations: {
      seats: {
        type: 'seats',
        label: 'Seats',
        total: apiTrip.seats_total || 0,
        available: apiTrip.seats_available || 0,
        reserved: apiTrip.seats_reserved || 0,
        location: apiTrip.seats_deck || 'Deck 1',
        features: apiTrip.seats_features || [],
        pricing: {
          base: apiTrip.seats_base_price || 0,
          upgrades: apiTrip.seats_upgrades || {},
        },
      },
      beds: {
        type: 'beds',
        label: 'Beds',
        total: apiTrip.beds_total || 0,
        available: apiTrip.beds_available || 0,
        reserved: apiTrip.beds_reserved || 0,
        location: apiTrip.beds_deck || 'Deck 2',
        features: apiTrip.beds_features || [],
        pricing: {
          base: apiTrip.beds_base_price || 0,
          upgrades: apiTrip.beds_upgrades || {},
        },
      },
      cabins: {
        type: 'cabins',
        label: 'Cabins',
        total: apiTrip.cabins_total || 0,
        available: apiTrip.cabins_available || 0,
        reserved: apiTrip.cabins_reserved || 0,
        location: apiTrip.cabins_deck || 'Deck 4',
        features: apiTrip.cabins_features || [],
        pricing: {
          base: apiTrip.cabins_base_price || 0,
          upgrades: apiTrip.cabins_upgrades || {},
        },
      },
    },
  };
}

/**
 * Fetch trips from API
 * Production: Replace with actual API endpoint
 */
export async function fetchTrips(params: SearchParams): Promise<Trip[]> {
  try {
    const queryString = new URLSearchParams({
      from: params.from,
      to: params.to,
      date: params.date,
      passengers: String(params.passengers),
    }).toString();

    // Production endpoint
    const response = await fetch(`/api/trips?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const apiTrips: TripApiResponse[] = Array.isArray(data) ? data : data.trips || [];

    // Map all responses to Trip type
    return apiTrips.map(mapApiResponseToTrip);
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    throw error;
  }
}

/**
 * Cache trips in memory (optional optimization)
 */
const tripCache = new Map<string, { trips: Trip[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCachedTrips(key: string): Trip[] | null {
  const cached = tripCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.trips;
  }
  tripCache.delete(key);
  return null;
}

export function setCachedTrips(key: string, trips: Trip[]): void {
  tripCache.set(key, { trips, timestamp: Date.now() });
}

export function clearTripCache(): void {
  tripCache.clear();
}
