import React, { useState } from "react";
import { Player, Team } from "../../types";
import RosterOverview from "./RosterOverview";
import TeamDetailPage from "./TeamDetailPage";

type ViewMode = "overview" | "detail";

interface RosterDemoProps {
  sportType: "kickball" | "dodgeball";
}

const RosterDemo: React.FC<RosterDemoProps> = ({ sportType }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("overview");
    setSelectedTeam(null);
  };

  const handlePlayerSelect = (player: Player) => {
    console.log("Player selected:", player);
    // This could navigate to a player detail page or show a modal
  };

  if (viewMode === "detail" && selectedTeam) {
    return (
      <TeamDetailPage
        team={selectedTeam}
        onBack={handleBack}
        onPlayerSelect={handlePlayerSelect}
      />
    );
  }

  return (
    <RosterOverview sportType={sportType} onTeamSelect={handleTeamSelect} />
  );
};

export default RosterDemo;
