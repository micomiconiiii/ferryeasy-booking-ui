/**
 * STEP 1: Type Definitions
 * Location: src/components/TripSelection/types.ts
 */

export interface VesselInfo {
  name: string;
  type: 'ferry' | 'catamaran' | 'hydrofoil';
  capacity: number;
  decks: number;
  yearBuilt: number;
  lastInspection: string;
  amenities: ('restaurant' | 'lounge' | 'wifi' | 'medical' | 'childcare')[];
}

export interface RouteInfo {
  departure: { location: string; code: string; time: string };
  arrival: { location: string; code: string; time: string };
  durationMinutes: number;
}

export interface AccommodationType {
  type: 'seats' | 'beds' | 'cabins';
  label: string;
  total: number;
  available: number;
  reserved: number;
  location: string;
  features: string[];
  pricing: {
    base: number;
    upgrades: Record<string, number>;
  };
}

export interface Trip {
  id: string;
  vessel: VesselInfo;
  route: RouteInfo;
  accommodations: {
    seats: AccommodationType;
    beds: AccommodationType;
    cabins: AccommodationType;
  };
}

/**
 * API Response types (from backend)
 */
export interface TripApiResponse {
  trip_id: string;
  vessel_name: string;
  vessel_type: 'ferry' | 'catamaran' | 'hydrofoil';
  total_capacity: number;
  deck_count: number;
  vessel_year: number;
  last_survey_date: string;
  amenity_flags: string[];
  departure_port: string;
  departure_code: string;
  departure_time: string;
  arrival_port: string;
  arrival_code: string;
  arrival_time: string;
  voyage_duration_minutes: number;
  seats_total: number;
  seats_available: number;
  seats_reserved: number;
  seats_deck: string;
  seats_features: string[];
  seats_base_price: number;
  seats_upgrades: Record<string, number>;
  beds_total: number;
  beds_available: number;
  beds_reserved: number;
  beds_deck: string;
  beds_features: string[];
  beds_base_price: number;
  beds_upgrades: Record<string, number>;
  cabins_total: number;
  cabins_available: number;
  cabins_reserved: number;
  cabins_deck: string;
  cabins_features: string[];
  cabins_base_price: number;
  cabins_upgrades: Record<string, number>;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}
