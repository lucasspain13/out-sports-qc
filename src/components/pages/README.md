# Team Roster Page Components

This directory contains page-level components for team roster functionality in the Out Sports League application.

## Components

### 1. RosterOverview

A full-page component that displays all teams for a specific sport in a responsive grid layout.

**Props:**

- `sportType`: "kickball" | "dodgeball" - The sport to display teams for
- `teams`: Team[] - Array of team objects to display
- `onTeamSelect?`: (team: Team) => void - Callback when a team is selected

**Features:**

- Responsive grid layout (1-4 columns based on screen size)
- Sport-specific header with emoji and stats
- Staggered animations for team cards
- Call-to-action section for league signup
- League statistics display

**Usage:**

```tsx
import { RosterOverview } from "../components/pages";
import { getTeamsBySport } from "../data/teams";

const KickballPage = () => {
  const teams = getTeamsBySport("kickball");

  return (
    <RosterOverview
      sportType="kickball"
      teams={teams}
      onTeamSelect={team => {
        // Navigate to team detail page
        router.push(`/teams/${team.id}`);
      }}
    />
  );
};
```

### 2. TeamDetailPage

A comprehensive team detail page showing team information, stats, and all players.

**Props:**

- `team`: Team - The team object to display
- `onBack?`: () => void - Callback for back navigation
- `onPlayerSelect?`: (player: Player) => void - Callback when a player is selected

**Features:**

- Hero section with team branding and gradient background
- Team statistics and win/loss record
- Team captain highlighting
- Responsive player grid with PlayerCard components
- Back navigation support
- Team motto and description display

**Usage:**

```tsx
import { TeamDetailPage } from "../components/pages";
import { getTeamById } from "../data/teams";

const TeamPage = ({ teamId }) => {
  const team = getTeamById(teamId);

  if (!team) return <div>Team not found</div>;

  return (
    <TeamDetailPage
      team={team}
      onBack={() => router.back()}
      onPlayerSelect={player => {
        console.log("Player selected:", player);
      }}
    />
  );
};
```

### 3. RosterDemo

A demo component that combines RosterOverview and TeamDetailPage with navigation state management.

**Props:**

- `sportType`: "kickball" | "dodgeball" - The sport to display

**Features:**

- State management for view switching
- Seamless navigation between overview and detail views
- Example of how to integrate the page components

**Usage:**

```tsx
import { RosterDemo } from "../components/pages";

const KickballRosterDemo = () => {
  return <RosterDemo sportType="kickball" />;
};
```

## Integration with Routing

These components are designed to work with any routing solution. Here's an example with React Router:

```tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { RosterOverview, TeamDetailPage } from "../components/pages";
import { getTeamsBySport, getTeamById } from "../data/teams";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/teams/:sport" element={<SportRosterRoute />} />
        <Route path="/teams/:sport/:teamId" element={<TeamDetailRoute />} />
      </Routes>
    </Router>
  );
}

function SportRosterRoute() {
  const { sport } = useParams();
  const teams = getTeamsBySport(sport as "kickball" | "dodgeball");

  return (
    <RosterOverview
      sportType={sport as "kickball" | "dodgeball"}
      teams={teams}
      onTeamSelect={team => {
        navigate(`/teams/${sport}/${team.id}`);
      }}
    />
  );
}

function TeamDetailRoute() {
  const { sport, teamId } = useParams();
  const team = getTeamById(teamId);

  return (
    <TeamDetailPage team={team} onBack={() => navigate(`/teams/${sport}`)} />
  );
}
```

## Styling and Theming

All components use the established design system:

- Consistent spacing with `container-custom` and padding classes
- Team color theming through gradient classes
- Responsive design with Tailwind CSS grid system
- Framer Motion animations for smooth interactions
- Card-based layouts following the existing UI patterns

## Data Requirements

Components expect data in the format defined in `src/types/index.ts`:

```typescript
```typescript
interface Team {
  id: string;
  name: string;
  sportType: "kickball" | "dodgeball";
  gradient: "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan";
  description: string;
  players: Player[];
  captain?: string; // Player ID
  founded: number;
  wins: number;
  losses: number;
  motto: string;
}
```

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  quote: string;
  avatar?: string;
  teamId: string;
  sportType: "kickball" | "dodgeball";
}
```

## Examples

See `src/examples/RosterIntegration.tsx` for comprehensive usage examples including:

- Homepage team previews
- Full roster pages
- Custom filtering
- Integration patterns
