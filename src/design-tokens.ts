// Design Tokens - Atomic Design System Variables
// Maps legacy hex codes to modern semantic tokens

export const DESIGN_TOKENS = {
  // Color Palette
  colors: {
    // Primary Semantic States
    semantic: {
      available: {
        light: '#DCFCE7',     // Background
        base: '#10B981',      // Primary color (Green)
        dark: '#059669',      // Hover/Active
        legacy: '#90EE90',    // Legacy light green
      },
      selected: {
        light: '#EFF6FF',     // Background
        base: '#0066CC',      // Primary blue (FROM LEGACY)
        dark: '#0051A8',      // Hover/Active
      },
      reserved: {
        light: '#FEF3C7',     // Background
        base: '#F59E0B',      // Amber/Orange
        dark: '#D97706',      // Hover/Active
        legacy: '#FFA500',    // Legacy orange
      },
      blocked: {
        light: '#FEE2E2',     // Background
        base: '#EF4444',      // Red
        dark: '#DC2626',      // Hover/Active
      },

      // Landmark/Zone Colors
      landmark: {
        toilet: {
          base: '#06B6D4',    // Cyan
          light: '#CFFAFE',
          dark: '#0891B2',
        },
        exit: {
          base: '#F97316',    // Deep Orange
          light: '#FED7AA',
          dark: '#EA580C',
        },
        lifeJacket: {
          base: '#FBBF24',    // Amber
          light: '#FEF3C7',
          dark: '#D97706',
        },
        canteen: {
          base: '#A855F7',    // Purple
          light: '#F3E8FF',
          dark: '#9333EA',
        },
      },
    },

    // Neutral/Grayscale
    neutral: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1A6',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },

    // Semantic Neutral Usage
    neutralUsage: {
      surface: '#F9FAFB',           // Page background
      surface_raised: '#FFFFFF',    // Cards, lifted elements
      border: '#E5E7EB',            // Dividers, borders
      text: '#1F2937',              // Primary text
      text_secondary: '#6B7280',    // Secondary text
      text_tertiary: '#9CA3AF',     // Tertiary text
      text_inverse: '#FFFFFF',      // On dark backgrounds
      overlay: 'rgba(0, 0, 0, 0.5)',// Modals, overlays
    },

    // Feedback States
    feedback: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0066CC',
    },
  },

  // Spacing Scale (4px base)
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // Touch Targets (WCAG 2.5 Level AAA)
  touchTarget: {
    minimum: '44px',  // Required minimum
    recommended: '48px', // Recommended
    large: '56px',     // Extra large, less dense UIs
  },

  // Typography
  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '32px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Transitions
  transition: {
    fast: 'all 0.15s ease-in-out',
    base: 'all 0.2s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal_backdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    notification: 800,
  },
};

// Legacy Color Mapping (for migrating from old design)
export const LEGACY_TO_MODERN = {
  '#0066CC': DESIGN_TOKENS.colors.semantic.selected.base,
  '#90EE90': DESIGN_TOKENS.colors.semantic.available.base,
  '#FFA500': DESIGN_TOKENS.colors.semantic.reserved.base,
  '#CCCCCC': DESIGN_TOKENS.colors.neutral[300],
  '#E8E8E8': DESIGN_TOKENS.colors.neutral[100],
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: '0px',
  mobileLg: '480px',
  tablet: '768px',
  desktop: '1024px',
  desktopXl: '1280px',
};

// Accessibility Presets
export const A11Y = {
  // Contrast ratios (WCAG)
  contrast: {
    minimum: 4.5,     // 2.5.3 Contrast for text
    enhanced: 7,       // 2.5.4 Contrast enhanced
    ui: 3,             // For UI components
  },

  // Touch targets
  minTouchTarget: '44px',       // WCAG 2.5.5 Target size minimum
  recommendedTouchTarget: '48px', // Better for dense interfaces

  // Focus indicators
  focusOutline: '2px solid #0066CC',
  focusOutlineOffset: '2px',

  // Animation
  prefersReducedMotion: '@media (prefers-reduced-motion: reduce)',
};

export default DESIGN_TOKENS;
