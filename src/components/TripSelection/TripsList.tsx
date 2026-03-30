import React, { useState } from 'react';
import { ChevronDown, MapPin, Clock, Users } from 'lucide-react';
import { ExpandedTripCard } from './ExpandedTripCard';

interface Trip {
  id: string;
  vessel: {
    name: string;
    type: string;
    capacity: number;
    decks: number;
    amenities: string[];
  };
  route: {
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
  };
  price: number;
  accommodations: any[];
}

interface TripCardProps {
  trip: Trip;
  isExpanded: boolean;
  onExpand: () => void;
  onClose: () => void;
}

const CollapsedTripCard: React.FC<TripCardProps> = ({
  trip,
  isExpanded,
  onExpand,
  onClose,
}) => {
  if (isExpanded) return null;

  const totalAccommodation = trip.accommodations.reduce(
    (sum, acc) => sum + acc.available,
    0
  );

  return (
    <button
      onClick={onExpand}
      className="w-full bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{trip.vessel.name}</h3>
          <p className="text-sm text-slate-600">{trip.vessel.type}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">₱{trip.price.toLocaleString()}</p>
          <p className="text-xs text-slate-600">per seat</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin size={16} className="text-slate-500" />
          <span>
            {trip.route.from} → {trip.route.to}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Clock size={16} className="text-slate-500" />
          <span>
            {trip.route.departure} - {trip.route.arrival}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Users size={16} className="text-slate-500" />
          <span>{totalAccommodation} available</span>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {trip.accommodations.map((acc) => (
          <span
            key={acc.type}
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              acc.type === 'seats'
                ? 'bg-green-100 text-green-700'
                : acc.type === 'beds'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {acc.available} {acc.label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          {trip.route.duration} | {trip.vessel.capacity} capacity
        </p>
        <div className="flex items-center gap-2 text-blue-600 font-semibold">
          View Details <ChevronDown size={18} />
        </div>
      </div>
    </button>
  );
};

interface TripsListProps {
  trips: Trip[];
}

export const TripsList: React.FC<TripsListProps> = ({ trips }) => {
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  const expandedTrip = trips.find((t) => t.id === expandedTripId);

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div key={trip.id}>
          {expandedTripId === trip.id ? (
            // Show expanded card
            <ExpandedTripCard
              trip={trip}
              isExpanded={true}
              onClose={() => setExpandedTripId(null)}
            />
          ) : (
            // Show collapsed card
            <CollapsedTripCard
              trip={trip}
              isExpanded={false}
              onExpand={() => setExpandedTripId(trip.id)}
              onClose={() => setExpandedTripId(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TripsList;
