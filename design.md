---
name: Modular Precision System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#bcc5ec'
  on-secondary: '#252f4e'
  secondary-container: '#3e4868'
  on-secondary-container: '#aeb7dd'
  tertiary: '#ffe7e7'
  on-tertiary: '#67001b'
  tertiary-container: '#ffc1c4'
  on-tertiary-container: '#a7263c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#bcc5ec'
  on-secondary-fixed: '#101a38'
  on-secondary-fixed-variant: '#3c4666'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b6'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#8e0f2b'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  mono-tech:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin: 48px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for a premium, high-tech modular home configuration experience. It bridges the gap between architectural groundedness and futuristic innovation. The personality is defined by technical precision and effortless sophistication, catering to users who value both sustainability and cutting-edge aesthetics.

The visual direction utilizes a **Glassmorphic-Minimalist** hybrid. This approach reflects the transparency of the modular building process while maintaining a clean, structured environment. By using translucent layers and high-contrast technical accents, the interface feels like a sophisticated drafting tool rather than a standard retail site. The goal is to evoke a sense of "digital craftsmanship," where every pixel feels as intentional as the modular components themselves.

## Colors

This design system utilizes a deep-dark foundation to make modular configurations pop with cinematic clarity. The palette transitions the original brand colors into a high-performance, tech-forward environment.

- **Primary (Electric Cyan):** A vibrant, neon-teal used exclusively for primary actions, active configuration states, and "success" indicators. It represents the "energy" and "innovation" of the modular build.
- **Secondary (Deep Navy):** Retained from the brand legacy, used for container backgrounds and depth layers. It provides a professional, grounded anchor.
- **Tertiary (Action Red):** A refined version of the brand’s red, used sparingly for critical alerts, deletions, or specific "Sale" or "Highlight" badges.
- **Neutral (Obsidian & Crisp White):** The charcoal base (#171717) serves as the "infinite" canvas, while the crisp white (#FAFAFA) is used for high-readability text and primary surfaces.

## Typography

The typography strategy focuses on a technical and rhythmic feel. 

**Space Grotesk** is used for headings and labels to provide a geometric, architectural quality that mimics technical blueprints. Its unique letterforms reinforce the "innovative" personality.

**Manrope** is the workhorse for body copy and configuration details. It offers exceptional legibility at small sizes and a balanced, professional tone that contrasts well with the more expressive headlines.

For numerical data (sq. footage, price, dimensions), use the **mono-tech** style to emphasize precision and engineering.

## Layout & Spacing

The layout philosophy is based on a **strict 12-column modular grid**. This grid isn't just a container; it's a visual representation of the product's modular nature. 

- **The Grid:** A fluid 12-column system with a 24px gutter. Components should snap to these columns to maintain architectural alignment.
- **Rhythm:** An 8px base unit (0.5rem) governs all padding and margins. 
- **Modular Blocks:** Use standardized heights for configuration cards (e.g., 160px, 320px) to ensure that when items are stacked in the UI, they feel like "blocks" being assembled.
- **Margins:** Generous outer margins (48px+) are used to create a premium "gallery" feel for the home renders.

## Elevation & Depth

In this design system, depth is communicated through light and transparency rather than traditional heavy shadows.

- **Glassmorphism:** Primary panels use a `backdrop-filter: blur(20px)` with a semi-transparent white or navy stroke (0.5px, 10% opacity). This creates a "heads-up display" (HUD) effect over 3D model renders.
- **Tonal Layering:** The background is the deepest level. Configuration panels sit one level above, using a slightly lighter charcoal. Floating tooltips and modals sit at the highest level with the most aggressive blur.
- **Glow Accents:** Instead of shadows, active elements may emit a subtle cyan outer glow (`box-shadow: 0 0 15px rgba(0, 229, 255, 0.3)`) to simulate illuminated hardware.

## Shapes

The shape language is "Soft-Technical." We avoid sharp 90-degree angles to keep the interface user-friendly and premium, but we avoid excessive roundness that would feel too "bubbly" or casual.

- **Standard Elements:** 0.5rem (8px) corner radius for buttons and input fields.
- **Large Containers/Cards:** 1rem (16px) corner radius.
- **Contextual Accents:** Use 45-degree chamfered corners (clipped corners) on small technical labels or "Status" indicators to reinforce the engineering aesthetic.

## Components

- **Buttons:** 
  - *Primary:* Solid Electric Cyan with black text. High contrast, sharp readability.
  - *Secondary:* Ghost style with a 1px cyan border and backdrop blur.
- **Configuration Cards:** Use glassmorphic backgrounds. Image at the top, technical specs in `mono-tech` typography at the bottom. State changes (Selected) are indicated by a 2px Cyan border.
- **Inputs:** Dark backgrounds with 1px borders that "illuminate" (change to Cyan) on focus. Labels should always use the uppercase `label-md` style.
- **Chips/Modules:** Small, pill-shaped indicators for home features (e.g., "Eco-Friendly," "2-Story"). Use a dark navy background with white text.
- **Progress Stepper:** A horizontal bar at the top of the screen that looks like a structural beam. As the user completes configuration steps, the "beam" fills with Electric Cyan.
- **3D Viewport Controls:** Floating glassmorphic buttons (Zoom, Rotate, Reset) located in the bottom right of the main configurator view.