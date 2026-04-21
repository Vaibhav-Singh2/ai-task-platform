# Design System Strategy: AI Task Processing Platform

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Precision Curator."** 

In the world of AI task processing, the interface must act as a sophisticated lens that brings order to algorithmic complexity. We are moving away from the "generic SaaS dashboard" aesthetic. Instead, we are adopting a high-end editorial approach. The layout should feel like a premium financial journal or a high-tech laboratory—authoritative, surgical, and spacious. 

We break the "template" look by utilizing intentional asymmetry, where data-heavy components are balanced by expansive, breathable white space. Overlapping elements and high-contrast typography scales are used to create a sense of hierarchy that guides the eye through the AI’s decision-making process without visual clutter.

## 2. Colors: Tonal Depth & Atmospheric UI
This design system utilizes a sophisticated palette of Professional Blues and Neutral Grays to establish trust and clarity.

### The "No-Line" Rule
To achieve a high-end editorial feel, designers are **prohibited from using 1px solid borders** to section off the UI. Boundaries must be defined exclusively through background color shifts or subtle tonal transitions. 
- For example, a `surface-container-low` (`#f2f4f6`) section sitting on a `surface` (`#f8f9fb`) background creates a clean, sophisticated break without the "boxed-in" feel of traditional lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of fine paper.
- **Base:** `surface` (#f8f9fb)
- **Sections:** `surface-container-low` (#f2f4f6)
- **Primary Cards:** `surface-container-lowest` (#ffffff)
- **Active Overlays:** `surface-container-highest` (#e1e2e4)

### The "Glass & Gradient" Rule
To add visual "soul," use Glassmorphism for floating elements (e.g., navigation sidebars or modal overlays). Utilize `surface_tint` (#004ced) at 5-10% opacity with a `24px` backdrop blur. 
- **Signature Texture:** Apply a subtle linear gradient to main CTAs transitioning from `primary` (#003ec7) to `primary_container` (#0052ff) at a 135-degree angle. This adds a "lithographic" depth that flat colors lack.

## 3. Typography: Editorial Authority
We use **Inter** as our typographic foundation. The hierarchy is designed to oscillate between high-impact headlines and high-density data labels.

*   **Display Scale (`display-lg` 3.5rem):** Reserved for high-level AI insights or status summaries. It should feel monumental.
*   **Headline Scale (`headline-md` 1.75rem):** Used for section titles. Ensure these have significant "air" (margin-bottom) to establish the editorial feel.
*   **Body & Labels:** `body-md` (0.875rem) handles the bulk of the task data, while `label-sm` (0.6875rem) is used for metadata and status timestamps, utilizing `on_surface_variant` (#434656) to recede visually.

The contrast between a massive `display-sm` value and a tiny `label-md` status creates the intentional "tension" that defines high-end design.

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than traditional drop shadows.

### The Layering Principle
Place a `surface-container-lowest` (#ffffff) card on top of a `surface-container` (#edeef0) background. The subtle 2% shift in brightness provides a natural, soft lift.

### Ambient Shadows
If a "floating" effect is necessary for a modal or popover, use an **Ambient Shadow**:
- `Color`: `on_surface` (#191c1e) at 6% opacity.
- `Blur`: 40px to 60px.
- `Spread`: -5px.
This mimics natural light and avoids the "dirty" look of standard 100% black shadows.

### The "Ghost Border" Fallback
If an edge must be defined for accessibility, use a **Ghost Border**: `outline_variant` (#c3c5d9) at 20% opacity. Never use 100% opaque lines.

## 5. Components: Surgical Precision

### Buttons
- **Primary:** `primary` (#003ec7) background with `on_primary` (#ffffff) text. Use `xl` (0.75rem) roundedness for a modern, approachable feel.
- **Secondary:** `secondary_container` (#95aafe) with `on_secondary_container` (#253b89). 

### Cards & Lists
**Strict Rule:** No divider lines. Separate list items using the spacing scale (e.g., 16px vertical gaps) or by alternating background colors between `surface-container-lowest` and `surface-container-low`.

### Status Indicators
AI status must be clear but integrated:
- **Success:** Use `primary` (#003ec7) for "Task Complete" to maintain brand alignment, or a custom muted emerald if true green is required.
- **Warning:** `tertiary` (#952200) for high-visibility errors.
- **Container Tones:** Use `error_container` (#ffdad6) as a soft background wash for error cards, rather than a harsh red border.

### Pulse Indicators (Custom AI Component)
For active AI processing, use a subtle "shimmer" animation on a `surface_variant` (#e1e2e4) skeleton state, using `surface_tint` as the moving highlight.

## 6. Do's and Don'ts

### Do
- **Do** use "Aggressive Whitespace." If you think there is enough space, add 16px more.
- **Do** align data points to a strict horizontal baseline.
- **Do** use the `primary_fixed_dim` (#b7c4ff) for subtle interactive states like hover.

### Don't
- **Don't** use black (#000000) for text. Use `on_surface` (#191c1e).
- **Don't** use standard 4px "card shadows." Use the Tonal Layering approach instead.
- **Don't** use icons without purpose. Icons should be minimal, line-weight 1.5pt, and match the `outline` (#737688) color.
- **Don't** use fully rounded "pills" for everything; stick to the `xl` (0.75rem) and `lg` (0.5rem) scale to maintain a professional, structured architectural look.