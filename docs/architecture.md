# AI Club Portal Frontend Architecture

## Overview

The frontend is built with React + Vite and follows a component-based architecture with themed sections for the AI Club.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navigation.jsx
│   ├── sections/
│   │   ├── Home.jsx
│   │   ├── OfficeBearers.jsx
│   │   ├── Faculty.jsx
│   │   └── Activities.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Components

### Navigation Component

- Provides navigation between sections
- Implements hover animations and active state styling
- Responsive design for all screen sizes

### Section Components

Each section component follows the same pattern:

- Implements fade-in animations
- Uses glass-morphism cards
- Includes hover effects and interactive elements
- Responsive grid layouts

## Design System

### Color Palette

- Primary Background: `#0a192f` (Dark blue)
- Accent Color: `#64ffda` (Teal)
- Secondary Colors: Various shades of blue and gray for text and UI elements

### Typography

- Headers: Bold with subtle glow effects
- Body text: Clean and readable
- Responsive sizing

### Animations

- Fade-in effects on page load
- Hover animations on interactive elements
- Floating background elements
- Smooth transitions between states

## State Management

- Centralized state in App.jsx for active section
- Individual component states for animations and interactions
- No external state management library needed

## Styling Approach

- Inline styles for dynamic values
- CSS animations for subtle effects
- Responsive design with media queries
- Glass-morphism effects using backdrop-filter
