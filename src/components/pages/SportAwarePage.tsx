import React from "react";
import { useSportContext } from "../../contexts/SportContext";
import RosterOverview from "./RosterOverview";
import ScheduleOverview from "./ScheduleOverview";
import RegistrationPage from "./RegistrationPage";
import { navigateToGame } from "../../lib/navigation";
import { Team, Game } from "../../types";

interface SportAwarePageProps {
  type: "teams" | "schedule" | "registration";
  onTeamSelect?: (team: Team) => void;
}

export const SportAwarePage: React.FC<SportAwarePageProps> = ({ type, onTeamSelect }) => {
  const { currentSport, currentSeason, currentYear } = useSportContext();

  // Default to kickball if no sport context available
  const sportName = currentSport || "Kickball";
  const season = currentSeason || "Fall";
  const year = currentYear || "2025";
  const seasonDisplay = `${season} ${year}`;
  
  // Convert sport name to lowercase for sportType (database expects lowercase)
  const sportType = sportName.toLowerCase() as "kickball" | "dodgeball";

  switch (type) {
    case "teams":
      return (
        <RosterOverview 
          sportType={sportType} 
          onTeamSelect={onTeamSelect || (() => {})} 
        />
      );

    case "schedule":
      return (
        <ScheduleOverview
          sportType={sportType}
          onGameSelect={(game: Game) => {
            navigateToGame(game.id);
          }}
        />
      );

    case "registration":
      return (
        <RegistrationPage 
          sportType={sportType} 
          season={seasonDisplay} 
        />
      );

    default:
      return <div>Page not found</div>;
  }
};
