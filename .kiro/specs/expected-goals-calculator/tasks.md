# Implementation Plan

- [x] 1. Set up project structure and core xG calculation engine







  - Create directory structure for the xG calculator in `/utility/expected-goals-calculator/`
  - Implement TypeScript interfaces for shot data, xG calculations, and match analysis

  - Create core xG calculation functions with distance, angle, and modifier logic

  - Write unit tests for geometric calculations and basic xG formulas
  - _Requirements: 5.1, 5.2, 5.5_


- [ ] 2. Implement accurate xG mathematical model
  - Research and implement logistic regression model for base xG calculation
  - Create distance-based xG decay function using exponential formula
  - Implement angle calculation from shot position to goal posts
  - Add shot type modifiers based on historical conversion rates (header, volley, etc.)
  - Write comprehensive tests comparing results to known xG benchmarks
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 3. Build interactive pitch visualization component


  - Create SVG-based football pitch with accurate proportions and markings
  - Implement click-to-place shot location functionality with coordinate mapping
  - Add visual feedback showing xG zones with color-coded heatmap overlay
  - Create goal area highlighting and distance/angle visualization lines
  - Ensure responsive design works on both desktop and mobile devices
  - _Requirements: 2.1, 6.1, 6.4_


- [x] 4. Create shot parameter input interface



  - Build dropdown selectors for shot type (right foot, left foot, header, volley)
  - Implement assist type selection with options (cross, through ball, corner, etc.)
  - Add defensive pressure slider with 1-5 scale and visual indicators
  - Create game situation selector (open play, counter-attack, set piece)
  - Add form validation and error handling for all input parameters
  - _Requirements: 2.2, 2.3, 2.4, 6.2, 6.3_




- [ ] 5. Develop real-time xG calculation and results display
  - Connect pitch visualization to xG calculation engine for live updates
  - Create results component showing final xG value with factor breakdown
  - Implement explanation of which factors most influenced the xG calculation



  - Add visual indicators for high/medium/low xG probability ranges
  - Display calculation transparency with methodology explanation
  - _Requirements: 2.1, 2.5, 2.6, 5.6_

- [x] 6. Build educational xG explainer section

  - Create comprehensive explanation of Expected Goals methodology
  - Implement interactive examples showing high xG vs low xG shot scenarios
  - Add visual comparisons of different shot types and their typical xG values
  - Create section explaining xG limitations and proper statistical interpretation
  - Include heatmap visualization showing xG values across different pitch positions
  - _Requirements: 1.1, 1.2, 1.3, 1.4_


- [ ] 7. Implement multi-shot match analysis functionality
  - Create shot list component for adding and managing multiple shots
  - Implement running total xG calculation for accumulated shots
  - Add summary statistics (average xG per shot, total xG, shot count)
  - Create filtering options by shot type, location zone, and time period
  - Build export functionality for shot data and analysis results
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_


- [ ] 8. Develop performance comparison features
  - Create input interface for actual goals scored vs calculated xG
  - Implement xG difference calculation (goals - xG) with performance indicators
  - Add visual indicators for overperformance/underperformance with color coding
  - Create explanatory text about what positive/negative xG differences indicate
  - Include context about sample size and statistical significance warnings

  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 9. Optimize for mobile and live match usage
  - Implement touch-optimized controls for mobile pitch interaction
  - Create quick input methods suitable for rapid shot entry during live matches
  - Optimize performance for smooth operation on mobile devices
  - Add keyboard shortcuts and gesture support for faster data entry
  - Ensure all features work seamlessly across different screen sizes
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Add comprehensive testing and validation
  - Write integration tests for complete shot input to xG calculation workflow
  - Create validation tests against published football analytics data




  - Implement accuracy benchmarks comparing to industry-standard xG values
  - Add error handling tests for edge cases and invalid inputs

  - Create performance tests ensuring fast calculation times
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 11. Integrate with existing tools platform
  - Add xG calculator to the main tools registry with appropriate metadata
  - Create route and page structure following existing platform patterns
  - Implement SEO optimization with proper meta tags and structured data
  - Add the tool to relevant category pages and navigation
  - Ensure consistent styling with the existing design system
  - _Requirements: 1.1, 6.4_

- [ ] 12. Final polish and documentation
  - Add comprehensive help tooltips and user guidance throughout the interface
  - Create detailed methodology documentation explaining the xG calculation approach
  - Implement analytics tracking for tool usage and popular features
  - Add social sharing capabilities for calculated xG results
  - Perform final cross-browser testing and accessibility compliance checks
  - _Requirements: 1.1, 1.4, 5.6_