# Product Requirements Document (PRD)
## FerryEasy Booking System

**Document Version:** 1.0
**Last Updated:** March 30, 2026
**Status:** Active Development
**Product Manager:** FerryEasy Team

---

## 1. Executive Summary

FerryEasy is a mobile-first, accessible ferry booking platform designed to streamline the passenger experience from trip discovery to seat selection and payment. The system prioritizes **ease of use, accessibility compliance (WCAG 2.1 AA Enhanced), and mobile-first design** to serve diverse passengers on Philippine ferry routes.

**Key Goals:**
- Reduce booking friction by 60%
- Achieve 95%+ compliance with WCAG 2.1 AA Enhanced guidelines
- Support 100,000+ concurrent users
- Enable multi-device booking experience (mobile-first)

---

## 2. Product Vision

### Mission
To make ferry booking **effortless, accessible, and delightful** for all passengers, regardless of device or ability.

### Core Values
- **Accessibility First**: No passenger left behind
- **Progressive Enhancement**: Works on slow networks
- **Transparency**: Clear pricing, no hidden fees
- **Reliability**: 99.9% uptime SLA

---

## 3. Problem Statement

### Key Pain Points
1. **Touch Errors**: 30px touch targets cause misclicks in traditional interfaces
2. **Color-Only Feedback**: Colorblind users cannot distinguish seat states
3. **Unclear Seat Landmarks**: Toilets, exits, life jackets hidden or unclear
4. **Below-Fold Confirmation**: Users must scroll to verify selection
5. **Class Switching Friction**: Tabs are unclear and hard to navigate
6. **Mobile Scrolling**: Vertical scrolling exceeds 3400px on mobile
7. **Missing Row/Column Labels**: Seat grid orientation is confusing
8. **Accessibility Gaps**: No keyboard navigation or screen reader support

---

## 4. Target User

### Primary Personas
1. **Tech-Savvy Commuters** (25-40)
   - Frequent ferry users booking on-the-go
   - Need quick, frictionless experience
   - High mobile usage (80%+)

2. **Casual Travelers** (30-55)
   - Family groups or leisure trips
   - Need clear guidance (icons, labels, feedback)
   - Mixed device usage

3. **Accessibility Users** (All ages)
   - Screen reader users
   - Keyboard-only navigation
   - Color-blind users
   - Motor/dexterity limitations

### Device Mix
- Mobile (iOS/Android): 65%
- Tablet: 20%
- Desktop: 15%

---

## 5. Product Requirements

### 5.1 Booking Flow Architecture

#### Phase 1: Trip Discovery → Seat Selection → Summary → Payment
```
[Trip List] → [Expand Card] → [Deck Overview] → [Zone Selection]
→ [Seat Map] → [Summary Bar] → [Payment]
```

#### Phase 2: Progressive Disclosure Timeline
- **0–200ms**: Trip card expand animation
- **200–400ms**: Deck sidebar fade-in
- **400–600ms**: Zone cards slide-in
- **600–800ms**: Seat map zoom-to-fit
- **800ms+**: Selection interactions available

### 5.2 Seat Selection Requirements

#### Seat States
| State | Color | Icon | Purpose |
|-------|-------|------|---------|
| Available | Green (#10B981) | ✓ Open | Can be selected |
| Selected | Navy Blue (#0066CC) | ✓ Filled | User choice |
| Reserved | Amber (#F59E0B) | ✗ Crossed | Already booked |
| Blocked | Red (#EF4444) | ✗ X | Maintenance/No access |

#### Accommodation Classes
- **Economy**: General seating (most capacity)
- **Tourist**: Mid-tier comfort, better amenities
- **Business**: Premium, recliners, priority boarding

#### Touch Target Standards
- Minimum: 44×44px (WCAG AAA)
- Recommended: 48×48px
- Large: 56×56px for vulnerable users

#### Landmarks (Onboard Services)
| Landmark | Icon | Color | Purpose |
|----------|------|-------|---------|
| Toilet | 🚻 | Cyan (#06B6D4) | Passenger facilities |
| Exit | 🚪 | Orange (#F97316) | Emergency/regular exits |
| Life Jacket | 🦺 | Yellow (#FBBF24) | Safety equipment |
| Canteen | ☕ | Purple (#A855F7) | Food/beverage service |

### 5.3 Responsive Behavior

#### Mobile (≤768px)
- Single column layout
- Horizontal zone switcher (card deck)
- Touch-optimized seat sizes (48×48px minimum)
- Sliding bottom sheet for seat details
- Sticky summary bar (always visible)

#### Tablet (768px–1024px)
- Two-column layout
- Zone sidebar fixed left
- Seat grid responsive
- Touch targets 48×48px

#### Desktop (>1024px)
- Three-column layout
- Full zone list left sidebar
- Large seat grid center
- Summary panel right sidebar
- Hybrid mouse/touch support

### 5.4 Accessibility Requirements

#### Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Arrow Keys**: Move seat selection within grid
- **Enter/Space**: Select/deselect seat
- **Escape**: Close modals/cancel
- **Skip Links**: Jump to main content

#### Screen Reader Support
- Semantic HTML (nav, main, section)
- ARIA labels for all interactive elements
- Seat descriptions: "Seat A1, Available, Economy Class"
- Zone descriptions: "Zone 1 of 3, Upper Deck"
- Announce selection feedback

#### Color & Contrast
- 7:1 contrast ratio minimum (WCAG AAA)
- Color never sole differentiator (always + icon + text)
- Support for all colorblind types (Protanopia, Deuteranopia, Tritanopia)
- Light/dark mode support

#### Motion & Animation
- Respect `prefers-reduced-motion` preferences
- No auto-playing animations
- Transitions: 200–400ms (smooth, not jarring)
- Option to disable animations

### 5.5 Performance Requirements

#### Core Metrics
- **FCP**: ≤1.5s (First Contentful Paint)
- **LCP**: ≤2.5s (Largest Contentful Paint)
- **TTI**: ≤3.5s (Time to Interactive)
- **CLS**: <0.1 (Cumulative Layout Shift)
- **Load Size**: ≤200KB (gzipped) for booking flow

#### Network Conditions
- Support "Slow 3G" mode (1.6 Mbps)
- Offline fallback (cached last view)
- Progressive loading (skeleton screens)

### 5.6 Pricing & Fare Display

#### Transparent Pricing Breakdown
```
Base Fare:           ₱ 1,500.00
Accommodation Class: +₱   200.00 (Business)
Discount:            -₱   131.00 (Promo Code)
─────────────────────────────────
Total Fare:          ₱ 1,569.00
```

- Real-time fare calculation as user selects
- Show breakdown before payment
- Clear pricing disclaimers
- No hidden fees

### 5.7 Data & Validation

#### Required Booking Data
```typescript
{
  tripId: string;
  passengerId: string;
  seatNumber: string;
  accommodationClass: "economy" | "tourist" | "business";
  fare: number;
  discount?: number;
  discountCode?: string;
  selectedAddOns?: string[]; // e.g., "meal", "luggage"
  notifications: {
    email: boolean;
    sms: boolean;
  };
}
```

#### Seat Availability Sync
- Real-time seat updates (WebSocket)
- Seat Hold: 10–15 minutes during booking
- Conflict resolution: First-come, first-served
- Optimistic UI updates with rollback

---

## 6. Success Metrics

### Business KPIs
| Metric | Target | Baseline |
|--------|--------|----------|
| Conversion Rate | 8%+ | 5% |
| Cart Abandonment | <40% | 55% |
| Average Session Time | 4–6 min | 12+ min |
| Booking Errors | <1% | 5% |
| Revenue per Booking | ₱1,500–2,000 | ₱1,200 |

### User Experience Metrics
| Metric | Target | Method |
|--------|--------|--------|
| Touch Error Rate | <2% | Heatmap analysis |
| Task Success Rate | >95% | User testing |
| Time-to-Seat Selection | <90 sec | Analytics |
| Mobile Bounce Rate | <30% | GA4 tracking |
| NPS Score | ≥50 | Survey (quarterly) |

### Accessibility Metrics
| Metric | Target | Method |
|--------|--------|--------|
| WCAG Compliance | 100% AA Enhanced | Automated + manual audit |
| Keyboard Navigation | 100% functional | Testing with screen readers |
| Color Contrast | 7:1+ | Contrast checker tool |
| Mobile Zoom Support | 200% | Responsive testing |

---

## 7. Technical Requirements

### Frontend Stack
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: React Context + Redux (if needed)
- **Styling**: Tailwind CSS + CSS Modules
- **Icons**: Lucide React
- **Animation**: Framer Motion (respecting prefers-reduced-motion)

### API Endpoints (Required)
```
GET  /api/trips                    # List available trips
GET  /api/trips/:tripId/decks      # Fetch deck/seat layout
GET  /api/trips/:tripId/seats      # Real-time seat availability
POST /api/bookings                 # Create booking
GET  /api/bookings/:bookingId      # Fetch booking details
POST /api/bookings/:bookingId/pay   # Process payment
```

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 13+, Chrome Android)

### Dependencies
- `react@^18.0.0`
- `react-dom@^18.0.0`
- `typescript@^5.0.0`
- `tailwindcss@^3.0.0`
- `lucide-react@^0.200.0`
- `framer-motion@^10.0.0`
- `@hookform/react@^7.0.0`
- `zod@^3.0.0` (validation)

### No External Dependencies for Core
- Seat grid rendering built in-house
- Touch handling via native browser APIs
- Animation via Framer Motion (not heavy libraries)

---

## 8. User Flows

### Flow 1: New Booking (Mobile)
1. User searches trips (date, route, passengers)
2. Taps trip card → expands with price details
3. Taps "Select Seats" → animated transition
4. Views deck overview with zones
5. Selects zone → zooms to seat map
6. Selects seats (validates capacity)
7. Reviews summary bar (price, seats, class)
8. Proceeds to payment
9. Confirmation screen + SMS/Email

### Flow 2: Modify Booking (Existing User)
1. User logs in, views past bookings
2. Opens booking details
3. Selects "Change Seats" (if permitted)
4. Selects new seats (holds old seats for reconciliation)
5. Confirms swap
6. Payment for price difference (if any)

### Flow 3: Accessibility User (Keyboard)
1. User tabs to trip search
2. Uses arrow keys in dropdown
3. Tabs to "Select Seats" button
4. Tabs into seat grid
5. Arrow keys navigate seats (grid-aware)
6. Spacebar/Enter selects
7. Tabs through summary
8. Tabs to "Proceed to Payment"

---

## 9. Content & Microcopy

### Key Messages
- **Empty State**: "No available seats in this zone. Try another zone or class."
- **Seat Hold**: "Your seats are held for **10 more minutes**"
- **Selection Feedback**: "✓ Seat A1 selected (Business Class) — **₱1,700.00**"
- **Accessibility**: "Keyboard navigation available – press **?** for help"
- **Error**: "Seat no longer available. Please select another."

### Tone
- Clear, friendly, non-technical
- Action-oriented ("Select Seats" not "Browse Inventory")
- Reassuring (emphasize safety, reliability, support)

---

## 10. Implementation Phases

### Phase 0: Setup (1 week)
- [ ] Design token system implementation
- [ ] Component library setup
- [ ] Figma → Code pipeline (Code Connect)
- [ ] Testing framework configuration

### Phase 1: Core Booking Flow (2–3 weeks)
- [ ] Trip search & filtering UI
- [ ] Expandable trip cards
- [ ] Deck overview sidebar
- [ ] Zone selector (card deck)
- [ ] Basic seat map grid

### Phase 2: Seat Selection & Interactions (2–3 weeks)
- [ ] Seat render optimization (virtualization)
- [ ] Touch interactions (select, pan, zoom)
- [ ] Real-time seat sync (WebSocket)
- [ ] Seat hold logic (10–15 min)
- [ ] Visual feedback animations

### Phase 3: Accessibility & Polish (1–2 weeks)
- [ ] Keyboard navigation
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Color contrast validation
- [ ] Motion preference support
- [ ] Mobile edge cases

### Phase 4: Payment & Confirmation (1–2 weeks)
- [ ] Payment gateway integration
- [ ] Email/SMS notifications
- [ ] Booking confirmation screen
- [ ] Error handling & retry logic

### Phase 5: Testing & Optimization (1–2 weeks)
- [ ] Load testing (100K+ concurrent users)
- [ ] Performance profiling
- [ ] UAT with accessibility users
- [ ] Bug fixes & refinement

**Total Timeline**: 8–13 weeks

---

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Real-time seat sync delays | High | WebSocket fallback to polling; optimistic UI |
| Mobile scrolling on large decks | High | Virtualization + panning instead of scrolling |
| Payment integration delays | Medium | Mock payment for internal testing |
| Accessibility compliance gaps | High | Early audit with accessibility experts |
| Network latency on 3G | Medium | Progressive loading, offline caching |

---

## 12. Success Criteria (Go-Live Checklist)

- [ ] **Functionality**: All seat selection flows work end-to-end
- [ ] **Performance**: Core metrics hit targets (FCP ≤1.5s, LCP ≤2.5s)
- [ ] **Accessibility**: WCAG 2.1 AA Enhanced 100% passed (automated + manual)
- [ ] **Mobile**: Works on all target devices (iOS 13+, Android 10+)
- [ ] **Reliability**: 99.9% uptime in staging environment
- [ ] **Security**: No sensitive data in logs; HTTPS everywhere
- [ ] **Documentation**: Runbook, troubleshooting guide, rollback plan
- [ ] **User Testing**: 5+ users complete full booking with 0 errors
- [ ] **Load Testing**: Sustain 10,000+ concurrent users without degradation
- [ ] **Monitoring**: Dashboards set up for errors, performance, user behavior

---

## 13. Future Enhancements (Post-MVP)

- **Group Bookings**: Multi-passenger quick-select
- **Seat Favorites**: Save preferred seats for frequent users
- **Accessibility Profiles**: User preferences (fonts, colors, animations)
- **Family Grouping**: Prioritize seat adjacency
- **Loyalty Integration**: Points, discounts, upgrades
- **Dynamic Pricing**: Surge pricing during peak hours
- **Predictive Analytics**: Fare recommendations based on demand

---

## 14. Glossary

| Term | Definition |
|------|-----------|
| **Deck** | A floor level on the ferry (Upper, Main, Lower) |
| **Zone** | Designated seating area on a deck (1–3 zones per deck) |
| **Seat Hold** | Temporary reservation (10–15 min) to prevent overbooking |
| **Accommodation Class** | Ticket tier (Economy, Tourist, Business) |
| **Landmark** | Onboard facility (toilet, exit, life jacket, canteen) |
| **FCP** | First Contentful Paint (time until first visual change) |
| **LCP** | Largest Contentful Paint (time until main content loads) |
| **WCAG** | Web Content Accessibility Guidelines (W3C standard) |

---

## Appendix: Links & References

- **Figma Design**: https://www.figma.com/design/EZY6fVfLJcl9G4hBI8Hwdl/EBPH--FerryEasy
- **Design System Token Guide**: `design-tokens.ts`
- **Accessibility Checklist**: `ACCESSIBILITY_CHECKLIST.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Motion Logic**: `MOTION_LOGIC_GUIDE.md`
- **W3C WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Figma Board**: Live demo at http://localhost:5174

---

**Document Owner**: Product Team
**Last Review**: March 30, 2026
**Next Review**: TBD (Quarterly)
