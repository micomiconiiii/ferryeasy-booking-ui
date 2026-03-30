# 🎯 Ferry Booking: Trip Selection + Seat Selection Flow (Single Page)

**Status**: In Development
**Version**: 3.0 - Two-Stage Interactive Layout
**Last Updated**: March 30, 2026

---

## Executive Summary

**Goal**: Create a frictionless, single-page booking flow where:
1. **Stage 1**: User browses trip cards (time, price, vessel)
2. **Click**: Card expands with ship overview
3. **Stage 2**: User selects deck/class, then seats
4. **Summary**: Dynamic selection bar grows/updates
5. **Close**: Collapse to browse other trips without refresh

**Key Principle**: Progressive complexity - reveal only what's needed at each stage

---

## Part 1: Stage 1 - Trip List (Discovery)

### 1.1 Accordion Trip Cards

#### Card Structure (Collapsed)
```
┌─────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────┐ │
│ │ Manila (MNL) → Mindoro (MDR)             │ │
│ ├──────────────────────────────────────────┤ │
│ │ 08:00 – 10:30 (2h 30m)      ₱690/seat  │ │
│ │ 🚢 MV Pacific Voyager                    │ │
│ │ 🔋 42 Economy | 28 Tourist |12 Business │ │
│ │                                [▼ Select] │ │
│ └──────────────────────────────────────────┘ │
│                                               │
│ ┌──────────────────────────────────────────┐ │
│ │ Manila (MNL) → Coron (CXJ)               │ │
│ ├──────────────────────────────────────────┤ │
│ │ 14:00 – 17:15 (3h 15m)      ₱890/seat  │ │
│ │ 🚢 MV Island Express                     │ │
│ │ 🔋 50 Economy | 18 Tourist | 8 Business │ │
│ │                                [▼ Select] │ │
│ └──────────────────────────────────────────┘ │
│                                               │
│ ┌──────────────────────────────────────────┐ │
│ │ Manila (MNL) → Puerto Princesa (PPS)     │ │
│ ├──────────────────────────────────────────┤ │
│ │ 18:00 – 21:45 (3h 45m)      ₱1,250/seat│ │
│ │ 🚢 MV Sunset Cruise                      │ │
│ │ 🔋 36 Economy | 32 Tourist | 20 Business│ │
│ │                                [▼ Select] │ │
│ └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

Heights: ~140px each
Gap: 12px between cards
Spacing: 16px padding sides
```

#### Card Design Elements
```typescript
const tripCard = {
  height: '140px',        // Collapsed
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',

  onHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    backgroundColor: '#fafbfc',
  },

  transition: 'all 300ms ease-out',
};
```

### 1.2 Trip Card Content (Collapsed)

```
Row 1: Route (Bold, Large Text)
       "Manila (MNL) → Mindoro (MDR)"

Row 2: Time + Price
       "08:00 – 10:30 (2h 30m)  |  ₱690/seat"

Row 3: Vessel Info
       "🚢 MV Pacific Voyager"

Row 4: Capacity Indicators
       "🔋 42 Economy | 28 Tourist | 12 Business"

Row 5: Expand Button
       "[▼ Select Seats] [chevron-down icon]"
```

#### Data Structure
```typescript
interface Trip {
  id: string;
  from: string;           // "Manila (MNL)"
  to: string;             // "Mindoro (MDR)"
  departureTime: string;  // "08:00"
  arrivalTime: string;    // "10:30"
  duration: string;       // "2h 30m"
  vesselName: string;     // "MV Pacific Voyager"
  basePrice: number;      // 690
  decks: Deck[];           // Accommodations with availability
}

interface Deck {
  id: string;
  name: string;           // "Economy Deck"
  class: AccommodationClass;
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}
```

### 1.3 Accordion Logic (Core State Machine)

```typescript
interface TripListState {
  expandedTripId: string | null;  // Only one open at a time
  selectedTrip: Trip | null;       // Reference to expanded trip
}

// Behavior:
// 1. Click trip A → expandedTripId = 'trip-A'
// 2. Click trip B → expandedTripId = 'trip-B' (trip A auto-closes)
// 3. Click close → expandedTripId = null (all collapsed)
// 4. Click same trip again → toggles close/expands

function handleTripClick(tripId: string) {
  setExpandedTripId(
    expandedTripId === tripId ? null : tripId
  );
}
```

### 1.4 Expansion Animation

```css
/* Collapsed → Expanded */
@keyframes expandTrip {
  from {
    maxHeight: 140px;
    opacity: 0.8;
  }
  to {
    maxHeight: 1200px;  /* Enough for full seat map + summary */
    opacity: 1;
  }
}

.trip-card-expanded {
  animation: expandTrip 400ms ease-out;
  max-height: 1200px;   /* Dynamically adjusted */
  overflow: hidden;
  transition: max-height 400ms ease-out;
}

.trip-card-collapsed {
  max-height: 140px;
  transition: max-height 400ms ease-in;
}
```

---

## Part 2: Stage 2 - Expanded Trip Card Content

### 2.1 Ship Overview (First Reveal)

When a trip card expands, the FIRST thing shown is the ship overview:

```
┌────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────┤
│ │ Manila (MNL) → Mindoro (MDR)                   [×]  │ ← Close button
│ │ 08:00 – 10:30 | MV Pacific Voyager             │
│ ├──────────────────────────────────────────────────────┤
│ │                                                      │
│ │ VESSEL OVERVIEW & DECK SELECTION                   │
│ │ ▼ BOW (FRONT)                                       │
│ │                                                      │
│ │ Select your preferred deck:                         │
│ │                                                      │
│ │ ◻ 🚢 Economy Deck              42 available         │
│ │   └─ Lower deck, general seating                    │
│ │                                                      │
│ │ ◻ 🛏️  Tourist Deck              28 available        │
│ │   └─ Mid deck, comfort beds                         │
│ │                                                      │
│ │ ◻ 👑 Business Cabins            12 available        │
│ │   └─ Upper deck, premium rooms                      │
│ │                                                      │
│ │ ◀ STERN (BACK)                                      │
│ │                                                      │
│ └────────────────────────────────────────────────────────┘
```

#### Ship Overview Component
```typescript
interface ShipOverviewProps {
  trip: Trip;
  onDeckSelect: (deckId: string) => void;
  selectedDeckId?: string;
}

// Displays:
// - Trip header (route, time, vessel)
// - Deck options with availability count
// - BOW/STERN labels for orientation
// - Clickable deck cards
```

### 2.2 Deck Selection Interaction

#### Click Deck Card → Reveals Seat Map

```
BEFORE (Ship Overview Visible):
┌────────────────────────────────────────────┐
│ Select your preferred deck:                │
│ ◻ 🚢 Economy Deck    42 available         │ ← Click here
│ ◻ 🛏️  Tourist Deck    28 available        │
│ ◻ 👑 Business Cabins  12 available        │
└────────────────────────────────────────────┘

AFTER (Deck Selected, Seat Map Shows):
┌────────────────────────────────────────────┐
│ ◻ 🚢 Economy Deck ✓  42 available         │ ← Selected (bg color)
│ └─ Seat map below (see Part 3)             │
│    [Grid: A1–G6]                           │
│    [Selection bar updates]                 │
└────────────────────────────────────────────┘
```

#### State Transition
```typescript
interface ExpandedTripState {
  stage: 'overview' | 'seatMap';
  selectedDeckId: string | null;
}

function handleDeckSelect(deckId: string) {
  setState({
    stage: 'seatMap',
    selectedDeckId: deckId,
  });
}

// To go back from seat map to deck selection:
function handleBackToDeckSelection() {
  setState({
    stage: 'overview',
    selectedDeckId: null,
  });
}
```

---

## Part 3: Seat Map (Minimalist, Updated Design)

### 3.1 Seat Grid Layout

After deck selection, show seat map:

```
┌──────────────────────────────────────────────┐
│ 🚢 Economy Deck | ← BACK TO DECKS             │
├──────────────────────────────────────────────┤
│                                               │
│ ▶ BOW (FRONT) ▶                              │
│                                               │
│ A1 A2 A3  │ AISLE │  A4 A5 A6              │
│ B1 B2 B3  │       │  B4 B5 B6              │
│ C1 C2 C3  │       │  C4 C5 C6              │
│ D1 D2 D3  │       │  D4 D5 D6              │
│ E1 E2 E3  │       │  E4 E5 E6              │
│ F1 F2 F3  │       │  F4 F5 F6              │
│ G1 G2 G3  │       │  G4 G5 G6              │
│                                               │
│ ◀ STERN (BACK) ◀                            │
│                                               │
│ ┌───────────────────────────────────────────┤
│ │ ◻ Available  ■ Selected  ◻ Occupied       │ ← Legend
│ └───────────────────────────────────────────┤
│                                               │
│ ┌───────────────────────────────────────────┤
│ │ Selection: A1, B3, C5                     │ ← Dynamic
│ │ Total: ₱2,070.00 | [CONFIRM]              │ ← Summary bar
│ └───────────────────────────────────────────┤
└──────────────────────────────────────────────┘
```

### 3.2 Minimalist Seat Design (Same as v2.0)

```
State      │ Design
────────────┼─────────────────────────────────
Available   │ White square, blue border (2px)
            │ On hover: lift shadow, seat # appears
            │
Selected    │ Navy blue fill
            │ White checkmark (✓) centered
            │ Outer ring (blue glow)
            │
Occupied    │ Light grey fill
            │ No border
            │ Opacity 50% (visually recedes)
            │ Disabled pointer
```

### 3.3 Grid Rendering

```typescript
interface SeatGridProps {
  deck: Deck;
  selectedSeats: Set<string>;
  onSeatSelect: (seatId: string) => void;
  onBack: () => void;
}

// Render logic:
// 1. Group seats by row (A, B, C...)
// 2. Display in blocks: [Col 1-3] [AISLE] [Col 4-6]
// 3. Each seat: 48×48px with 8px gap
// 4. Aisle: 16px gap with dashed border
// 5. Keyboard navigation: Tab + Arrows
```

---

## Part 4: Frictionless Summary & Transition

### 4.1 Selection Bar (Inside Expanded Card)

Located at the bottom of the expanded trip card:

```
┌──────────────────────────────────────────────────┐
│ Seat Map [Grid Above]                            │
├──────────────────────────────────────────────────┤
│                                                   │
│ [Legend: Available | Selected | Occupied]         │
│                                                   │
│ ╔══════════════════════════════════════════════╗ │
│ ║ Your Selection                               ║ │
│ ║                                              ║ │
│ ║ 📍 Seats: A1, B3, C5                         ║ │
│ ║ 🛋️  Class: Economy Deck                      ║ │
│ ║ 💰 Total: ₱2,070.00                          ║ │
│ ║                                              ║ │
│ ║ [← BACK]  [CONFIRM & PROCEED]                ║ │
│ ╚══════════════════════════════════════════════╝ │
│                                                   │
└──────────────────────────────────────────────────┘
```

#### Summary Bar Design
```typescript
const summaryBar = {
  backgroundColor: '#f0f4f8',        // Light blue-grey
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

// Dynamic updates:
// - Seats list updates instantly
// - Total price recalculates in real-time
// - No layout shift
// - Smooth color transitions
```

### 4.2 Selection Summary (Dynamic Content)

```typescript
interface SelectionSummary {
  seatIds: string[];         // ["A1", "B3", "C5"]
  deckName: string;          // "Economy Deck"
  basePrice: number;         // 690
  totalPrice: number;        // 2070 (690 × 3)
  passengersCount: number;   // 3
}

// Real-time updates:
seatIds.length > 0
  ? Show summary bar with animation (slideUp 300ms)
  : Hide summary bar with animation (slideDown 300ms)
```

### 4.3 Button States & Actions

```
┌──────────────────────────────────────┐
│ [← BACK TO DECK SELECTION]           │ ← Secondary action
│                                      │
│ [CONFIRM & PROCEED]                  │ ← Primary action (CTA)
└──────────────────────────────────────┘

BACK button:
  - Clears seat selection
  - Returns to deck overview
  - Animation: slide left (200ms)

CONFIRM button:
  - Disabled if 0 seats selected
  - Click → navigate to Passenger Details page
  - Animation: ripple effect
  - Callback: onConfirmBooking(tripId, deckId, seatIds)
```

### 4.4 Close Trip Button (Top Right)

```
┌─────────────────────────────────────────────────┐
│ MNL → MDR | 08:00 – 10:30 | MV Pacific    [×]  │ ← Click to close
├─────────────────────────────────────────────────┤
│ [Ship Overview or Seat Map content]             │
│                                                  │
│ [Selection Summary Bar]                          │
└─────────────────────────────────────────────────┘

Close button:
  - Position: top-right corner
  - Icon: × (X close)
  - Tooltip: "Close & browse other trips"
  - Click → collapses card, resets to trip list
  - Animation: collapse card (400ms ease-in)
  - State: selectedSeats = cleared, stage = 'overview'
```

---

## Part 5: Full Page Layout & Responsive Behavior

### 5.1 Desktop Layout (>1024px)

```
┌──────────────────────────────────────────────────────────┐
│ Page Title: "Select Your Trip & Seats"                   │
│ Subtitle: "Find a ferry departure that works for you"    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Trip List: 3 cards in a column                            │
│ Card 1: MNL→MDR 08:00 [collapsed]                         │
│ Card 2: MNL→CXJ 14:00 [EXPANDED]                          │
│          ├─ Ship Overview                                │
│          ├─ [Select Economy/Tourist/Business]            │
│          ├─ Seat Map Grid                                │
│          └─ Selection Bar (at bottom)                    │
│ Card 3: MNL→PPS 18:00 [collapsed]                         │
│                                                           │
│ Page scrolls: User can see multiple cards + expanded     │
│ content can extend beyond viewport (scroll within card)  │
│                                                           │
└──────────────────────────────────────────────────────────┘

Widths:
  Container: max-width 1200px
  Trip cards: 100% - 32px padding
  Expanded card: same width (becomes taller)
```

### 5.2 Mobile Layout (≤768px)

```
┌──────────────────────────────────┐
│ "Select Your Trip & Seats"       │
├──────────────────────────────────┤
│                                  │
│ Trip Card 1 (Collapsed)          │
│ [MNL→MDR | 08:00 | ₱690] [▼]    │
│                                  │
│ Trip Card 2 (Expanded)           │
│ ┌────────────────────────────────│
│ │ MNL→CXJ 14:00 ₱890        [×] │
│ ├────────────────────────────────│
│ │ Ship Overview                  │
│ │ [Deck selection buttons]        │
│ │  (stacked vertically)           │
│ │                                │
│ │ Seat Map                        │
│ │ A1 A2 A3 | A4 A5 A6           │
│ │ B1 B2 B3 | B4 B5 B6           │
│ │ C1 C2 C3 | C4 C5 C6           │
│ │ D1 D2 D3 | D4 D5 D6           │
│ │ E1 E2 E3 | E4 E5 E6           │
│ │ F1 F2 F3 | F4 F5 F6           │
│ │ G1 G2 G3 | G4 G5 G6           │
│ │                                │
│ │ Selection Bar                  │
│ │ A1, B3, C5                     │
│ │ ₱2,070.00                      │
│ │ [← BACK] [CONFIRM]             │
│ └────────────────────────────────│
│                                  │
│ Trip Card 3 (Collapsed)          │
│ [MNL→PPS | 18:00 | ₱1,250] [▼]  │
│                                  │
└──────────────────────────────────┘

Mobile optimizations:
  - Cards full-width (16px padding sides)
  - Deck selection: stacked vertically
  - Seats: single column or two columns (max)
  - Sticky summary: fixed at bottom when needed
  - Touch targets: all 48×48px minimum
```

### 5.3 Tablet Layout (768px–1024px)

```
┌────────────────────────────────────────────┐
│ "Select Your Trip & Seats"                 │
├────────────────────────────────────────────┤
│ Trip cards: 100% width                      │
│ Content inside: optimized for medium screen│
│                                             │
│ Expanded card:                              │
│ ├─ Header: Trip info + close button        │
│ ├─ Ship Overview: deck cards side-by-side  │
│ ├─ Seat Map: 2-column layout               │
│ └─ Selection Bar: sticky at bottom         │
└────────────────────────────────────────────┘
```

---

## Part 6: Information Architecture & Content Hierarchy

### 6.1 Vertical Content Stack (Expanded Card)

```
1. HEADER (Sticky at card top)
   ├─ Trip info: "MNL → MDR | 08:00–10:30"
   ├─ Vessel: "MV Pacific Voyager"
   └─ Close button: [×]

2. SHIP OVERVIEW (Always first)
   ├─ "Select your preferred deck"
   ├─ Deck option 1: Economy 42 available
   ├─ Deck option 2: Tourist 28 available
   └─ Deck option 3: Business 12 available

3. SEAT MAP (After deck selected)
   ├─ Breadcrumb: "🚢 Economy Deck | ← Back"
   ├─ BOW/STERN labels
   ├─ 7×6 grid with aisles
   └─ Legend: Available | Selected | Occupied

4. SELECTION SUMMARY BAR (At bottom)
   ├─ "Your Selection"
   ├─ Seats: A1, B3, C5
   ├─ Class & Price
   └─ Buttons: [← BACK] [CONFIRM]
```

### 6.2 Progressive Disclosure Timeline

```
User Action              │ What Appears      │ Animation
─────────────────────────┼──────────────────┼─────────────
1. Click trip card       │ Ship overview    │ Expand (400ms)
                         │ Deck options     │
─────────────────────────┼──────────────────┼─────────────
2. Click deck            │ Seat map appears │ Slide up (300ms)
                         │ Below overview   │
─────────────────────────┼──────────────────┼─────────────
3. Click seat            │ Selection bar    │ Seat pop (150ms)
                         │ appears/updates  │ Bar updates
─────────────────────────┼──────────────────┼─────────────
4. Click "CONFIRM"       │ Navigate to      │ Fade out (200ms)
                         │ Passenger page   │
```

---

## Part 7: Design Tokens & Styling

### 7.1 Color Palette

```typescript
// Trip cards
const tripCardColors = {
  background: '#FFFFFF',
  border: '#e5e7eb',
  hover: '#fafbfc',
  hoverShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

// Seat states (same as previous)
const seatColors = {
  available: { fill: '#FFFFFF', stroke: '#0066CC', strokeWidth: 2 },
  selected: { fill: '#0066CC', stroke: '#FFFFFF', strokeWidth: 2 },
  occupied: { fill: '#F3F4F6', stroke: 'none', opacity: 0.6 },
};

// Summary bar
const summaryBarColors = {
  background: '#f0f4f8',
  border: '#cbd5e1',
  text: '#1f2937',
  highlight: '#0066CC',
};

// Deck selection
const deckCardColors = {
  unselected: { background: '#f9fafb', border: '#e5e7eb' },
  selected: { background: '#eff6ff', border: '#3b82f6' },
  hover: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
};
```

### 7.2 Spacing & Sizing

```typescript
const spacing = {
  containerPadding: '16px',      // Sides on mobile, 32px desktop
  cardGap: '12px',              // Between trip cards
  cardPadding: '20px',          // Inside each card
  deckCardHeight: '100px',      // Ship overview deck cards
  seatSize: '48px',             // Touch target
  aisleWidth: '16px',           // Clear walking path
  summaryBarMargin: '24px',     // Above summary bar
};

const borderRadius = {
  tripCard: '8px',
  deckCard: '6px',
  seat: '4px',
  button: '6px',
};
```

### 7.3 Animation Timing

```typescript
const animations = {
  expandTrip: { duration: 400, easing: 'ease-out' },
  deckSelection: { duration: 300, easing: 'ease-out' },
  seatPop: { duration: 150, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  summaryUpdate: { duration: 200, easing: 'ease-in-out' },
  closeCard: { duration: 400, easing: 'ease-in' },
};
```

---

## Part 8: Accessibility & Keyboard Navigation

### 8.1 Keyboard Shortcuts

```
Tab             → Navigate trip cards, buttons
Enter/Space     → Expand/collapse trip card
Escape          → Close expanded card
Arrow Down      → Next trip in list
Arrow Up        → Previous trip
Arrow Right     → Next deck in overview
Arrow Left      → Previous deck
Space (on seat) → Select/deselect seat
```

### 8.2 Screen Reader Announcements

```
Trip card (collapsed):
  "Trip: Manila to Mindoro, 08:00 to 10:30,
   ₱690 per seat, 42 economy seats available.
   Button: Select seats"

Deck option:
  "Economy Deck, 42 available seats. Button:
   Click to select this deck"

Seat button:
  "Seat A1, available, economy deck, ₱690.
   Button: Click to select"

Selection summary:
  "Selection summary: 3 seats selected,
   A1, B3, C5. Total price: ₱2,070.
   Button: Confirm and proceed"
```

### 8.3 ARIA Labels

```jsx
<div role="main" aria-label="Trip and seat selection">
  <h1>Select Your Trip & Seats</h1>

  {/* Trip cards */}
  <button
    aria-expanded={isExpanded}
    aria-controls={`trip-${trip.id}-content`}
    aria-label={`Trip to ${trip.to}, ${trip.departureTime}, ₱${trip.basePrice} per seat`}
  >
    Expand trip details
  </button>

  {/* Deck selection */}
  <button
    aria-pressed={isSelected}
    aria-label={`${deck.name}, ${deck.availableSeats} available seats`}
  >
    Select deck
  </button>

  {/* Seat */}
  <button
    aria-label={`Seat ${seat.id}, ${seat.state}, ₱${seat.price}`}
    aria-pressed={isSelected}
    disabled={seat.state === 'occupied'}
  >
    {seat.id}
  </button>
</div>
```

---

## Part 9: State Management & Data Flow

### 9.1 Trip List State

```typescript
interface TripListState {
  trips: Trip[];
  expandedTripId: string | null;        // Only one open
  selectedDeck: Map<string, Deck>;      // Per trip
  selectedSeats: Map<string, Set<string>>; // Per deck
}

interface ExpandedTripState {
  stage: 'overview' | 'seatMap';        // Two stages
  selectedDeckId: string | null;
}
```

### 9.2 State Transitions

```
Initial:
  expandedTripId = null
  all cards collapsed

User clicks trip A:
  expandedTripId = 'trip-A'
  stage = 'overview'
  shows deck selection

User clicks deck 'Economy':
  stage = 'seatMap'
  selectedDeckId = 'economy'
  shows seat grid

User clicks seat A1:
  selectedSeats['economy'].add('A1')
  summary bar updates

User clicks close [×]:
  expandedTripId = null
  stage = 'overview'
  selectedSeats cleared
  card collapses
```

### 9.3 Data Management

```typescript
// In Trip card:
const handleTripClick = (tripId: string) => {
  setExpandedTripId(expandedTripId === tripId ? null : tripId);
};

// In Deck selection:
const handleDeckSelect = (deckId: string) => {
  setStage('seatMap');
  setSelectedDeckId(deckId);
};

// In Seat grid:
const handleSeatSelect = (seatId: string) => {
  const current = selectedSeats.get(selectedDeckId) || new Set();
  if (current.has(seatId)) {
    current.delete(seatId);
  } else {
    current.add(seatId);
  }
  setSelectedSeats(new Map(selectedSeats).set(selectedDeckId, current));
};

// In Summary bar:
const handleConfirm = () => {
  const seats = selectedSeats.get(selectedDeckId);
  const tripData = {
    tripId: expandedTripId,
    deckId: selectedDeckId,
    seatIds: Array.from(seats),
  };
  navigate('/passenger-details', { state: tripData });
};
```

---

## Part 10: Implementation Checklist

### Component Structure
```
TripSelectionFlow (Main)
  ├─ TripList
  │   └─ TripCard (Expandable)
  │       ├─ TripCardHeader (Trip info + close)
  │       ├─ ShipOverview (Deck selection)
  │       └─ SeatSelectionContainer (Expandable)
  │           ├─ SeatMapInteractive
  │           └─ SelectionSummaryBar
  │
  ├─ TripFilterBar (Filters: date, route, price)
  └─ PageFooter (Help links)
```

### Deliverables
- [ ] TripSelectionFlow.tsx (main component)
- [ ] TripCard.tsx (accordion card)
- [ ] ShipOverview.tsx (deck selector)
- [ ] SeatMapInteractive.tsx (seat grid)
- [ ] SelectionSummaryBar.tsx (dynamic summary)
- [ ] CSS animations (expand, collapse, pop)
- [ ] Responsive layouts (mobile/tablet/desktop)
- [ ] Accessibility (aria labels, keyboard nav)
- [ ] State management (Redux or Context)

---

## Part 11: Before/After - Problem → Solution

### Problem (Current)
```
❌ Dense seat grid on separate page
❌ User must navigate away to compare trips
❌ No context of which trip they selected
❌ Summary table always visible (distracting)
❌ Complex flow: Trip list → Click → New page
```

### Solution (New)
```
✅ Trip list + seat selection on same page
✅ One-click expansion to see ship + seats
✅ Clear trip context (always visible in header)
✅ Dynamic summary bar (appears when selecting seats)
✅ Linear flow: List → Expand → Select → Confirm → Next
✅ Close button to collapse and compare other trips
✅ No page refresh, fast switching between trips
```

---

**Next Section**: Implementation code (see TripSelectionFlow.v3.tsx)
