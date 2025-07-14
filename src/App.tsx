import { useEffect, useState } from "react";
import Navigation from "./components/layout/Navigation";
import {
  GameDetail,
  GeneralInfoPage,
  RosterOverview,
  ScheduleOverview,
  TeamDetailPage,
} from "./components/pages";
import { About, Hero, Sports } from "./components/sections";
import { getGameById } from "./data/schedules";
import { getTeamById, getTeamsBySport } from "./data/teams";
import { Feature, MenuItem, SportInfo, Team } from "./types";

function App() {
  // State for routing
  const [currentRoute, setCurrentRoute] = useState<string>("#home");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Handle hash changes for routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#home";
      setCurrentRoute(hash);

      // Handle team detail routes
      const teamDetailMatch = hash.match(/^#(kickball|dodgeball)-teams\/(.+)$/);
      if (teamDetailMatch) {
        const [, sportType, teamId] = teamDetailMatch;
        const team = getTeamById(teamId);
        if (team && team.sportType === sportType) {
          setSelectedTeam(team);
        }
      } else {
        setSelectedTeam(null);
      }

      // Handle game detail routes
      const gameDetailMatch = hash.match(/^#game\/(.+)$/);
      if (gameDetailMatch) {
        // Store the full hash in currentRoute for game detail handling
        setCurrentRoute(hash);
      }
    };

    // Set initial route
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Navigation menu items
  const menuItems: MenuItem[] = [
    { label: "Home", href: "#home", isActive: currentRoute === "#home" },
    {
      label: "General Info",
      href: "#info",
      isActive: currentRoute === "#info",
    },
    {
      label: "Kickball",
      href: "#kickball",
      hasDropdown: true,
      isActive: currentRoute.startsWith("#kickball"),
      dropdownItems: [
        { label: "League Rules", href: "#kickball-rules" },
        { label: "Schedule", href: "#kickball-schedule" },
        { label: "Teams", href: "#kickball-teams" },
        { label: "Registration", href: "#kickball-registration" },
      ],
    },
    {
      label: "Dodgeball",
      href: "#dodgeball",
      hasDropdown: true,
      isActive: currentRoute.startsWith("#dodgeball"),
      dropdownItems: [
        { label: "League Rules", href: "#dodgeball-rules" },
        { label: "Schedule", href: "#dodgeball-schedule" },
        { label: "Teams", href: "#dodgeball-teams" },
        { label: "Registration", href: "#dodgeball-registration" },
      ],
    },
  ];

  // Sports data with navigation handlers
  const sports: SportInfo[] = [
    {
      name: "Kickball",
      description:
        "Classic playground fun with a competitive twist. Join our co-ed leagues for an exciting season of kicks, runs, and community spirit.",
      gradient: "orange",
      participants: 120,
      nextGame: new Date("2024-03-15"),
      features: ["Co-ed Teams", "All Skill Levels", "Weekly Games"],
      totalTeams: 4,
      rosterPath: "#kickball-teams",
    },
    {
      name: "Dodgeball",
      description:
        "Fast-paced action and strategic gameplay. Experience the thrill of dodgeball in a supportive and inclusive environment.",
      gradient: "teal",
      participants: 85,
      nextGame: new Date("2024-03-18"),
      features: ["Team Strategy", "High Energy", "Quick Matches"],
      totalTeams: 4,
      rosterPath: "#dodgeball-teams",
    },
  ];

  // About section features
  const aboutFeatures: Feature[] = [
    {
      icon: "🏳️‍🌈",
      title: "LGBTQ+ Inclusive",
      description:
        "A safe and welcoming space for all members of the LGBTQ+ community and allies.",
    },
    {
      icon: "🤝",
      title: "Community Focused",
      description:
        "Building lasting friendships and connections through shared love of sports and competition.",
    },
    {
      icon: "🏆",
      title: "All Skill Levels",
      description:
        "From beginners to seasoned athletes, everyone is welcome to join and improve their game.",
    },
    {
      icon: "🎉",
      title: "Social Events",
      description:
        "Regular social gatherings, tournaments, and celebrations to strengthen our community bonds.",
    },
  ];

  // Handle sport card clicks
  const handleSportClick = (sport: SportInfo) => {
    if (sport.rosterPath) {
      window.location.hash = sport.rosterPath;
    }
  };

  // Handle team selection
  const handleTeamSelect = (team: Team) => {
    window.location.hash = `#${team.sportType}-teams/${team.id}`;
  };

  // Handle back navigation from team detail
  const handleBackToRoster = () => {
    if (selectedTeam) {
      window.location.hash = `#${selectedTeam.sportType}-teams`;
    }
  };

  // Render content based on current route
  const renderContent = () => {
    // Team detail page
    if (selectedTeam) {
      return (
        <TeamDetailPage
          team={selectedTeam}
          onBack={handleBackToRoster}
          onPlayerSelect={player => {
            console.log("Player selected:", player);
          }}
        />
      );
    }

    // Game detail page
    const gameDetailMatch = currentRoute.match(/^#game\/(.+)$/);
    if (gameDetailMatch) {
      const [, gameId] = gameDetailMatch;
      const game = getGameById(gameId);

      if (!game) {
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Game Not Found
              </h1>
              <p className="text-gray-600">Game ID: {gameId}</p>
              <p className="text-sm text-gray-500 mt-4">
                The requested game could not be found.
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        );
      }

      return (
        <GameDetail
          game={game}
          onBack={() => window.history.back()}
          onTeamSelect={teamId => {
            const team = getTeamById(teamId);
            if (team) {
              window.location.hash = `#${team.sportType}-teams/${team.id}`;
            }
          }}
        />
      );
    }

    // Roster overview pages
    if (currentRoute === "#kickball-teams") {
      const kickballTeams = getTeamsBySport("kickball");
      return (
        <RosterOverview
          sportType="kickball"
          teams={kickballTeams}
          onTeamSelect={handleTeamSelect}
        />
      );
    }

    if (currentRoute === "#dodgeball-teams") {
      const dodgeballTeams = getTeamsBySport("dodgeball");
      return (
        <RosterOverview
          sportType="dodgeball"
          teams={dodgeballTeams}
          onTeamSelect={handleTeamSelect}
        />
      );
    }

    // Schedule pages
    if (currentRoute === "#kickball-schedule") {
      return (
        <ScheduleOverview
          sportType="kickball"
          onGameSelect={game => {
            window.location.hash = `#game/${game.id}`;
          }}
        />
      );
    }

    if (currentRoute === "#dodgeball-schedule") {
      return (
        <ScheduleOverview
          sportType="dodgeball"
          onGameSelect={game => {
            window.location.hash = `#game/${game.id}`;
          }}
        />
      );
    }

    // General Info page
    if (currentRoute === "#info") {
      return <GeneralInfoPage />;
    }

    // Default home page content
    return (
      <>
        {/* Hero Section */}
        <Hero
          title="Welcome to Out Sports League"
          subtitle="Join our inclusive LGBTQ+ sports community where everyone belongs. Experience the joy of competition, friendship, and athletic achievement in a welcoming environment."
          primaryCTA={{
            text: "League Info",
            variant: "primary",
            href: "#info",
          }}
          secondaryCTA={{
            text: "Join a Team",
            variant: "secondary",
            href: "#signup",
          }}
        />

        {/* Sports Section */}
        <Sports
          sports={sports.map(sport => ({
            ...sport,
            onClick: () => handleSportClick(sport),
          }))}
        />

        {/* About Section */}
        <About
          title="Building Community Through Sports"
          content="Out Sports League has been fostering an inclusive environment for LGBTQ+ athletes and allies since 2020. We believe that sports have the power to bring people together, build confidence, and create lasting friendships. Our leagues provide a safe space where you can be yourself while enjoying competitive and recreational athletics."
          features={aboutFeatures}
        />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="heading-5 mb-4 text-gradient-brand">
                  Out Sports League
                </h3>
                <p className="body-base text-gray-300">
                  Building an inclusive sports community where everyone can
                  play, compete, and belong.
                </p>
              </div>
              <div>
                <h4 className="heading-6 mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#info"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      League Info
                    </a>
                  </li>
                  <li>
                    <a
                      href="#kickball-teams"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Kickball Teams
                    </a>
                  </li>
                  <li>
                    <a
                      href="#dodgeball-teams"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Dodgeball Teams
                    </a>
                  </li>
                  <li>
                    <a
                      href="#signup"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Join a Team
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="heading-6 mb-4">Contact</h4>
                <p className="body-base text-gray-300 mb-2">
                  Email: info@outsportsleague.com
                </p>
                <p className="body-base text-gray-300">
                  Follow us on social media for updates and community
                  highlights.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="body-base text-gray-400">
                © 2024 Out Sports League. All rights reserved. Season 2024 now
                open for registration.
              </p>
            </div>
          </div>
        </footer>
      </>
    );
  };

  return (
    <div className="App">
      {/* Navigation */}
      <Navigation logo="/logo.png" menuItems={menuItems} />

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
}

export default App;
