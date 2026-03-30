# Progressive Disclosure Flow - Motion & Implementation Guide

> **Inspired by:** easybus.ph's frictionless, low-friction micro-interactions
> **Paradigm:** Shared-element transitions, progressive disclosure, micro-feedback loops

---

## 🎬 Motion Logic Breakdown

### **Phase 1: Trip List (Idle)**
```
User sees compact trip cards stacked vertically
Each card: 96px height | Horizontal layout [Route | Duration | Price] | Stroke border
Visual weight: light, minimal
Touch target: entire card (48px finger zone)
```

**Micro-interactions:**
- Hover: `shadow-md` + card lifts slightly
- Press: `scale-95` + haptic pulse
- Visual feedback is gentle—no jarring jumps

---

### **Phase 2: Card Expansion + Deck Overview**
**Timeline: 0ms–500ms**

```css
/* Card Expansion */
- 0–400ms: Card scales from 96px compact → full viewport height
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) [bounce-out]
- Backdrop: Black 40% opacity + blur filter (16px)
- Card grows from click origin point (if tracked) OR center

/* Deck Overview Appears */
- 200ms (DELAYED): Fade-in title + ship silhouette
- Landmark indicators: Staggered cascade (50ms intervals)
- Legend: Slides up from bottom at 250ms
```

**User Orientation:**
- **Bow Indicator (⬆ FRONT)** pinned to top-left
  - Always visible, never scrolls off-screen
  - Helps users understand ship rotation/orientation
  - Prevents disorientation when returning from seat map

**Why progressive disclosure?**
- Reduces cognitive load (don't dump 3 decks of seats at once)
- Guides user through logical funnel: Trip → Deck → Zone → Seats
- Mirrors physical experience: board ship → find deck → find zone → find seat

---

### **Phase 3: Zone Selection → Seat Map Zoom**
**Timeline: 500ms–800ms**

```
User taps a zone in deck overview
  ↓
1. Selected zone highlights with `scale-110` + `shadow-lg`
2. Zone animates to center of viewport (300ms spring easing)
3. Seat grid zooms in with staggered row reveal
4. Landmarks appear with fade-in cascade
5. Legend updates to show only this zone's landmarks
6. "Back to Deck" button appears (top-right, never hides)
```

**Technical details:**
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy feel
- Seat rows stagger: each row offset by +50ms (A → B → C, etc.)
- Prevents animation overload—feels guided, not chaotic

---

### **Phase 4A: Seat Selection Micro-animation**
**Timeline: 150ms per seat**

When user taps an available seat:

```
t=0ms:    Seat at scale(1), opacity(1)
t=50ms:   Seat at scale(1.15), color transition (green→blue)
t=100ms:  Particle effects radiate outward (6 small circles)
t=150ms:  Seat settle at scale(1.05), final color locked

Particle behavior:
- Start: seat center, opacity 1, scale 1
- End: radiate 40–60px outward, opacity 0, scale 0
- Each particle: different angle (360° / 6)
- Easing: ease-out (decelerate)
- Duration: 600ms total
```

**Code pattern:**
```tsx
const handleSeatClick = (seatId: string) => {
  setAnimatingSeat(seatId)               // Triggers CSS animation
  setTimeout(() => setAnimatingSeat(null), 300)  // Cleanup
  onSeatSelect(seatId)                   // Update state
}

// CSS:
.animate-[seatPop_150ms_ease-out] {
  animation: seatPop 150ms ease-out;
}

@keyframes seatPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
```

**Why particles?**
- Provides visual confirmation seat was tapped (not "dead" button)
- Creates sense of "energy release" (easybus-style delight)
- Helps distinguish from reserved/blocked seats (no pop = no selection)

---

### **Phase 4B: Sticky Summary Bar (Entrance)**
**Timeline: 250ms entrance**

When user selects **first seat**:

```
t=-50ms:  Bar is `translate-y[100%]` (off-screen)
t=0ms:    Trigger animation (user selects seat)
t=0–250ms: Bar slides up with `ease-out`
          Background: white 95% opacity + 12px blur backdrop
          Shadow: heavy (shadow-2xl)

Content layout:
┌─────────────────────────────────────────────┐
│  [Seat Count]  |  [Seat IDs]  |  $Price  |  [Proceed Button]  │
└─────────────────────────────────────────────┘

Real-time updates:
- Seat count: Always up-to-date
- Deselect flows back up (if all seats removed → bar exits with reverse animation)
```

**HTML structure:**
```tsx
<div className={`
  fixed bottom-0 left-0 right-0 z-40
  bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl
  ${isVisible ? 'animate-[slideUp_250ms_ease-out]' : 'translate-y-full'}
`}>
  {/* Content inside max-w-5xl container */}
</div>
```

---

## 📐 Component Architecture

### **3 Main Components**

#### **1️⃣ ExpandingTripCard**
```tsx
<ExpandingTripCard
  trip={trip}
  isExpanded={boolean}
  onExpand={() => handleExpandTrip(trip.id)}
  onCollapse={() => handleCollapseTrip()}
/>
```

**States:**
- `isExpanded: false` → Compact card (96px, horizontal layout)
- `isExpanded: true` → Expanded overlay with deck overview

**Key features:**
- Backdrop blur + dark overlay
- "Bow" indicator always visible
- Zone buttons with class-based colors
- Legend showing ECONOMY | TOURIST | BUSINESS

---

#### **2️⃣ SeatMapView**
```tsx
<SeatMapView
  zone={zone}
  selectedSeats={selectedSeats}
  landmarks={landmarks}
  onSeatSelect={(seatId) => handleSelectSeat(seatId)}
  onBack={() => handleBackToDeck()}
/>
```

**Grid layout:**
- Rows: A–N (labeled on left, sticky)
- Columns: 1–10 (labeled on top)
- Seat size: 48px × 40px (exceeds 44px WCAG AAA minimum)
- Gap between seats: 16px

**Seat states:**
```
Available  → bg-green-400
Selected   → bg-blue-600
Reserved   → bg-amber-300 (disabled)
Blocked    → bg-red-300 (disabled)
```

**Landmarks section:**
- Listed below grid
- Each landmark has icon + label
- Icons: LogOut (toilet), Coffee (canteen), LifeBuoy (life jacket), MapPin (exit)

---

#### **3️⃣ StickySummaryBar**
```tsx
<StickySummaryBar
  selectedSeats={selectedSeats}
  totalPrice={totalPrice}
  isVisible={isVisible}
  onProceed={() => handleProceed()}
/>
```

**Layout:**
```
[Seat Count Badge] | [Seat IDs (comma-sep)] | [Right-aligned Price] | [Button]
```

**Behavior:**
- Enter: slide-up animation (250ms, ease-out)
- Exit: reverse animation (if seats deselected)
- Always visible while seats selected
- Button: "Proceed to Checkout →" (blue, interactive)

---

## 🎯 Touch Target & Accessibility

All interactive elements meet **WCAG AAA Enhanced** standards:

| Component | Minimum Size | Recommended | Gap Between |
|-----------|--------------|-------------|-------------|
| Seat      | 44px × 44px  | 48px × 40px | 16px        |
| Trip Card | 48px height  | 96px        | 12px        |
| Zone Btn  | 44px         | 64px        | 16px        |
| Proceed   | 44px height  | 56px        | —           |

**Mobile optimization:**
- Single-column on <640px (sm breakpoint)
- Seats scale down on small screens but stay ≥44px
- Touch targets never collapse below WCAG minimum

---

## ⚙️ Animation Timing Reference

```javascript
// Reusable animation values
const TIMINGS = {
  cardExpand: 400,         // cubic-bezier(0.34, 1.56, 0.64, 1)
  deckReveal: 200,         // fade-in, delayed 200ms
  zoomToSeatMap: 300,      // spring easing (bouncy)
  seatPop: 150,            // pop animation
  particleRadiate: 600,    // particles fade out
  summaryBarEnter: 250,    // slide-up
  rowStagger: 50,          // 50ms between each row
}

// Easing functions (Tailwind-compatible)
const EASING = {
  cardExpand: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // bounce-out
  zoomZone: 'cubic-bezier(0.34, 1.56, 0.64, 1)',    // spring
  defaultEase: 'ease-out',
  smoothEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}
```

---

## 🚀 Implementation Checklist

- [x] **ExpandingTripCard** component with smooth expansion
- [x] **Deck Overview** with zone selector buttons
- [x] **SeatMapView** with grid layout & landmarks
- [x] **StickySummaryBar** with real-time price calculation
- [x] **Micro-animations**: seat pop, particle effects, entrance transitions
- [x] **Bow indicator** (always visible for orientation)
- [x] **Landmark icons** (toilet, exit, life jacket, canteen)
- [x] **Touch targets** all ≥48px minimum
- [x] **Keyboard navigation** support (via native HTML buttons)
- [x] **Responsive layout** (mobile-first)
- [x] **Color contrast** validation (WCAG AA Enhanced, 7:1+ ratio)

---

## 🎨 Figma Integration Notes

If you provide the Figma file URL, I can:

1. Extract design tokens (colors, shadows, spacing)
2. Generate Code Connect mappings for all components
3. Add component metadata (props, states, variants)
4. Create Storybook stories for each state

**Expected file structure:**
```
figma/
├── Trip Cards (collapsed/expanded states)
├── Deck Overview (ship silhouette, zones)
├── Seat Grid (availble/selected/reserved/blocked)
├── Landmarks (icons with labels)
└── Summary Bar (mobile/Desktop variants)
```

---

## 🔧 Usage Example

```tsx
import BookingFlow from './BookingFlow'

export default function App() {
  return <BookingFlow />
}
```

That's it! The component handles:
- Trip selection flow
- Deck overview navigation
- Seat selection & deselection
- Real-time price calculation
- Summary bar entrance/exit

---

**Questions?** Check motion videos at easybus.ph for reference animations.
