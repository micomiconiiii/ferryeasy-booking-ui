/**
 * STEP 4: Validation & Testing Utilities
 * Location: src/utils/tripValidation.ts
 */

import { Trip, VesselInfo, RouteInfo, AccommodationType } from '@/components/TripSelection/types';

/**
 * Validate Trip object structure
 * Returns: { isValid: boolean, errors: string[] }
 */
export function validateTrip(trip: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!trip.id) errors.push('Missing trip.id');
  if (!trip.vessel) errors.push('Missing trip.vessel');
  if (!trip.route) errors.push('Missing trip.route');
  if (!trip.accommodations) errors.push('Missing trip.accommodations');

  if (trip.vessel) {
    validateVessel(trip.vessel, errors);
  }

  if (trip.route) {
    validateRoute(trip.route, errors);
  }

  if (trip.accommodations) {
    validateAccommodations(trip.accommodations, errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateVessel(vessel: any, errors: string[]): void {
  if (!vessel.name) errors.push('Missing vessel.name');
  if (!vessel.type) errors.push('Missing vessel.type');
  if (vessel.type && !['ferry', 'catamaran', 'hydrofoil'].includes(vessel.type)) {
    errors.push(`Invalid vessel.type: ${vessel.type}`);
  }
  if (!vessel.capacity || vessel.capacity <= 0) {
    errors.push('Invalid vessel.capacity (must be > 0)');
  }
  if (!vessel.decks || vessel.decks <= 0) {
    errors.push('Invalid vessel.decks (must be > 0)');
  }
  if (!vessel.yearBuilt) errors.push('Missing vessel.yearBuilt');
  if (!vessel.lastInspection) errors.push('Missing vessel.lastInspection');
  if (!Array.isArray(vessel.amenities)) errors.push('vessel.amenities must be an array');
}

function validateRoute(route: any, errors: string[]): void {
  if (!route.departure) errors.push('Missing route.departure');
  if (!route.arrival) errors.push('Missing route.arrival');

  if (route.departure) {
    if (!route.departure.location) errors.push('Missing route.departure.location');
    if (!route.departure.code) errors.push('Missing route.departure.code');
    if (!route.departure.time) errors.push('Missing route.departure.time');
  }

  if (route.arrival) {
    if (!route.arrival.location) errors.push('Missing route.arrival.location');
    if (!route.arrival.code) errors.push('Missing route.arrival.code');
    if (!route.arrival.time) errors.push('Missing route.arrival.time');
  }

  if (!route.durationMinutes || route.durationMinutes <= 0) {
    errors.push('Invalid route.durationMinutes (must be > 0)');
  }
}

function validateAccommodations(accommodations: any, errors: string[]): void {
  const types = ['seats', 'beds', 'cabins'];

  for (const type of types) {
    if (!accommodations[type]) {
      errors.push(`Missing accommodations.${type}`);
      continue;
    }

    const acc = accommodations[type];
    validateAccommodation(acc, type, errors);
  }
}

function validateAccommodation(
  acc: any,
  type: string,
  errors: string[]
): void {
  if (acc.type !== type) errors.push(`Invalid accommodations.${type}.type`);
  if (!acc.label) errors.push(`Missing accommodations.${type}.label`);
  if (!Number.isInteger(acc.total) || acc.total < 0) {
    errors.push(`Invalid accommodations.${type}.total (must be >= 0)`);
  }
  if (!Number.isInteger(acc.available) || acc.available < 0) {
    errors.push(`Invalid accommodations.${type}.available (must be >= 0)`);
  }
  if (!Number.isInteger(acc.reserved) || acc.reserved < 0) {
    errors.push(`Invalid accommodations.${type}.reserved (must be >= 0)`);
  }
  if (acc.available + acc.reserved > acc.total) {
    errors.push(
      `accommodations.${type}: available + reserved > total`
    );
  }
  if (!acc.location) errors.push(`Missing accommodations.${type}.location`);
  if (!Array.isArray(acc.features)) {
    errors.push(`accommodations.${type}.features must be an array`);
  }
  if (!acc.pricing || !Number.isFinite(acc.pricing.base)) {
    errors.push(`Invalid accommodations.${type}.pricing.base`);
  }
  if (!Number.isInteger(acc.pricing.base) || acc.pricing.base < 0) {
    errors.push(`accommodations.${type}.pricing.base must be non-negative integer`);
  }
}

/**
 * Validate multiple trips
 */
export function validateTrips(trips: any[]): {
  isValid: boolean;
  valid: Trip[];
  invalid: { trip: any; errors: string[] }[];
} {
  const valid: Trip[] = [];
  const invalid: { trip: any; errors: string[] }[] = [];

  for (const trip of trips) {
    const validation = validateTrip(trip);
    if (validation.isValid) {
      valid.push(trip);
    } else {
      invalid.push({ trip, errors: validation.errors });
    }
  }

  return {
    isValid: invalid.length === 0,
    valid,
    invalid,
  };
}

/**
 * Check accessibility compliance for Trip
 */
export function checkAccessibilityCompliance(
  trip: Trip
): { compliant: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check touch target minimum (48px)
  // This is component-level, but we can check data completeness
  if (!trip.accommodations.seats.features?.length) {
    warnings.push('Seats missing features for accessibility info');
  }
  if (!trip.accommodations.beds.features?.length) {
    warnings.push('Beds missing features for accessibility info');
  }
  if (!trip.accommodations.cabins.features?.length) {
    warnings.push('Cabins missing features for accessibility info');
  }

  // Check that all accommodations have location info (for BOW/STERN context)
  if (!trip.route.departure.location) {
    warnings.push('Missing departure location for navigation context');
  }
  if (!trip.route.arrival.location) {
    warnings.push('Missing arrival location for navigation context');
  }

  return {
    compliant: warnings.length === 0,
    warnings,
  };
}

/**
 * Get accessibility report for Trip
 */
export function getAccessibilityReport(trip: Trip): string {
  const compliance = checkAccessibilityCompliance(trip);
  const validation = validateTrip(trip);

  const report = `
=== Trip Accessibility Report ===
Trip ID: ${trip.id}
Vessel: ${trip.vessel.name}

Data Validation:
  Status: ${validation.isValid ? '✓ PASS' : '✗ FAIL'}
  ${validation.isValid ? '' : `Errors: ${validation.errors.join(', ')}`}

Accessibility Compliance:
  Status: ${compliance.compliant ? '✓ PASS' : '⚠ WARNINGS'}
  ${compliance.compliant ? '' : `Warnings: ${compliance.warnings.join(', ')}`}

Recommendation:
  ${validation.isValid && compliance.compliant ? '✓ Ready for production' : '⚠ Review before production'}
`;

  return report;
}

/**
 * Generate test data for development
 */
export function generateMockTrip(overrides?: Partial<Trip>): Trip {
  const baseTrip: Trip = {
    id: `trip-${Date.now()}`,
    vessel: {
      name: 'MV Development Vessel',
      type: 'ferry',
      capacity: 500,
      decks: 4,
      yearBuilt: 2020,
      lastInspection: '2026-01-15',
      amenities: ['wifi', 'restaurant', 'lounge'],
    },
    route: {
      departure: {
        location: 'Test Port A',
        code: 'TPA',
        time: '08:00',
      },
      arrival: {
        location: 'Test Port B',
        code: 'TPB',
        time: '10:30',
      },
      durationMinutes: 150,
    },
    accommodations: {
      seats: {
        type: 'seats',
        label: 'Seats',
        total: 50,
        available: 40,
        reserved: 10,
        location: 'Deck 1-2',
        features: ['Open deck', 'Ocean views', 'Ventilated'],
        pricing: { base: 690, upgrades: { 'Extra Legroom': 150 } },
      },
      beds: {
        type: 'beds',
        label: 'Beds',
        total: 30,
        available: 25,
        reserved: 5,
        location: 'Deck 2-3',
        features: ['Climate-controlled', 'Private', 'Ensuite bathroom'],
        pricing: { base: 1200, upgrades: { Breakfast: 180 } },
      },
      cabins: {
        type: 'cabins',
        label: 'Cabins',
        total: 15,
        available: 12,
        reserved: 3,
        location: 'Deck 4',
        features: ['Luxury suite', 'Private bathroom', 'Entertainment system'],
        pricing: { base: 2890, upgrades: { 'Lounge Access': 200 } },
      },
    },
  };

  return { ...baseTrip, ...overrides };
}
