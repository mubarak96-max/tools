# Design Document

## Overview

The Expected Goals (xG) Explainer & Calculator will be implemented as a comprehensive web application that combines educational content with practical calculation tools. The design prioritizes statistical accuracy by implementing research-backed xG models while maintaining an intuitive user interface suitable for both casual fans and professional analysts.

The application will use a multi-layered approach: an educational section explaining xG concepts, an interactive calculator for individual shots, a batch analysis tool for multiple shots, and performance comparison features. All calculations will be based on established football analytics research and historical shot conversion data.

## Architecture

### Component Structure
```
/utility/expected-goals-calculator/
├── page.tsx (Main calculator page)
├── components/
│   ├── XGExplainer.tsx (Educational content)
│   ├── ShotCalculator.tsx (Individual shot xG calculation)
│   ├── MatchAnalyzer.tsx (Multi-shot analysis)
│   ├── PerformanceComparison.tsx (xG vs goals comparison)
│   ├── PitchVisualization.tsx (Interactive pitch for shot location)
│   └── ResultsDisplay.tsx (xG calculation results)
├── lib/
│   ├── xg-calculation.ts (Core xG calculation logic)
│   ├── shot-factors.ts (Shot type and situation modifiers)
│   └── pitch-geometry.ts (Distance and angle calculations)
└── types/
    └── xg-types.ts (TypeScript interfaces)
```

### Data Flow
1. User inputs shot parameters (location, type, situation)
2. System calculates geometric factors (distance, angle)
3. xG engine applies statistical model with modifiers
4. Results displayed with breakdown of contributing factors
5. Optional: Add to match analysis or performance comparison

## Components and Interfaces

### Core xG Calculation Engine

The xG calculation will be based on a logistic regression model that considers multiple factors:

**Base xG Factors:**
- **Distance from goal**: Exponential decay function (closer = higher xG)
- **Angle to goal**: Calculated from shot position to goal posts
- **Shot type**: Headers, volleys, penalties have different base rates
- **Body part**: Left foot, right foot, head modifiers
- **Assist type**: Cross, through ball, corner, free kick, etc.
- **Defensive pressure**: Open play vs contested shots
- **Game situation**: Open play, set piece, counter-attack

**Mathematical Model:**
```typescript
interface XGCalculation {
  baseXG: number;           // Base probability from distance/angle
  shotTypeModifier: number; // Multiplier for shot type
  assistModifier: number;   // Modifier for assist quality
  pressureModifier: number; // Defensive pressure adjustment
  finalXG: number;         // Combined xG value (0-1)
}
```

### Shot Input Interface

**Pitch Visualization Component:**
- Interactive SVG football pitch
- Click-to-place shot location
- Visual feedback for distance/angle zones
- Goal area highlighting for high xG zones

**Parameter Selection:**
- Shot type dropdown (right foot, left foot, header, volley)
- Assist type selection (cross, through ball, corner, etc.)
- Defensive pressure slider (1-5 scale)
- Game situation tags (counter-attack, set piece, etc.)

### Educational Content

**xG Methodology Explainer:**
- Interactive examples showing high vs low xG shots
- Visual breakdown of factors affecting xG
- Common misconceptions and limitations
- Professional usage examples

**Factor Impact Visualization:**
- Heatmap showing xG values across pitch positions
- Comparison charts for different shot types
- Historical conversion rate data presentation

## Data Models

### Shot Data Structure
```typescript
interface Shot {
  id: string;
  position: {
    x: number; // 0-100 (percentage of pitch width)
    y: number; // 0-100 (percentage of pitch length)
  };
  shotType: 'right_foot' | 'left_foot' | 'header' | 'volley' | 'penalty';
  assistType: 'cross' | 'through_ball' | 'corner' | 'free_kick' | 'rebound' | 'individual';
  defensivePressure: 1 | 2 | 3 | 4 | 5; // 1 = no pressure, 5 = heavy pressure
  gameSituation: 'open_play' | 'counter_attack' | 'set_piece';
  timestamp?: number;
  actualGoal?: boolean;
  xgValue: number;
}
```

### Match Analysis Data
```typescript
interface MatchAnalysis {
  shots: Shot[];
  totalXG: number;
  actualGoals: number;
  xgDifference: number;
  averageXGPerShot: number;
  conversionRate: number;
  shotsByZone: Record<string, Shot[]>;
}
```

## Error Handling

### Input Validation
- Ensure shot coordinates are within valid pitch boundaries
- Validate that all required parameters are selected
- Provide clear error messages for invalid inputs
- Graceful handling of edge cases (shots from extreme angles)

### Calculation Safeguards
- Minimum and maximum xG bounds (0.01 to 0.99)
- Fallback values for unusual shot situations
- Logging of calculation parameters for debugging
- Clear indication when calculations use estimated values

## Testing Strategy

### Unit Tests
- xG calculation accuracy against known shot scenarios
- Geometric calculations (distance and angle formulas)
- Shot type modifier applications
- Edge case handling (corner shots, penalty area boundaries)

### Integration Tests
- Complete shot input to xG calculation flow
- Multi-shot analysis calculations
- Performance comparison accuracy
- Mobile responsiveness across devices

### Validation Tests
- Compare calculated xG values against published football analytics data
- Test against historical match data where xG values are known
- Validate that xG distribution matches expected patterns
- Cross-reference with professional xG providers (Opta, StatsBomb concepts)

### Accuracy Benchmarks
- Individual shot xG should align with industry standards (±0.05 tolerance)
- Match-level xG totals should correlate with actual goal-scoring patterns
- Shot type modifiers should reflect real conversion rate differences
- Distance/angle calculations should match geometric expectations

## Performance Considerations

### Calculation Optimization
- Pre-computed lookup tables for common distance/angle combinations
- Efficient geometric calculations using optimized formulas
- Caching of frequently used modifier values
- Lazy loading of educational content components

### User Experience
- Real-time xG calculation as users adjust parameters
- Smooth animations for pitch interactions
- Progressive loading of match analysis features
- Offline capability for basic xG calculations

### Mobile Performance
- Touch-optimized pitch interaction
- Simplified input methods for mobile devices
- Efficient rendering of visualization components
- Minimal data usage for live match scenarios