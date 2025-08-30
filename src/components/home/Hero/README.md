# Hero Section Architecture

This directory contains the modular Hero section components for the home page, following the same structure as other sections.

## Structure

```
Hero/
├── index.js                    # Main Hero component (entry point)
├── components/                 # All UI components
│   ├── HeroBackground.js       # Media background rendering
│   ├── HeroContent.js          # Content overlay (text, button)
│   ├── HeroNavigation.js       # Navigation dots
│   └── HeroButton.js           # Reusable button component
├── hooks/                      # Custom hooks
│   └── useHeroLogic.js         # All Hero logic and state
└── README.md                   # This file
```

## Key Design Elements

### Layout & Positioning
- **Height**: `h-[calc(100vh-64px)]` (viewport minus header height)
- **Content Alignment**: Left-aligned text and button (not centered)
- **Content Container**: `max-w-2xl` constrained width within `max-w-[1280px]` container
- **Background**: Black background with 30% overlay

### Component Details

### index.js (Main Component)
- Entry point for the Hero section
- Uses `h-[calc(100vh-64px)]` for proper viewport height
- Orchestrates all sub-components using the useHeroLogic hook
- Handles loading, error, and empty states with consistent styling

### components/HeroContent.js
- **Layout**: `justify-start` for left-aligned content (original design)
- **Container**: `max-w-[1280px]` with `max-w-2xl` content constraint
- **Positioning**: Text naturally flows left-aligned, not centered
- **Transition**: Opacity transitions matching original implementation

### components/HeroBackground.js
- Renders video, GIF, or image backgrounds exactly as original
- Handles media-specific logic (video autoplay, loop=false, etc.)
- Maintains original error handling and fallback logic
- Uses exact same overlay: `bg-black/30`

### components/HeroNavigation.js
- Renders navigation dots at `bottom-8` position
- Centered horizontally with `left-1/2 transform -translate-x-1/2`
- Uses original brand colors: active=`#FBB859`, inactive=`white/50`

### components/HeroButton.js
- Matches original button logic exactly
- Supports scroll actions and Link navigation
- Uses original styling: `px-6 py-3 rounded-md font-medium`
- Maintains hover effects: `hover:scale-105`

### hooks/useHeroLogic.js
- Contains all original state management and logic
- Maintains exact timing and transition behavior
- Handles video refs and cleanup as original
- Provides all event handlers with same functionality

## Benefits

1. **Consistent Structure**: Follows the same pattern as other sections
2. **Original Design Preserved**: Exact positioning and layout maintained
3. **Maintainability**: Each component has a single responsibility
4. **Testability**: Components can be tested in isolation
5. **Reusability**: Components can be reused elsewhere
6. **Performance**: Better code splitting opportunities

## Original Design Specifications

This implementation preserves the exact original design:
- ✅ **Left-aligned content** (not centered)
- ✅ **Shorter section height** (ends at bottom of viewport)
- ✅ **Original button rendering logic**
- ✅ **Exact media handling for video/gif/image**
- ✅ **Same navigation dot positioning and styling**
- ✅ **Identical transition and timing behavior**
