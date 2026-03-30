# 🎨 Ferry Seat Selection - UI/UX Specification v2.0

**Status**: In Development
**Version**: 2.0 - Industry Standard Redesign
**Last Updated**: March 30, 2026

---

## Executive Summary

Transform the dense seat map into a clean, spacious, professional interface inspired by:
- **Airline Booking** (Lufthansa, Singapore Airlines)
- **Premium Cinema** (Alamo Drafthouse, Vue)
- **Hotel Room Selection** (Airbnb, Booking.com)

**Key Principle**: Progressive disclosure + cognitive load reduction

---

## Part 1: Visual De-Cluttering & Cognitive Load

### 1.1 Geometric Simplicity

#### Seat Design
```
BEFORE: Complex seat icons with chair illustrations
┌────┐
│ 🪑 │  ← Extra visual noise
└────┘

AFTER: Simple rounded squares
┌────────────────┐
│   A1           │  ← Clean, minimal
│   24px × 24px  │
└────────────────┘
```

**Implementation**:
- Seat size: **48×48px** (touch target WCAG AAA)
- Inner content size: **24×24px** (seat number)
- Border radius: **4px** (slightly rounded, modern feel)
- Opacity hierarchy: Available (100%) → Occupied (50%) → Selected (100%)

#### State Rendering Rules
```typescript
// NO visual content inside seats UNTIL hover/focus
Available seat (no hover)
  └─ Empty white box with light blue stroke

Available seat (hovered)
  └─ Seat number appears (A1, B2, C3...)
  └─ Background subtle gradient
  └─ Lift effect (shadow)

Selected seat
  └─ Checkmark icon ✓
  └─ Brand blue background
  └─ White text
  └─ Permanent visibility

Occupied seat
  └─ Empty grey box
  └─ No border
  └─ No interactivity
  └─ Visually recedes
```

### 1.2 Aisle Logic & Floor Design

#### Deck Layout Structure
```
┌─── DECK OVERVIEW (Context) ───┐
│  Flight: MNL → MDR  08:00     │
│  ──────────────────────────── │
│  🔴 BOW (Front)               │
│                               │
│  ▌  S1  ▌      S2  ▌          │ ← Aisle (4px gap)
│  ▌  S3  ▌      S4  ▌          │ ← Aisle (wider, ~16px)
│  ▌  S5  ▌      S6  ▌          │
│  ──────────────────────────── │
│  🔵 STERN (Back) Floor Color  │
│                               │
└───────────────────────────────┘

Visual Elements:
  - Aisle: 12–16px gap (SVG line or border)
  - Floor: bg-gray-50 or subtle gradient
  - Seat block: bg-white container
  - Walking path: Explicitly shown gap
```

#### CSS Implementation
```css
.seat-deck {
  background: linear-gradient(180deg, #f8f9fa 0%, #f0f1f3 100%);
  /* Subtle floor texture */
  border: 1px solid #e0e0e0; /* Deck boundary */
}

.seat-block {
  display: grid;
  grid-template-columns: repeat(3, 48px);
  gap: 8px; /* Intra-block gap */
  background: white;
  padding: 16px;
  border-radius: 8px;
}

.seat-aisle {
  width: 16px; /* Clear walking path */
  background: url('data:image/svg+xml,...'); /* Aisle marker */
  display: flex;
  align-items: center;
  justify-content: center;
}

.seat-aisle::before {
  content: '';
  width: 1px;
  height: 100%;
  background: dashed #ccc;
  opacity: 0.5;
}
```

### 1.3 Iconography Rules

#### Minimal Icons
```
ONLY USE ICONS FOR:
  1. PWD/Wheelchair Accessible → ♿ icon in corner
  2. Emergency Exit → ⬜ marker (not a seat)
  3. Toilet → 🚻 (map legend, not on seat)
  4. Life Jacket → 🦺 (map legend, not on seat)

DO NOT USE:
  ✗ Chair illustrations inside seats
  ✗ Window/Aisle preference markers
  ✗ Multiple status indicators per seat
```

#### PWD Accessible Seat Example
```
Accessible Seat Layout:
┌─────────────────────────────┐
│ ┌──────────┐  ┌──────────┐  │
│ │ A1       │  │ A2 ♿     │  │ ← Wheelchair icon in corner
│ │ (Empty)  │  │ (Empty)  │  │
│ └──────────┘  └──────────┘  │   48×48px seat
│                              │   8px icon in top-right
│┌─────────────────────────────│   + 4px padding
```

---

## Part 2: Frictionless Interaction Patterns

### 2.1 Progressive Disclosure Flow

#### State Machine
```
┌─────────────────────────────────────────┐
│ INITIAL STATE                            │
│ ✓ Trip overview visible (thin header)   │
│ ✓ Accommodation tabs visible            │
│ ✓ Seat map visible                      │
│ ✗ Summary table HIDDEN                  │
│ ✗ Sticky bar HIDDEN                     │
└─────────────────────────────────────────┘
                  ↓
         User clicks seat
                  ↓
┌─────────────────────────────────────────┐
│ SELECTION STATE                          │
│ ✓ Trip overview: thin header (sticky)   │
│ ✓ Accommodation tabs visible            │
│ ✓ Seat map visible + selected highlighted│
│ ✓ Sticky Summary Bar APPEARS (animation)│
│   - "3 Seats Selected"                  │
│   - "Total: ₱4,500.00"                  │
│   - "Book Now" button                   │
└─────────────────────────────────────────┘
                  ↓
     User clicks "Book Now"
                  ↓
┌─────────────────────────────────────────┐
│ CHECKOUT STATE                           │
│ → Navigate to payment screen             │
└─────────────────────────────────────────┘
```

#### Sticky Summary Bar Design
```
┌──────────────────────────────────────────────────────────┐
│ 📍 Seats: A1, B3, C5      │ Total: ₱4,500.00 │ Book Now │
└──────────────────────────────────────────────────────────┘
 ↑                            ↑                    ↑
 │                            │                    └─ CTA Button
 │                            │
 │                            └─ Always on right
 │
 └─ Selected seat IDs + count

Height: 56px (mobile-friendly)
Position: Fixed bottom of viewport
Z-Index: 50 (above seat map)
Animation: Slide up from bottom (300ms ease-out)
```

### 2.2 Smart Selection & Real-Time Updates

#### Tap-to-Select Logic
```typescript
interface SeatInteraction {
  action: 'select' | 'deselect';
  seatId: string;
  timestamp: number;

  // Immediate updates (NO page reload):
  updates: {
    uiState: 'instant'; // <16ms
    priceCalc: 'instant'; // <16ms
    stickyBar: 'slideIn'; // 300ms animation
    seatHighlight: 'pop'; // 150ms scale animation
  }
}
```

#### Price Update Flow
```
User taps seat A1 (economy, ₱1,500)
         ↓
State updates: selectedSeats = {A1}
         ↓
Calculate: totalPrice = 1,500
         ↓
ALL updates batched:
  - Seat visual feedback (pop animation)
  - Summary bar appears/updates
  - Price recalculated
         ↓
Total time: ~150–300ms (perceptually instant)
```

#### No-Jank Guarantees
```
✗ NEVER: Re-render entire seat grid
✗ NEVER: Trigger page layout recalculation
✗ NEVER: Scroll content up/down
✓ ALWAYS: Use transforms for animations (GPU accelerated)
✓ ALWAYS: Batch DOM updates (React batching)
✓ ALWAYS: Use CSS for state feedback (hover, focus)
```

### 2.3 Zoom & Pan Strategy

#### Threshold Logic
```
Seats per deck: 7 × 6 = 42 seats

IF seats > 50 AND mobileViewport:
  └─ Show mini-map + pinch-to-zoom

IF seats > 100:
  └─ Show deck selector (Upper/Middle/Lower)
  └─ Show mini-map mandatory

IF desktop AND seats > 120:
  └─ Split into multi-column layout
```

#### Mini-Map Implementation
```
┌────────────────────────────────────────────────┐
│  Main Seat Map (Full detail)                  │
│  [A1] [A2] [A3] [A4] [A5] [A6]                │
│  [B1] [B2] [B3] [B4] [B5] [B6]  ┌──────────┐  │
│  [C1] [C2] [C3] [C4] [C5] [C6]  │ Mini-map │  │
│                                  │ [Grid]   │  │
│                                  │ [Rect]   │  │
│                                  └──────────┘  │
└────────────────────────────────────────────────┘

Mini-map:
  - Floating element (bottom-right corner)
  - Shows entire deck in miniature
  - Viewport indicator rect highlights visible area
  - Tappable: click mini-map to pan main view
```

#### Pinch-to-Zoom
```
Gesture detection:
  1. Pinch in: Zoom to 150% (scale 1 → 1.5)
  2. Pinch out: Zoom back to 100%
  3. Double-tap: Toggle zoom
  4. Pan: Drag to navigate when zoomed

Constraints:
  - Zoom range: 100% → 200%
  - Seat size always ≥ 44px (WCAG AAA)
  - Sticky bar remains visible during zoom
```

---

## Part 3: Industry Standard Status States

### 3.1 Seat State Design System

```
┌─────────────────────────────────────────────────────────┐
│ STATE COMPARISON TABLE                                  │
├─────────────────────────────────────────────────────────┤
│ State     │ Fill      │ Border    │ Icon  │ Label       │
├─────────────────────────────────────────────────────────┤
│ Available │ White     │ Blue (#0  │ None  │ Empty seat  │
│           │           │ 066CC)    │       │ (shows #    │
│           │           │ 2px       │       │ on hover)   │
├─────────────────────────────────────────────────────────┤
│ Occupied  │ Grey-200  │ None      │ None  │ Greyed out  │
│           │ (#eee)    │           │       │ (recedes)   │
│ Selected  │ Blue      │ White     │ ✓     │ Checkmark   │
│ (#0066CC) │ Ring      │ 2px       │ + ring│
├─────────────────────────────────────────────────────────┤
│ Hover*    │ White     │ Blue      │ None  │ Lift shadow │
│           │ + gradient│ 2px       │       │ (interactive│
│           │           │ (stronger │       │  cue)       │
│           │           │ than      │       │
│           │           │ default)  │       │
├─────────────────────────────────────────────────────────┤
│ Focus     │ White     │ Blue      │ None  │ Outline 3px │
│ (kbd)     │           │ 3px       │       │ (WCAG AAA)  │
│           │           │ + ring    │       │             │
├─────────────────────────────────────────────────────────┤
│ Disabled  │ Light     │ None      │ ✗     │ Pointer:    │
│/Blocked   │ Grey (#f  │           │       │ not-allowed │
│           │ ff)       │           │       │ opacity 50% │
└─────────────────────────────────────────────────────────┘
* Hover only on desktop/mouse; mobile uses tap-immediately
```

### 3.2 Micro-Interactions

#### Selection Pop Animation
```
Timeline: 0–150ms cubic-bezier(0.34, 1.56, 0.64, 1)

0ms:    scale(1)
75ms:   scale(1.2)  ← Peak
150ms:  scale(1)    ← Back to normal

Result: Satisfying "press" feedback without jarring
```

#### Sticky Bar Slide-In
```
Timeline: 0–300ms ease-out

0ms:    translateY(100%) opacity(0)
300ms:  translateY(0)   opacity(1)

Result: Smooth entrance, doesn't startle user
```

#### Hover Lift Effect
```
CSS:
button:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  ~ 8 pixel vertical lift
  transform: translateY(-2px);  ← subtle
  transition: all 200ms ease-out;
}
```

---

## Part 4: Information Hierarchy

### 4.1 Sticky Header (Collapsible Trip Overview)

#### Desktop Layout (>1024px)
```
┌────────────────────────────────────────────────────────┐
│ Trip Summary (Sticky Top)                              │
├────────────────────────────────────────────────────────┤
│ MNL → MDR | Fri, Apr 5 | 08:00–10:30 | Base ₱1,500    │
│ ✓ 3/4 seats selected | Subtotal: ₱4,500               │
└────────────────────────────────────────────────────────┘
         Compact: 40px height

         ↓ (on scroll down)

┌────────────────────────────────────────────────────────┐
│ MNL → MDR | ₱1,500/seat | 3/4 selected                 │
└────────────────────────────────────────────────────────┘
         Minimal: 32px height
```

#### Mobile Layout (≤768px)
```
┌──────────────────────────────────────┐
│ MNL → MDR | 08:00 |  3/4 selected    │  ← 40px sticky
│ ₱4,500 total                         │
└──────────────────────────────────────┘
```

### 4.2 Tab Navigation (Accommodation Types)

#### Design
```
┌────────────────────────────────────────────────────────┐
│ Select Your Cabin                                      │
├────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  🚢 Seats    │  │  🛏️  Beds     │  │  🚪 Cabins    │ │
│  │  (6x seat)   │  │  (2x bed)     │  │  (4-bed room) │ │
│  │  Economy     │  │  Tourist      │  │  Business     │ │
│  │  ₱1,500      │  │  ₱2,500       │  │  ₱4,000       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│    ↑ Active                                              │
│    (white bg, blue border)                              │
└────────────────────────────────────────────────────────┘

Behavior:
  - Click tab → clear previous selection
  - Animate transition (fade out, fade in)
  - Update seat grid below
  - Prices recalculate
```

### 4.3 Information Layering

```
HIERARCHY (Top to Bottom):

Layer 1: Trip Overview (Sticky)
  └─ Route, Time, Base Price, Selection Count
  └─ Height: 40–56px (always visible or collapsible)

Layer 2: Accommodation Selector (Fixed/Sticky)
  └─ 3 tabs: Seats | Beds | Cabins
  └─ Height: 120px (collapsible on mobile)

Layer 3: Main Content (Scrollable)
  └─ Seat Map Grid
  └─ Landmarks Legend
  └─ Capacity info

Layer 4: Sticky Summary Bar
  └─ Fixed bottom
  └─ Shows when seats selected
  └─ Height: 56–80px
```

---

## Part 5: Design Tokens & Variables

### 5.1 Color Palette

```typescript
// Seat States
const seatColors = {
  available: {
    fill: '#FFFFFF',
    stroke: '#0066CC',  // Navy
    strokeWidth: 2,
  },
  occupied: {
    fill: '#F3F4F6',    // Grey-100
    stroke: 'none',
    opacity: 0.6,
  },
  selected: {
    fill: '#0066CC',    // Navy
    stroke: '#FFFFFF',
    strokeWidth: 2,
    icon: '✓',
  },
  focused: {
    fill: '#FFFFFF',
    stroke: '#0066CC',
    strokeWidth: 3,
    outline: '#0066CC', // Additional outline for keyboard nav
  },
};

// Floor/Deck
const deckColors = {
  floor: 'linear-gradient(180deg, #f8f9fa 0%, #f0f1f3 100%)',
  aisleGuideline: '#d1d5db',  // Grey-300
  seatBlockBg: '#FFFFFF',
};

// Buttons & CTA
const ctaColors = {
  primary: '#FFD700',         // Gold
  primaryHover: '#FFC700',
  secondary: '#0066CC',       // Navy
  danger: '#EF4444',          // Red
};
```

### 5.2 Spacing & Sizing

```typescript
const spacing = {
  seatSize: '48px',           // Touch target
  seatInnerSize: '24px',      // Content inside seat
  seatGap: '8px',             // Between seats
  aisleWidth: '16px',         // Walking path
  blockPadding: '16px',       // Around seat block
  stickyBarHeight: '56px',    // At bottom
  headerHeight: '40px',       // Trip overview
  tabsHeight: '120px',        // Accommodation selector
};

const borderRadius = {
  seat: '4px',
  block: '8px',
  button: '6px',
};

const shadows = {
  subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
  hover: '0 4px 12px rgba(0, 0, 0, 0.12)',
  sticky: '0 -2px 12px rgba(0, 0, 0, 0.08)',
};
```

### 5.3 Animation Timing

```typescript
const animations = {
  seatPop: {
    duration: 150,          // ms
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  stickyBarAppear: {
    duration: 300,
    easing: 'ease-out',
  },
  hoverLift: {
    duration: 200,
    easing: 'ease-out',
  },
  tabTransition: {
    duration: 200,
    easing: 'ease-in-out',
  },
};
```

---

## Part 6: Responsive Behavior

### 6.1 Mobile (≤768px)

```
┌──────────────────────────────────┐
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │
│ MNL→MDR | 08:00 | 3/4 selected   │ ← 40px Sticky Header
├──────────────────────────────────┤
│ ┌────────────────────────────────┤
│ │  🚢 Seats  🛏️ Beds  🚪 Cabins  │ ← Horizontal scroll tabs
│ │  ╔select ╝  ╔sel ╝   ╔select ╝ │
│ └────────────────────────────────┤
│                                  │
│ Seats (Single column):           │
│ ┌──┬──┬──┐                        │
│ │A1│A2│A3│                        │
│ ├──┼──┼──┤                        │
│ │B1│B2│B3│                        │
│ └──┴──┴──┘                        │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 3 Seats │ ₱4,500 │ Book Now  │ ← Sticky Bottom
│ └──────────────────────────────┘ │
└──────────────────────────────────┘

Constraints:
  - Grid width: 100vw – 32px (paddings)
  - Seats: 48×48px (touch-friendly)
  - Gaps: 8px
  - Tabs: Horizontally scrollable
```

### 6.2 Tablet (768px–1024px)

```
┌────────────────────────────────────────────┐
│ MNL→MDR | 08:00–10:30 | 3/4 selected      │ ← 48px Header
├────────────────────────────────────────────┤
│  🚢 Seats   🛏️ Beds   🚪 Cabins           │ ← Visible tabs
├────────────────────────────────────────────┤
│ Seats (Two-column grid):                  │
│ ┌─────────────────┐ ┌─────────────────┐   │
│ │ A1 A2 A3        │ │ A4 A5 A6        │   │ ← Left/Right blocks
│ │ B1 B2 B3        │ │ B4 B5 B6        │   │
│ │ C1 C2 C3        │ │ C4 C5 C6        │   │
│ └─────────────────┘ └─────────────────┘   │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ 3 Seats Selected │ ₱4,500 │ Book Now  │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 6.3 Desktop (>1024px)

```
┌──────────────────────────────────────────────────────────────┐
│ MNL→MDR | 08:00–10:30 | 3/4 selected | Base ₱1,500         │
├──────────────────────────────────────────────────────────────┤
│ 🚢 Seats    🛏️ Beds    🚪 Cabins                            │
├──────────────────────────────────────────────────────────────┤
│ Seat Map (Three-column layout):                             │
│ ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐      │
│ │ A1 A2 A3    │  │             │  │ Cabin Details    │      │
│ │ B1 B2 B3    │  │ Mini-map    │  │ ✓ A1 Economy     │      │
│ │ C1 C2 C3    │  │ +Zoom info  │  │   ₱1,500         │      │
│ │ D1 D2 D3    │  │             │  │ ✓ B3 Economy     │      │
│ │ E1 E2 E3    │  │             │  │   ₱1,500         │      │
│ │ F1 F2 F3    │  │             │  │ ✓ C5 Economy     │      │
│ │ G1 G2 G3    │  │             │  │   ₱1,500         │      │
│ └─────────────┘  └─────────────┘  │ Total: ₱4,500    │      │
│                                    └──────────────────┘      │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Edit | Clear Selection              Book Now (Blue) |  │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Part 7: Accessibility Integration

### 7.1 Keyboard Navigation

```
TAB             → Navigate between seats (grid-aware)
SHIFT+TAB       → Reverse navigation
ARROW KEYS      → Move within grid (↑↓←→)
SPACE/ENTER     → Select/deselect seat
ESCAPE          → Cancel, clear focus
? (Shift+/)     → Show keyboard help

Grid Navigation Logic:
  - Left arrow: Move to previous seat
  - Right arrow: Move to next seat
  - Up arrow: Move up one row
  - Down arrow: Move down one row
  - Boundary wrapping: No wrap (stop at edge)
```

### 7.2 Screen Reader Announcements

```
Seat button aria-label:
  "Seat A1, Available, Economy Class, ₱1,500, row 1 of 7, column 1 of 6"

On selection:
  "Seat A1 selected, 1 seat selected, total price ₱1,500"

On deselection:
  "Seat A1 deselected, 0 seats selected"

Summary bar:
  "Booking summary: 3 seats selected, A1, B3, C5"
  "Total: ₱4,500, Book Now button active"
```

### 7.3 Color Contrast Validation

```
State         │ Contrast Ratio │ WCAG Level
──────────────┼────────────────┼──────────
Available     │ 7.1:1          │ AAA ✓
Selected (✓)  │ 8.2:1          │ AAA ✓
Occupied      │ 4.5:1          │ AA ✓
Hover shadow  │ N/A (shadow)   │ N/A
```

---

## Part 8: Implementation Checklist

### Component Requirements
- [ ] Remove seat icon illustrations
- [ ] Implement minimalist square seat design
- [ ] Add aisle markers (SVG or CSS)
- [ ] Create deck floor background
- [ ] Build sticky summary bar
- [ ] Implement progressive disclosure (toggle summary)
- [ ] Add selection pop animation
- [ ] Add hover lift effect
- [ ] Keyboard navigation (grid-aware)
- [ ] Screen reader support
- [ ] Mini-map (conditional for large grids)
- [ ] Pinch-to-zoom (mobile)
- [ ] Responsive layouts (mobile/tablet/desktop)
- [ ] Dark mode support

### Testing Checklist
- [ ] Manual: Desktop mouse interaction
- [ ] Manual: Mobile touch interaction
- [ ] Manual: Keyboard-only navigation (all seats reachable)
- [ ] Manual: Screen reader (NVDA/JAWS/VoiceOver)
- [ ] Visual: 48×48px seat targets
- [ ] Visual: 7:1+ color contrast
- [ ] Visual: No jank during selection
- [ ] Performance: <150ms for seat pop animation
- [ ] Performance: <300ms for sticky bar appearance

---

## Part 9: Migration Guide (Old → New)

### What's Changing

| Aspect | Old | New |
|--------|-----|-----|
| **Seat Visual** | Chair icon inside | Minimal number/empty |
| **Density** | Dense, crowded | Spacious, breathing room |
| **Summary** | Always visible table below | Hidden, sticky bar only |
| **Hover State** | Slight color change | Lift + shadow |
| **Aisle Visual** | Implicit (no marker) | Explicit dashed line |
| **Occupied Seats** | Dimmed with icon | Recessed grey (no interaction) |

### Breaking Changes
None (backward compatible props)

### Migration Path
1. Old component still works
2. New component uses same data structures
3. Switch via `useNewDesign={true}` prop
4. Gradual rollout: 10% → 25% → 100%

---

**Next Section**: Implementation code (see `SeatSelectionBooking.v2.tsx`)
