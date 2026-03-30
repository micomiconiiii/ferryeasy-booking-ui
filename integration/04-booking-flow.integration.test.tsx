/**
 * STEP 4: Integration & E2E Tests
 * Location: src/__tests__/booking-flow.integration.test.tsx
 */

import { mapApiResponseToTrip, fetchTrips } from '@/services/tripService';
import { validateTrips, getAccessibilityReport, generateMockTrip } from '@/utils/tripValidation';
import { TripApiResponse, Trip, SearchParams } from '@/components/TripSelection/types';

// Mock API responses
const mockApiResponse: TripApiResponse = {
  trip_id: 'trip-001',
  vessel_name: 'MV Test',
  vessel_type: 'ferry',
  total_capacity: 500,
  deck_count: 4,
  vessel_year: 2020,
  last_survey_date: '2026-01-15',
  amenity_flags: ['wifi', 'restaurant'],
  departure_port: 'Port A',
  departure_code: 'PTA',
  departure_time: '08:00',
  arrival_port: 'Port B',
  arrival_code: 'PTB',
  arrival_time: '10:30',
  voyage_duration_minutes: 150,
  seats_total: 42,
  seats_available: 38,
  seats_reserved: 4,
  seats_deck: 'Deck 1-2',
  seats_features: ['Open deck', 'Ocean views'],
  seats_base_price: 690,
  seats_upgrades: { 'Extra Legroom': 150 },
  beds_total: 28,
  beds_available: 22,
  beds_reserved: 6,
  beds_deck: 'Deck 2-3',
  beds_features: ['Climate-controlled', 'Private'],
  beds_base_price: 1200,
  beds_upgrades: { Breakfast: 180 },
  cabins_total: 12,
  cabins_available: 10,
  cabins_reserved: 2,
  cabins_deck: 'Deck 4',
  cabins_features: ['Luxury', 'Private bathroom'],
  cabins_base_price: 2890,
  cabins_upgrades: { 'Lounge Access': 200 },
};

describe('Trip Selection - Integration Tests', () => {
  describe('API Response Mapping', () => {
    it('maps API response to Trip type correctly', () => {
      const trip = mapApiResponseToTrip(mockApiResponse);

      expect(trip.id).toBe('trip-001');
      expect(trip.vessel.name).toBe('MV Test');
      expect(trip.vessel.type).toBe('ferry');
      expect(trip.route.departure.code).toBe('PTA');
      expect(trip.accommodations.seats.total).toBe(42);
      expect(trip.accommodations.beds.pricing.base).toBe(1200);
    });

    it('handles missing API fields gracefully', () => {
      const incomplete = { ...mockApiResponse, vessel_name: undefined };
      const trip = mapApiResponseToTrip(incomplete as any);

      expect(trip.vessel.name).toBe('Unknown Vessel');
    });

    it('maps amenities correctly', () => {
      const trip = mapApiResponseToTrip(mockApiResponse);

      expect(trip.vessel.amenities).toContain('wifi');
      expect(trip.vessel.amenities).toContain('restaurant');
    });
  });

  describe('Trip Validation', () => {
    it('validates correct trip data', () => {
      const trip = mapApiResponseToTrip(mockApiResponse);
      const validation = validateTrips([trip]);

      expect(validation.isValid).toBe(true);
      expect(validation.valid.length).toBe(1);
      expect(validation.invalid.length).toBe(0);
    });

    it('detects invalid accommodations', () => {
      const trip = generateMockTrip({
        accommodations: {
          seats: { ...generateMockTrip().accommodations.seats, available: 100, total: 50 },
          beds: generateMockTrip().accommodations.beds,
          cabins: generateMockTrip().accommodations.cabins,
        },
      });

      const validation = validateTrips([trip]);

      expect(validation.isValid).toBe(false);
      expect(validation.invalid[0].errors.some((e) => e.includes('available + reserved > total')))
        .toBe(true);
    });

    it('detects negative prices', () => {
      const trip = generateMockTrip({
        accommodations: {
          ...generateMockTrip().accommodations,
          seats: {
            ...generateMockTrip().accommodations.seats,
            pricing: { base: -100, upgrades: {} },
          },
        },
      });

      const validation = validateTrips([trip]);

      expect(validation.isValid).toBe(false);
      expect(
        validation.invalid[0].errors.some((e) => e.includes('non-negative'))
      ).toBe(true);
    });
  });

  describe('Accessibility Compliance', () => {
    it('checks accessibility compliance', () => {
      const trip = mapApiResponseToTrip(mockApiResponse);
      const report = getAccessibilityReport(trip);

      expect(report).toContain('Trip Accessibility Report');
      expect(report).toContain('✓ PASS');
    });

    it('generates full compliance report', () => {
      const trip = generateMockTrip();
      const report = getAccessibilityReport(trip);

      expect(report).toContain('Data Validation:');
      expect(report).toContain('Accessibility Compliance:');
      expect(report).toContain('Recommendation:');
    });
  });

  describe('End-to-End Flow', () => {
    it('simulates complete trip selection flow', async () => {
      // 1. Mock API response
      const apiResponse: TripApiResponse = mockApiResponse;

      // 2. Map to Trip type
      const trip = mapApiResponseToTrip(apiResponse);

      // 3. Validate
      const validation = validateTrips([trip]);
      expect(validation.isValid).toBe(true);

      // 4. Check accessibility
      const report = getAccessibilityReport(trip);
      expect(report).toContain('Ready for production');

      // 5. Verify data structure for rendering
      expect(trip.vessel.name).toBeDefined();
      expect(trip.route.departure.time).toBeDefined();
      expect(trip.accommodations.seats.available).toBeDefined();
    });

    it('handles multiple trips in search results', () => {
      const trips = [
        mapApiResponseToTrip(mockApiResponse),
        mapApiResponseToTrip({ ...mockApiResponse, trip_id: 'trip-002' }),
        mapApiResponseToTrip({ ...mockApiResponse, trip_id: 'trip-003' }),
      ];

      const validation = validateTrips(trips);

      expect(validation.isValid).toBe(true);
      expect(validation.valid.length).toBe(3);
    });

    it('filters invalid trips from results', () => {
      const validTrip = mapApiResponseToTrip(mockApiResponse);
      const invalidTrip = generateMockTrip({
        accommodations: {
          ...generateMockTrip().accommodations,
          seats: {
            ...generateMockTrip().accommodations.seats,
            total: -1, // Invalid
          },
        },
      });

      const validation = validateTrips([validTrip, invalidTrip]);

      expect(validation.valid.length).toBe(1);
      expect(validation.invalid.length).toBe(1);
    });
  });

  describe('Performance Checks', () => {
    it('maps API response quickly (<50ms)', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        mapApiResponseToTrip(mockApiResponse);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 100;

      expect(avgTime).toBeLessThan(1); // Should be much less than 50ms per mapping
    });

    it('validates many trips quickly (<500ms)', () => {
      const trips = Array(50)
        .fill(null)
        .map((_, i) => generateMockTrip({ id: `trip-${i}` }));

      const startTime = performance.now();
      validateTrips(trips);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
