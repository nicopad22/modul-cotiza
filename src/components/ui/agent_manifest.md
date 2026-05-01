# Agent Manifest: UI Components (`src/components/ui`)

## Purpose
This directory contains generic, reusable, and stateless UI components for the Modul web configurator. These components are designed to strictly adhere to the brand guidelines specified in `design.md` (e.g., Glassmorphic-Minimalist hybrid, specific typography like Space Grotesk and Manrope).

## Guidelines for AI Agents
- **No Business Logic:** Components here should rely entirely on passed props for data and callbacks for actions. They should not directly fetch data from APIs or import global application state.
- **Styling:** Adhere to the established CSS-in-JS style patterns (or Tailwind if configured). Maintain the technical, clean aesthetic defined for the project.
- **Extensibility:** When creating new components, ensure they support standard HTML attributes like `style`, `className`, and event handlers where appropriate.
