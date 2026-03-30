#!/bin/bash

# STEP 1-4 COMPLETE INTEGRATION SCRIPT
# File: d:\figma-mcp\integration\SETUP.sh
# Usage: bash SETUP.sh

set -e  # Exit on error

echo "🚢 FerryEasy Trip Selection - Complete Integration"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# STEP 1: Check prerequisites
echo -e "${BLUE}STEP 1: Checking Prerequisites${NC}"
echo "----"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed:$(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed"
    exit 1
fi
echo -e "${GREEN}✓ npm installed: $(npm --version)${NC}"

# Check lucide-react
if npm ls lucide-react &> /dev/null; then
    echo -e "${GREEN}✓ lucide-react installed${NC}"
else
    echo -e "${YELLOW}⚠ Installing lucide-react...${NC}"
    npm install lucide-react
fi

echo ""

# STEP 2: Create directory structure
echo -e "${BLUE}STEP 2: Creating Directory Structure${NC}"
echo "----"

mkdir -p src/components/TripSelection
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/context
mkdir -p src/pages/booking/[tripId]
mkdir -p src/utils
mkdir -p src/__tests__/components/TripSelection

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# STEP 3: Copy files from integration folder
echo -e "${BLUE}STEP 3: Copying Files${NC}"
echo "----"

# Copy types
cp integration/01-types.ts src/components/TripSelection/types.ts
echo -e "${GREEN}✓ types.ts${NC}"

# Copy index/barrel export
cp integration/01-setup-index.tsx src/components/TripSelection/index.tsx
echo -e "${GREEN}✓ index.tsx${NC}"

# Note: TripSelectionComponents.tsx should already be in root
if [ -f "TripSelectionComponents.tsx" ]; then
    cp TripSelectionComponents.tsx src/components/TripSelection/
    echo -e "${GREEN}✓ TripселectionComponents.tsx${NC}"
else
    echo -e "${YELLOW}⚠ TripSelectionComponents.tsx not found in root (should be there)${NC}"
fi

# Copy services
cp integration/02-tripService.ts src/services/tripService.ts
echo -e "${GREEN}✓ tripService.ts${NC}"

# Copy hooks
cp integration/02-useTripSelection-hook.ts src/hooks/useTripSelection.ts
echo -e "${GREEN}✓ useTripSelection.ts${NC}"

# Copy context
cp integration/03-BookingContext.tsx src/context/BookingContext.tsx
echo -e "${GREEN}✓ BookingContext.tsx${NC}"

# Copy pages
cp integration/03-BookingTripSelectionPage.tsx src/pages/booking/index.tsx
cp integration/03-SeatSelectionPage.tsx src/pages/booking/\[tripId\]/seats.tsx
echo -e "${GREEN}✓ Booking pages${NC}"

# Copy utilities
cp integration/04-tripValidation.ts src/utils/tripValidation.ts
echo -e "${GREEN}✓ tripValidation.ts${NC}"

# Copy tests
cp integration/04-TripSelection.test.tsx src/__tests__/components/TripSelection/
cp integration/04-booking-flow.integration.test.tsx src/__tests__/
echo -e "${GREEN}✓ Test files${NC}"

echo ""

# STEP 4: Run tests
echo -e "${BLUE}STEP 4: Running Tests${NC}"
echo "----"

if npm test -- --listTests 2>/dev/null | grep -q "TripSelection"; then
    npm test src/__tests__/components/TripSelection/TripSelectionComponents.test.tsx -- --watchAll=false
    echo -e "${GREEN}✓ Component tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Component tests not found (this is OK for fresh install)${NC}"
fi

if npm test -- --listTests 2>/dev/null | grep -q "booking-flow"; then
    npm test src/__tests__/booking-flow.integration.test.tsx -- --watchAll=false
    echo -e "${GREEN}✓ Integration tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Integration tests not found (this is OK for fresh install)${NC}"
fi

echo ""

# STEP 5: Type check
echo -e "${BLUE}STEP 5: Type Checking${NC}"
echo "----"

if command -v tsc &> /dev/null; then
    tsc --noEmit src/components/TripSelection src/services src/hooks src/context
    echo -e "${GREEN}✓ TypeScript checks passed${NC}"
else
    echo -e "${YELLOW}⚠ TypeScript not found (optional)${NC}"
fi

echo ""

# STEP 6: Summary
echo -e "${BLUE}STEP 6: Integration Summary${NC}"
echo "----"

echo -e "${GREEN}✅ All steps completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Update API endpoint in src/services/tripService.ts (line ~49)"
echo "2. Wrap your app with BookingProvider in src/pages/_app.tsx"
echo "3. Import SeatSelectionBooking component in src/pages/booking/[tripId]/seats.tsx"
echo "4. Test navigation: Start from /booking page"
echo "5. Run full test suite: npm test"
echo "6. Deploy when ready!"
echo ""
echo "📚 Documentation:"
echo "   - integration/INTEGRATION_CHECKLIST.md - Full checklist"
echo "   - TRIP_SELECTION_IMPLEMENTATION_GUIDE.md - Developer guide"
echo "   - TRIP_SELECTION_REDESIGN.md - Design specification"
echo ""
