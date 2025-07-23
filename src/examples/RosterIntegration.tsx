import React from "react";
import { RosterDemo } from "../components/pages";
import { TeamRoster } from "../components/sections";
import { useTeams } from "../hooks/useTeams";

/**
 * Example integration showing how to use the roster components
 * This demonstrates different ways to display teams and handle navigation
 */

// Example 1: Using TeamRoster section component for homepage preview
export const HomepageTeamPreview: React.FC = () => {
  const { teams: kickballTeams, loading } = useTeams("kickball");

  const handleTeamSelect = (team: any) => {
    console.log("Navigate to team detail:", team.name);
    // In a real app, this would use React Router or similar
    // router.push(`/teams/${team.sportType}/${team.id}`);
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Show preview of kickball teams */}
      <TeamRoster
        title="Featured Kickball Teams"
        subtitle="Check out some of our amazing kickball teams!"
        teams={kickballTeams}
        sportType="kickball"
        onTeamSelect={handleTeamSelect}
        maxTeams={2}
        showStats={true}
      />

      {/* Show preview of dodgeball teams */}
      <DodgeballTeamPreview onTeamSelect={handleTeamSelect} />
    </div>
  );
};

// Helper component for dodgeball preview
const DodgeballTeamPreview: React.FC<{ onTeamSelect: (team: any) => void }> = ({
  onTeamSelect,
}) => {
  const { teams: dodgeballTeams, loading } = useTeams("dodgeball");

  if (loading) {
    return (
      <div className="py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading dodgeball teams...</p>
        </div>
      </div>
    );
  }

  return (
    <TeamRoster
      title="Featured Dodgeball Teams"
      subtitle="Meet our competitive dodgeball squads!"
      teams={dodgeballTeams}
      sportType="dodgeball"
      onTeamSelect={onTeamSelect}
      maxTeams={2}
      showStats={true}
      className="bg-white"
    />
  );
};

// Example 2: Full roster page with navigation
export const KickballRosterPage: React.FC = () => {
  return <RosterDemo sportType="kickball" />;
};

export const DodgeballRosterPage: React.FC = () => {
  return <RosterDemo sportType="dodgeball" />;
};

// Example 3: Custom team roster with filtering
export const CustomTeamRoster: React.FC = () => {
  const { teams: kickballTeams, loading: loadingKickball } =
    useTeams("kickball");
  const { teams: dodgeballTeams, loading: loadingDodgeball } =
    useTeams("dodgeball");

  const allTeams = [...kickballTeams, ...dodgeballTeams];
  const loading = loadingKickball || loadingDodgeball;

  const handleTeamSelect = (team: any) => {
    console.log("Selected team:", team);
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading all teams...</p>
        </div>
      </div>
    );
  }

  return (
    <TeamRoster
      title="All League Teams"
      subtitle="Explore all teams across both sports in our league!"
      teams={allTeams}
      onTeamSelect={handleTeamSelect}
      showStats={true}
    />
  );
};

// Example 4: Integration with React Router (pseudo-code)
/*
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

export const AppWithRouting: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomepageTeamPreview />} />
        <Route path="/teams/kickball" element={<KickballRosterPage />} />
        <Route path="/teams/dodgeball" element={<DodgeballRosterPage />} />
        <Route path="/teams/:sport/:teamId" element={<TeamDetailRoute />} />
      </Routes>
    </Router>
  );
};

const TeamDetailRoute: React.FC = () => {
  const { sport, teamId } = useParams();
  const navigate = useNavigate();
  
  const teams = sport === 'kickball' ? kickballTeams : dodgeballTeams;
  const team = teams.find(t => t.id === teamId);
  
  if (!team) {
    return <div>Team not found</div>;
  }
  
  return (
    <TeamDetailPage
      team={team}
      onBack={() => navigate(`/teams/${sport}`)}
      onPlayerSelect={(player) => {
        console.log('Player selected:', player);
        // Could navigate to player detail page
      }}
    />
  );
};
*/

export default {
  HomepageTeamPreview,
  KickballRosterPage,
  DodgeballRosterPage,
  CustomTeamRoster,
};
