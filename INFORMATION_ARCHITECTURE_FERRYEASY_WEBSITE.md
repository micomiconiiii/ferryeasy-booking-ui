# 📐 FerryEasy Website Information Architecture

**Document Version**: 1.0
**Last Updated**: March 30, 2026
**Status**: Complete Online Booking Flow
**Figma Reference**: Website Version (node-id=1-43)

---

## Executive Summary

FerryEasy's website booking flow is a **linear, progressive disclosure journey** that guides users from trip discovery through payment confirmation. The IA follows industry best practices (airline/hotel booking) with clear stage gates and always-visible context.

**Key Principle**: Reduce cognitive load by revealing only what's needed at each step.

---

## 1. High-Level Information Architecture Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FERRYEASY WEBSITE IA                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  HOME                                                                │
│   └─→ SEARCH/TRIP DISCOVERY                                         │
│       └─→ TRIP SELECTION & SEAT SELECTION                           │
│           └─→ PASSENGER DETAILS                                     │
│               └─→ PAYMENT                                           │
│                   └─→ CONFIRMATION                                  │
│                                                                      │
│  [Secondary Navigation]                                             │
│   ├─ My Bookings (Account)                                          │
│   ├─ Help & FAQ                                                     │
│   ├─ Contact Us                                                     │
│   └─ Terms & Conditions                                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Main User Journey Stages

### **Stage 1: Trip Discovery**

```
┌─────────────────────────────────────────────┐
│ TRIP SEARCH & FILTER PAGE                   │
├─────────────────────────────────────────────┤
│                                             │
│ [Navigation Bar]                            │
│  Logo | Home | My Bookings | Help | Login  │
│                                             │
│ [Search Form]                               │
│  From (dropdown)          [Manila ▼]       │
│  To (dropdown)            [Mindoro ▼]      │
│  Date Picker              [Apr 5, 2026]    │
│  Passengers               [1 ▼]            │
│  [SEARCH] button                           │
│                                             │
│ [Filter Panel - Sidebar]                    │
│  Price Range: ₱0 - ₱5,000                 │
│  Departure Time: Morning | Afternoon | Ev │
│  Ferry Company: Checkbox list              │
│  Vessel Type: Ferry | Catamaran            │
│  [APPLY FILTERS]                           │
│                                             │
│ [Trip Results - Main Content]               │
│  ✓ Trip 1: MNL→MDR 08:00 ₱690 [SELECT]    │
│    MV Pacific Voyager | 2h 30m             │
│    42 Economy | 28 Tourist | 12 Business   │
│                                             │
│  ✓ Trip 2: MNL→MDR 14:00 ₱890 [SELECT]    │
│    MV Island Express | 3h 15m              │
│    50 Economy | 18 Tourist | 8 Business    │
│                                             │
│  ✓ Trip 3: MNL→MDR 18:00 ₱1,250 [SELECT]  │
│    MV Sunset Cruise | 3h 45m               │
│    36 Economy | 32 Tourist | 20 Business   │
│                                             │
│ [Pagination] [1 2 3]                       │
│                                             │
└─────────────────────────────────────────────┘
```

**Page URL**: `/trips` or `/search`
**Key Elements**:
- Search form (route, date, passengers)
- Filters (price, time, company)
- Trip cards with:
  - Route + time
  - Vessel name
  - Duration
  - Price/seat
  - Capacity breakdown
  - "SELECT" CTA

**Navigation TO**: Trip Selection & Seat Selection (Stage 2)

---

### **Stage 2: Trip Selection & Seat Selection**

#### 📍 **Ferry Navigation Terminology Guide**

The seat map displays a **vessel deck layout** using standard maritime passenger navigation conventions:

| Term | Maritime Standard | Passenger View | Usage |
|------|-------------------|-----------------|-------|
| **BOW (FRONT)** | Naval: Front of vessel; points in direction of travel | Top of seat grid | "Seats near the front have forward views" |
| **STERN (BACK)** | Naval: Rear of vessel; opposite to bow | Bottom of seat grid | "Rear seating offers more stability" |
| **PORT** | Naval: Left side (when facing forward) | Left column | Visual cue in cabin signs (optional) |
| **STARBOARD** | Naval: Right side (when facing forward) | Right column | Visual cue in cabin signs (optional) |

**Accessibility Rationale**:
- Users unfamiliar with nautical terms see both traditional maritime label + common language translation
- Passenger experience improved by explaining WHY these directional markers matter (speed, stability, views)
- Consistent with international ferry booking conventions (P&O, Stena, Tallink, etc.)

---

```
┌──────────────────────────────────────────────────────────┐
│ TRIP DETAILS & SEAT SELECTION PAGE                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Header - Context Strip]                                │
│  ← Back | MNL → MDR | Apr 5, 2026 | 1 Passenger        │
│                                                          │
│ [Two-Column Layout]                                      │
│                                                          │
│ LEFT COLUMN (Seat Map)                                   │
│ ┌──────────────────────────────┐                         │
│ │ "Select Your Accommodation"  │                         │
│ │                              │                         │
│ │ 🚢 MV Pacific Voyager        │                         │
│ │ 08:00-10:30 | 2h 30m        │                         │
│ │ Deck: Main Passenger        │                         │
│ │                              │                         │
│ │ Type: [Seats] [Beds] [Cabins]                         │
│ │ Class: [Economy] [Business]                           │
│ │                              │                         │
│ │ ▶ BOW (FRONT of Vessel) →    │  ← Navigate forward    │
│ │                              │                         │
│ │ A1 A2 A3 | AISLE | A4 A5 A6 │                         │
│ │ B1 B2 B3 | AISLE | B4 B5 B6 │                         │
│ │ C1 C2 C3 | AISLE | C4 C5 C6 │                         │
│ │ D1 D2 D3 | AISLE | D4 D5 D6 │                         │
│ │ E1 E2 E3 | AISLE | E4 E5 E6 │                         │
│ │ F1 F2 F3 | AISLE | F4 F5 F6 │                         │
│ │ G1 G2 G3 | AISLE | G4 G5 G6 │                         │
│ │                              │                         │
│ │ ◀ STERN (REAR of Vessel) ←   │  ← Navigate aft        │
│ │                              │                         │
│ │ [Legend]                     │                         │
│ │ ◻ Available | ■ Selected | ◻ Occupied                 │
│ │                              │                         │
│ │ ℹ️  Tip: Front (bow) seats offer motion views;       │
│ │   Rear (stern) seats more stable                      │
│ └──────────────────────────────┘                         │
│                                                          │
│ RIGHT COLUMN (Booking Summary)                           │
│ ┌──────────────────────────────┐                         │
│ │ BOOKING SUMMARY              │                         │
│ │                              │                         │
│ │ Trip: MNL → MDR             │                         │
│ │ Time: 08:00 - 10:30         │                         │
│ │ Vessel: MV Pacific          │                         │
│ │ Date: Apr 5, 2026           │                         │
│ │                              │                         │
│ │ [SEATS SELECTED]             │                         │
│ │ Seat: A1                     │                         │
│ │ Class: Economy              │                         │
│ │ Price: ₱690.00              │                         │
│ │                              │                         │
│ │ [Pricing Breakdown]          │                         │
│ │ Sub Total: ₱690.00          │                         │
│ │ Tax: ₱69.00                 │                         │
│ │ ─────────────────            │                         │
│ │ TOTAL: ₱759.00              │                         │
│ │                              │                         │
│ │ [Promo Code Input]           │                         │
│ │ Enter code... [APPLY]        │                         │
│ │                              │                         │
│ │ [CTA Buttons]                │                         │
│ │ [← BACK]  [NEXT →]           │                         │
│ └──────────────────────────────┘                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Page URL**: `/booking/[tripId]/seats`
**Key Elements**:
- Trip context (always visible)
- **Type selector** (Seats/Beds/Cabins) - Primary selection
- **Class selector** (Economy/Business) - Secondary selection within type
- Minimalist seat grid (48×48px)
- **Ferry Navigation Labels** (core to maritime UX):
  - **BOW (FRONT)** label with arrow: Points toward vessel direction of travel
  - **STERN (REAR)** label with arrow: Points toward vessel's back
  - Optional: Directional glyphs (⇨ forward/⇦ aft) for clarity
  - Tooltip on hover: "Front seats = forward views; Rear seats = more stable" (optional)
- Aisle markers (multi-column layout clarity)
- Real-time selection summary
- Pricing breakdown
- Promo code input
- Back/Next navigation

**Ferry-Specific Design Guidance**:
- **Vessel Type Context**: Display vessel name + class (Ferry/Catamaran/Hydrofoil) to set expectations
- **Deck Information**: Include deck name (e.g., "Main Deck", "Promenade", "Lower Deck") if multi-deck
- **Navigation Clarity**: Use iconography (⬆ = BOW/FRONT, ⬇ = STERN/REAR) for visual learners
- **Passenger Comfort Tips** (optional info box):
  - BOW: "Forward-facing seats, open ocean views, slight motion"
  - STERN: "Stable seating, rear views of departure port, quieter"
  - AMIDSHIPS (middle): "Most stable zone, center-cabin experience"

**Navigation TO**: Passenger Details (Stage 3)

---

### **Stage 3: Passenger Details**

```
┌──────────────────────────────────────────────────────────┐
│ PASSENGER & CONTACT INFORMATION PAGE                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Progress Bar]                                           │
│ Search → Seats → Passenger ✓ → Payment → Confirm       │
│          (Step 3 of 5)                                  │
│                                                          │
│ [Page Title]                                             │
│ "Passenger Information"                                  │
│                                                          │
│ [Booking Summary Card - Collapsed]                       │
│ MNL → MDR | Apr 5 | Seat A1 | ₱759.00 [SHOW DETAILS]   │
│                                                          │
│ [Form: Passenger Details]                               │
│                                                          │
│ Passenger 1 (for Seat A1)                               │
│ ┌────────────────────────────────────────────────────┐  │
│ │ First Name         [________________]               │  │
│ │ Last Name          [________________]               │  │
│ │ Email              [________________@_____.com]     │  │
│ │ Phone              [+63 ___  ________]              │  │
│ │ Nationality        [Philippines ▼]                 │  │
│ │ Date of Birth      [MM/DD/YYYY]                    │  │
│ │ ID Type            [Passport ▼]                    │  │
│ │ ID Number          [________________]               │  │
│ │                                                     │  │
│ │ ☐ This is the primary contact                      │  │
│ │ ☑ Send SMS updates to this number                  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [Contact Information]                                    │
│ ☐ Same as above                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Email              [________________@_____.com]     │  │
│ │ Phone              [+63 ___  ________]              │  │
│ │ Address            [________________________________]│  │
│ │ City               [________________]               │  │
│ │ Postal Code        [______]                         │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [Notifications Preference]                               │
│ ☑ Email confirmation                                     │
│ ☑ SMS reminder 24 hours before departure               │
│ ☑ Booking updates & promotions                          │
│                                                          │
│ [Action Buttons]                                         │
│ [← BACK]  [CONTINUE TO PAYMENT →]                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Page URL**: `/booking/[tripId]/passengers`
**Key Elements**:
- Progress indicator (Step 3 of 5)
- Expandable booking summary (context)
- Passenger form:
  - Full name, email, phone
  - Nationality, DOB
  - ID type + number
- Contact information (auto-fill option)
- Notification preferences
- Back/Continue buttons

**Navigation TO**: Payment (Stage 4)

---

### **Stage 4: Payment**

```
┌──────────────────────────────────────────────────────────┐
│ PAYMENT PAGE                                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Progress Bar]                                           │
│ Search → Seats → Passenger → Payment ✓ → Confirm       │
│          (Step 4 of 5)                                  │
│                                                          │
│ [Two-Column Layout]                                      │
│                                                          │
│ LEFT COLUMN (Payment Form)                               │
│ ┌────────────────────────────────────────────────────┐  │
│ │ SELECT PAYMENT METHOD                              │  │
│ │                                                     │  │
│ │ ◉ Credit Card (Visa/Mastercard)                    │  │
│ │ ○ Debit Card                                       │  │
│ │ ○ GCash                                            │  │
│ │ ○ PayMaya                                          │  │
│ │ ○ Bank Transfer                                    │  │
│ │ ○ Cash on Departure                                │  │
│ │                                                     │  │
│ │ [Card Details]                                      │  │
│ │ Full Name on Card [________________]                │  │
│ │ Card Number       [____-____-____-____]             │  │
│ │ Expiry            [MM/YY] Security [___]            │  │
│ │                                                     │  │
│ │ ☐ Save card for future bookings                    │  │
│ │                                                     │  │
│ │ Billing Address                                     │  │
│ │ ☐ Same as contact                                  │  │
│ │ [Address fields]                                    │  │
│ │                                                     │  │
│ │ ☐ I agree to Terms & Conditions                    │  │
│ │ ☐ I have read the Cancellation Policy             │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ RIGHT COLUMN (Order Summary)                             │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ORDER SUMMARY                                       │  │
│ │                                                     │  │
│ │ MNL → MDR | Apr 5, 2026                            │  │
│ │ MV Pacific Voyager | 08:00-10:30                   │  │
│ │                                                     │  │
│ │ PASSENGERS:                                         │  │
│ │ [1] John Michael Doe                               │  │
│ │     Seat A1 | Economy Class                        │  │
│ │     Email: john@example.com                        │  │
│ │                                                     │  │
│ │ ─────────────────────────────────                  │  │
│ │ BASE FARE                ₱690.00                   │  │
│ │ TAXES & SURCHARGES       ₱69.00                    │  │
│ │ LUGGAGE ADD-ON           ₱0.00                     │  │
│ │ INSURANCE (Optional)     ₱0.00                     │  │
│ │                                                     │  │
│ │ PROMO CODE APPLIED       -₱0.00                    │  │
│ │ ─────────────────────────────────                  │  │
│ │ TOTAL AMOUNT             ₱759.00                   │  │
│ │ (Due at payment processing)                        │  │
│ │                                                     │  │
│ │ [✓ PROCESS PAYMENT]  [Secure SSL]                 │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [Security Info]                                          │
│ 🔒 Secure SSL Connection                                │
│ Your payment information is encrypted & secure           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Page URL**: `/booking/[tripId]/payment`
**Key Elements**:
- Progress indicator (Step 4 of 5)
- Payment method selection (CC, Debit, digital wallets, cash)
- Card details form
- Billing address
- Terms & conditions checkboxes
- Order summary (right sidebar)
- Secure payment button
- Security badge

**Navigation TO**: Confirmation (Stage 5)

---

### **Stage 5: Confirmation**

```
┌──────────────────────────────────────────────────────────┐
│ BOOKING CONFIRMATION PAGE                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Progress Bar]                                           │
│ Search → Seats → Passenger → Payment → Confirm ✓        │
│          (Step 5 of 5)                                  │
│                                                          │
│ [Success Banner]                                         │
│ ✓ BOOKING CONFIRMED!                                     │
│ Your reservation has been successfully processed         │
│                                                          │
│ [Confirmation Details Card]                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │ BOOKING REFERENCE #: BK-20260405-MNL-MDR-001      │  │
│ │                                                     │  │
│ │ TRIP DETAILS                                        │  │
│ │ Route: Manila (MNL) → Mindoro (MDR)               │  │
│ │ Date: Friday, April 5, 2026                        │  │
│ │ Departure: 08:00 AM                                │  │
│ │ Arrival: 10:30 AM                                  │  │
│ │ Vessel: MV Pacific Voyager                         │  │
│ │ Duration: 2 hours 30 minutes                       │  │
│ │                                                     │  │
│ │ PASSENGER INFORMATION                              │  │
│ │ Name: John Michael Doe                             │  │
│ │ Email: john@example.com                            │  │
│ │ Phone: +63-987-654-3210                            │  │
│ │                                                     │  │
│ │ SEAT ASSIGNMENT                                     │  │
│ │ Seat: A1                                            │  │
│ │ Deck: Economy                                       │  │
│ │ Cabin: Main Deck                                    │  │
│ │                                                     │  │
│ │ TOTAL PAID: ₱759.00                                │  │
│ │ Payment Method: Visa ending in 4242                 │  │
│ │                                                     │  │
│ │ IMPORTANT REMINDERS:                                │  │
│ │ • Check-in opens 1 hour before departure           │  │
│ │ • Arrive 30 min early for security                │  │
│ │ • Bring valid ID (as specified during booking)     │  │
│ │ • Cancellation available until 24 hours before     │  │
│ │ • SMS reminder will be sent 24 hours before        │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [Email Confirmation]                                     │
│ A confirmation email with detailed itinerary has been    │
│ sent to john@example.com. Check your spam folder if      │
│ you don't see it.                                        │
│                                                          │
│ [Download / Print Options]                               │
│ [📄 DOWNLOAD PDF] [🖨️ PRINT] [📧 EMAIL ITINERARY]      │
│                                                          │
│ [What's Next]                                            │
│ ┌────────────────────────────────────────────────────┐  │
│ │ • Review your itinerary & bring valid ID           │  │
│ │ • Set calendar reminder (1 day before)             │  │
│ │ • Know our baggage policy (50 kg max)              │  │
│ │ • Questions? Contact us 24/7 at support@ferry...  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [Action Buttons]                                         │
│ [HOME]  [MY BOOKINGS]  [SHARE BOOKING]                  │
│                                                          │
│ [Related Offers]                                         │
│ "Add travel insurance" [LEARN MORE]                      │
│ "Book return trip now" [BOOK NOW]                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Page URL**: `/booking/[bookingId]/confirmation`
**Key Elements**:
- Success message
- Booking reference number
- Full trip details
- Passenger info
- Seat assignment
- Total paid
- Important reminders
- Email confirmation status
- Download/print/email options
- Next steps guidance
- Related offers (upsells)
- Navigation: Home, My Bookings, Share

**Navigation TO**: Home or My Bookings

---

## 3. Secondary Pages & Flows

### **My Bookings (Account)**

```
┌──────────────────────────────────────────────────────────┐
│ MY BOOKINGS PAGE                                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Filter Tabs]                                            │
│ All | Upcoming | Completed | Cancelled                   │
│                                                          │
│ [Booking Card - Upcoming]                                │
│ ┌────────────────────────────────────────────────────┐  │
│ │ BK-20260405-MNL-MDR-001                            │  │
│ │ Manila → Mindoro | Friday, April 5, 2026           │  │
│ │ 08:00 AM | Seat A1 | Economy                       │  │
│ │ ₱759.00 | PAID                                      │  │
│ │ [VIEW DETAILS] [CHANGE SEATS] [CANCEL] [CHECK-IN]  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [Booking Card - Past]                                    │
│ ┌────────────────────────────────────────────────────┐  │
│ │ BK-20260305-MNL-CXJ-042                            │  │
│ │ Manila → Coron | Friday, March 5, 2026             │  │
│ │ 14:00 PM | Seat B2 | Economy                       │  │
│ │ ₱1,089.00 | COMPLETED                              │  │
│ │ [VIEW DETAILS] [REBOOK] [PRINT TICKET]             │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Page URL**: `/my-bookings`
**Key Elements**:
- Filter tabs (Upcoming, Past, Cancelled)
- Booking cards with quick actions
- Status indicators

---

### **Booking Details / Modification**

```
┌──────────────────────────────────────────────────────────┐
│ BOOKING DETAILS & MODIFICATION                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ [Booking Summary]                                        │
│ Reference, Trip info, Passenger info, Seat assignment   │
│                                                          │
│ [Available Actions]                                      │
│ • Change Seats (if available, before 24h cutoff)        │
│ • Add Luggage/Extras                                     │
│ • Upgrade Class (if available)                           │
│ • Cancel Booking (refund policy applies)                 │
│ • Print/Download Ticket                                  │
│ • Contact Support                                        │
│                                                          │
│ [Change Seat Flow]                                       │
│ Launches same seat selection UI as Stage 2              │
│ Shows only available seats for same route/time           │
│ Prorate price if upgrading/downgrading                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Page URL**: `/booking/[bookingId]/details`
**Navigation**: Conditional based on time cutoffs & business rules

---

## 4. Information Architecture Structure

### **Content Hierarchy**

```
LEVEL 1 - Primary Navigation
  └─ Home
  └─ Search Trips
  └─ My Account > My Bookings
  └─ Help & Support
  └─ Login / Register

LEVEL 2 - Booking Flow (Linear, No Branches)
  └─ Trip Search & Results
  └─ Seat Selection & Review
  └─ Passenger Details
  └─ Payment
  └─ Confirmation

LEVEL 3 - Account & Support
  └─ My Bookings
     ├─ View Details
     ├─ Change Seats
     └─ Cancel
  └─ Account Profile
  └─ Payment Methods
  └─ Preferences
  └─ Help Center
  └─ Contact Support
```

### **Data Architecture** (Information Flow)

```
User Input (Search)
  ↓
Trip Search Filter
  ├─ From location
  ├─ To location
  ├─ Date
  ├─ Passengers
  └─ Preferences (time, price, etc.)
  ↓
Trip Results
  └─ Available trips, prices, capacity
  ↓
Trip Selected
  ├─ Trip ID, Vessel info
  └─ Deck/Class options
  ↓
Seat Selection
  ├─ Selected seats
  ├─ Prices per seat
  └─ Pricing subtotal
  ↓
Passenger Details
  ├─ Name, email, phone
  ├─ ID info
  └─ Preferences (notifications)
  ↓
Payment
  ├─ Payment method
  ├─ Card/wallet details
  └─ Billing address
  ↓
Confirmation
  └─ Booking referen ce, details, receipt
  ↓
Database
  ├─ Bookings table
  ├─ Passengers table
  ├─ Transactions table
  └─ Emails/SMSs sent
```

---

## 5. Navigation Patterns

### **Primary Navigation (Top Bar)**

```
[Logo] | [Home] | [Search Trips] | [Help] | [Account ▼]
                                          ├─ My Profile
                                          ├─ My Bookings
                                          ├─ Settings
                                          └─ Logout
```

### **Booking Flow Navigation**

```
≡ Linear Flow (No Branching):
Search → Seats → Passenger → Payment → Confirm

≡ Each Page Has:
- Back button (← Previous step)
- Progress indicator (Step X of 5)
- Next/Continue button (→ Next step)
- Breadcrumb trail (optional)
- Always-visible trip context (header)
```

### **Breadcrumb Navigation**

```
Home > Book Now > Seats Selected > Passenger Info > Payment > ✓ Confirm
```

---

## 6. Key UI Components by Page

### **Trip Search Page**
- Header with navigation
- Search form (route, date, passengers)
- Filter sidebar (price, time, company)
- Trip result cards (with CTAs)
- Pagination

### **Seat Selection Page**
- Context header (trip info)
- Type selector tabs (Seats/Beds/Cabins) as primary filter
- Class selector tabs (Economy/Business) as secondary filter
- Minimalist seat grid (7×6 with aisles)
- Legend (seat states)
- Real-time summary sidebar
- Back/Next buttons

### **Passenger Details Page**
- Progress indicator
- Collapsible trip summary
- Passenger form (name, contact, ID)
- Notification preferences
- Back/Continue buttons

### **Payment Page**
- Progress indicator
- Payment method selector
- Card/wallet entry form
- Order summary (always visible right sidebar)
- Security badges
- Process button

### **Confirmation Page**
- Success banner
- Booking details card
- Email confirmation status
- Download/print/email options
- Related offers
- Home/My Bookings navigation

---

## 7. Responsive Breakpoints

### **Mobile (≤480px)**
```
- Single column layout
- Full-width forms
- Sticky header with trip info
- Bottom-fixed action buttons
- Vertical stacking (no sidebars)
```

### **Tablet (481px–768px)**
```
- Two-column layout possible
- Form fields: 2 per row
- Seat grid: 2-column (left/right blocks)
- Sidebar collapses to drawer
```

### **Desktop (>768px)**
```
- Two/three-column layouts
- Search filters: left sidebar (sticky)
- Seat map: center (full width available)
- Summary: right sidebar (always visible)
- Large touch targets: 48×48px
```

---

## 8. Ferry Navigation Standards & Terminology

### **Maritime Convention Reference**

Ferry seating UX is built on international maritime passenger interface standards. These help users unfamiliar with ferries understand vessel layout intuitively.

#### **Core Directional Markers**

```
VESSEL ORIENTATION (Top-Down View)

                    BOW (FRONT)
                        ↑
        PORT (LEFT)  [VESSEL]  STARBOARD (RIGHT)
                        ↓
                   STERN (REAR)

Passenger typically boards from STERN or AMIDSHIPS
```

#### **Deck Position Reference**

| Position | Label | Passenger Benefit | Motion | Noise |
|----------|-------|-------------------|--------|-------|
| **BOW (Forward)** | "Front Seats" | Panoramic ocean views, first to see port | More pronounced | Lower |
| **STERN (Rear)** | "Rear Seats" | Stable platform, watch departure point | More stable | Higher (engine) |
| **AMIDSHIPS (Center)** | "Middle Seats" | Most stable zone, balanced experience | Minimal | Medium |
| **PORT (Left)** | "Left Side" | Directional reference, naval convention | Slight tilt | Varies |
| **STARBOARD (Right)** | "Right Side" | Directional reference, naval convention | Slight tilt | Varies |

---

### **Design Implementation for Ferry Booking**

#### **When to Show Navigation Labels**

**Required** (Always Display):
- BOW (FRONT) ↑ at top of seat grid
- STERN (REAR) ↓ at bottom of seat grid
- Aisle markers for left/center/right columns

**Optional** (Based on Vessel Type):
- AMIDSHIPS label for larger ferries (8+ rows)
- PORT/STARBOARD for sophisticated travelers
- Deck name/number (e.g., "Deck 2: Lower Passenger")

**Contextual** (Via Tooltip/Help):
- Motion comfort guide (BOW = more motion, STERN = stable)
- Why these labels matter (international maritime standard)
- Accessibility note (helps passengers with mobility needs select appropriate seats)

#### **UI Component Suggestions**

```
LABEL PLACEMENT:

Top of Grid:          ▶ BOW (FRONT OF VESSEL) ▶
                      Or: ⇧ FRONT - Forward-Facing Seats ⇧

Seat Grid:            [7 rows × 6 seats + aisle]

Bottom of Grid:       ◀ STERN (REAR OF VESSEL) ◀
                      Or: ⇩ REAR - Stable Seating ⇩

DIRECTIONAL ICONS:
- 🚢 Vessel silhouette (shows orientation)
- ⬆️ = BOW/Forward
- ⬇️ = STERN/Rear
- ⬅️ = PORT/Left
- ➡️ = STARBOARD/Right
```

#### **Wayfinding & Passenger Confidence**

**Problem**: Non-ferry passengers don't know what BOW/STERN means
**Solution**:
1. Always pair nautical term with passenger-friendly equivalent:
   - "BOW (Front)" not just "BOW"
   - "STERN (Rear)" not just "STERN"
2. Add optional direction arrow (→ = forward, ← = backward)
3. Hover tooltip or info icon: "Front seats offer ocean views but more motion. Rear seats are more stable."

**For Accessibility**:
- Screen reader announces: "Rowboat seat A1, front of vessel, available"
- Keyboard users can navigate with arrow keys: up = toward bow, down = toward stern
- Color-independent indicators (not just direction arrows—use text labels too)

---

### **Ferry-Specific Seat Selection Features**

#### **Vessel Type Context** (Add to Trip Details)
```
Display format:
🚢 MV Pacific Voyager | Ferry (traditional passenger vessel)
Capacity: 500 passengers | Decks: 4 | Route duration: 2h 30m
```

Vessel types & typical layouts:
- **Traditional Ferry**: Multi-deck, multiple accommodation zones, BOW/STERN matter
- **Catamaran**: Wider, less traditional bow/stern emphasis, focus on left/right zones
- **Fast Ferry/Hydrofoil**: Compact seating, premium focus, comfort matters more than location

#### **Comfort Indicators** (Optional Enhancement)
```
When hovering over seat:
✓ Seat E4 - Middle Row (Most Stable)
  Comfort: ★★★★★ (Minimal motion)
  View: Ocean (partial)

vs.

✓ Seat A1 - Front Row
  Comfort: ★★★☆☆ (More motion)
  View: Panoramic ocean
  Accessibility: Open legroom, near facilities
```

---

### **Responsive Adaptation**

#### **Mobile (Collapsed View)**
```
ON & VESSEL AHEAD ↑   [Info icon]

[6-column seat grid with row labels A-G]

VESSEL STERN BEHIND ↓  [Info icon]

[Info below grid: "Tap ⓘ for seat info & comfort guide"]
```

#### **Desktop (Full Navigation)**
```
▶ BOW - FRONT OF VESSEL ▶  [Tooltip: Panoramic views, more motion]

[Full 7×6 seat grid with FOREward/AFT directional cues]

◀ STERN - REAR OF VESSEL ◀  [Tooltip: Stable platform, engine noise]

Legend: ◻ Available | ■ Selected | ⊙ Reserved
Tip: Maximum stability in middle rows (D, E, F)
```

---

## 8. User Roles & Access Control

### **Anonymous User**
```
Access:
- Search trips ✓
- View trip details ✓
- Proceed to booking ✓

Restrictions:
- Cannot view My Bookings ✗
- Must create account/login at payment step
```

### **Logged-In User**
```
Access:
- All anonymous user access ✓
- My Bookings ✓
- View booking history ✓
- Modify/cancel bookings (if allowed) ✓
- Saved payment methods ✓
```

### **Admin User** (Not in primary IA)
```
Access:
- Dashboard
- Manage trips
- View bookings
- Process refunds
```

---

## 9. Error Handling & Edge Cases

### **Trip Unavailable**
```
Flow:
Search Results → Trip Selected → ERROR: "Trip no longer available"
Action: Return to search results, suggest alternatives
```

### **Seat Became Taken**
```
Flow:
Seat Selection → After 10-min hold → ERROR: "Seat A1 now taken"
Action: Show nearby available seats, prompt to re-select
```

### **Payment Failed**
```
Flow:
Payment Submission → ERROR: "Card declined"
Action: Stay on payment page, show error, allow retry with different method
```

### **Session Timeout**
```
Flow:
Any page after 30 min activity → Auto-save session → Redirect to home
Action: Offer to resume booking from where left off
```

---

## 10. Call-to-Action (CTA) Hierarchy

### **Primary CTAs (High Priority)**
- "SEARCH" (trip discovery)
- "SELECT" / "SELECT SEATS" (trip selection)
- "CONTINUE TO PAYMENT" (passenger page)
- "PROCESS PAYMENT" (payment page)
- "CONFIRM BOOKING" (confirmation)

### **Secondary CTAs (Lower Priority)**
- "BACK" (step backward)
- "SAVE FOR LATER" (optional)
- "APPLY PROMO CODE"
- "ADD TRAVEL INSURANCE"

### **Tertiary CTAs (Info/Help)**
- "LEARN MORE"
- "HELP"
- "CONTACT SUPPORT"
- "FAQ"

---

## 11. Analytics & Tracking Points

### **Events to Track**
```
1. Search Initiated
   Data: From, To, Date, Passengers, Filters applied

2. Trip Viewed
   Data: Trip ID, Price, Vessel name

3. Trip Selected
   Data: Trip ID, Proceeded to seats

4. Seats Selected
   Data: Seat IDs, Class, Total price

5. Passenger Info Filled
   Data: Form completion %

6. Payment Attempted
   Data: Method, Amount

7. Payment Successful / Failed
   Data: Transaction ID, Error type (if failed)

8. Booking Confirmed
   Data: Booking ID, Final price

9. Page Abandoned
   Data: Last page visited, Time spent

10. Error Encountered
    Data: Error type, Page, User action
```

---

## 12. Information Architecture Summary Table

| Page | URL | Purpose | Key Elements | Next Step |
|------|-----|---------|--------------|-----------|
| **Trip Search** | `/trips` | Discover & filter | Form, filters, results | Seat Selection |
| **Seat Selection** | `/booking/[id]/seats` | Choose seats | Grid, summary, tabs | Passenger Info |
| **Passenger Details** | `/booking/[id]/passengers` | Contact info | Form, fields | Payment |
| **Payment** | `/booking/[id]/payment` | Process payment | Methods, card form | Confirmation |
| **Confirmation** | `/booking/[id]/confirm` | Booking receipt | Details, downloads | Home/My Bookings |
| **My Bookings** | `/my-bookings` | View history | Cards, filters | Booking Details |
| **Booking Details** | `/booking/[id]/details` | Manage booking | Summary, actions | Modify or Home |

---

## 13. User Flows (Happy Path vs Edge Cases)

### **Happy Path: Complete Booking**
```
HOME → Search → Results → SELECT Trip → SELECT Seats →
Enter Passenger Info → Select Payment → Process Payment →
CONFIRMATION ✓ → My Bookings
```

**Time**: ~8–12 minutes
**Decision Points**: 3 (trip, seats, payment method)

### **Alternative Path: Modify Booking**
```
MY BOOKINGS → Select Booking → CHANGE SEATS →
New Seat Selection → CONFIRM → Updated Confirmation
```

**Time**: ~3–5 minutes
**Constraint**: Only allowed 24+ hours before departure

### **Edge Case: Payment Failed**
```
PAYMENT PAGE → Process → ERROR → Retry Payment →
SUCCESS → CONFIRMATION
OR
CANCEL → Back to previous step
```

---

## 14. Accessibility Touchpoints

### **On Every Page**
- Skip to main content link
- Proper heading hierarchy (H1, H2, H3...)
- ARIA labels on form inputs
- Color + text for status indicators (not color-only)
- Keyboard navigation (Tab, Enter, Space)
- Focus indicators (3px outline)

### **On Seat Grid**
- Seat IDs announced by screen reader
- Grid navigation via arrow keys
- Touch targets: minimum 48×48px
- High contrast: 7:1+ ratio

### **On Forms**
- Error messages associated with fields
- Required fields marked
- Help text available
- Field validation in real-time

---

## 15. SEO & Meta Structure

### **Meta Tags by Page**

```
Home:
  Title: "Book Ferry Tickets Online | FerryEasy"
  Description: "Book ferry tickets easily. Select your trip, seats, and pay securely."

Search:
  Title: "Ferry Search Results | [From] to [To] | FerryEasy"
  Description: "Available ferries from [From] to [To] on [Date]. Book now."

Booking:
  Title: "Complete Your Ferry Booking | FerryEasy"
  Description: "Secure your ferry seat. Easy booking in 5 steps."

Confirmation:
  Title: "Booking Confirmed | FerryEasy"
  Meta robots: noindex (personal data)
```

---

## Summary

**FerryEasy Website IA** is a **linear, progressive disclosure journey** with:

✅ **5 main stages** (Search → Seats → Passenger → Payment → Confirm)
✅ **Always-visible context** (trip info in header)
✅ **Real-time feedback** (price updates, seat selection)
✅ **Mobile-first responsive** (all breakpoints supported)
✅ **Frictionless flow** (clear CTAs, minimal branching)
✅ **Full accessibility** (WCAG 2.1 AA Enhanced)
✅ **Secondary flows** (My Bookings, modify, cancel)
✅ **Ferry-Standard Navigation** (BOW/STERN/PORT/STARBOARD maritime conventions)

**Core Principles**:
- Reduce cognitive load by revealing only what's needed, when it's needed
- Use international maritime directives to help non-ferry passengers navigate confidently
- Pair nautical terms with passenger-friendly translations (BOW = FRONT, STERN = REAR)
- Provide optional comfort & motion guidance for informed seat selection

**Ferry Navigation Integration**:
- All seat selection screens display BOW (top) ↔ STERN (bottom) orientation
- Optional amidships/port/starboard labels for larger vessels
- Hover tooltips explain passenger benefits of each zone
- Mobile & desktop responsive adaptations maintain clarity

---

**Document Status**: ✅ Complete
**Version**: 1.0
**Date**: March 30, 2026
**Next Review**: Post-launch (metrics-driven)
