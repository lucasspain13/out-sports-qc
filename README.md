# Out Sports League Homepage

A modern React application for the Out Sports League LGBTQ+ sports community, built with React 18, TypeScript, and Tailwind CSS.

## Features

- **Modern React Architecture**: Built with React 18+ functional components and hooks
- **TypeScript**: Full type safety and better developer experience
- **Tailwind CSS**: Custom brand colors and gradients following the design system
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Framer Motion**: Smooth animations and micro-interactions
- **Accessibility**: WCAG 2.1 AA compliant with proper focus states and ARIA labels
- **Component Library**: Reusable UI components following design system specifications

## Design System

The application implements a comprehensive design system with:

- **Brand Colors**: Orange (#FF6B35), Teal (#4ECDC4), Blue (#1A365D), Purple (#9B59B6)
- **Gradients**: Multi-stop linear gradients inspired by the logo design
- **Typography**: Inter and Poppins font families with responsive scaling
- **Components**: Navigation, Hero, Sport Cards, About section with consistent styling
- **Animations**: Purposeful micro-interactions and scroll-based reveals

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Reusable button component
│   │   └── SportCard.tsx       # Sport category cards
│   ├── layout/
│   │   └── Navigation.tsx      # Header navigation
│   └── sections/
│       ├── Hero.tsx            # Hero section with CTAs
│       ├── Sports.tsx          # Sports categories grid
│       └── About.tsx           # About section with features
├── types/
│   └── index.ts                # TypeScript type definitions
├── index.css                   # Global styles and Tailwind imports
├── App.tsx                     # Main application component
└── main.tsx                    # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Content Structure

### Navigation

- Home, General Info, Kickball (with dropdown), Dodgeball
- Responsive mobile menu with hamburger toggle
- Scroll-based background changes

### Hero Section

- Welcome message with gradient background
- Season 2024 badge
- Two CTA buttons: "League Info" (teal) and "Join a Team" (orange)
- Animated scroll indicator

### Sports Section

- Kickball and Dodgeball cards with gradient backgrounds
- Participant counts and next game dates
- Feature tags and hover animations

### About Section

- Community-focused messaging
- Feature grid with icons and descriptions
- Statistics cards with member count and years running
- LGBTQ+ inclusive messaging

## Customization

### Colors

Brand colors are defined in `tailwind.config.js` and can be customized:

```javascript
colors: {
  brand: {
    orange: "#FF6B35",
    teal: "#4ECDC4",
    blue: "#1A365D",
    purple: "#9B59B6"
  }
}
```

### Content

Update the data in `src/App.tsx`:

- `menuItems` - Navigation menu structure
- `sports` - Sport categories and details
- `aboutFeatures` - About section features

### Styling

Global styles are in `src/index.css` with Tailwind utilities and custom component classes.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for images
- Component-level code splitting
- Optimized animations with GPU acceleration
- Responsive images and modern formats

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast focus states
- Reduced motion support

## Deployment

Build the application for production:

```bash
npm run build
```

The `dist` folder contains the optimized production build ready for deployment to any static hosting service.

## License

This project is created for Out Sports League. All rights reserved.
# out-sports-qc
