import React from "react";
import { navigateTo } from "../../lib/navigation";
import { Feature, SportInfo } from "../../types";
import { kickballSchedule } from "../../data/schedules";
import { useContentContext } from "../providers/ContentProvider";
import { About, Hero, Sports } from "../sections";
import { ContentSection } from "../ui/LoadingState";

// Debug utility - remove in production
if (import.meta.env.DEV) {
  import("../../utils/debugSports");
}

interface DynamicAppContentProps {
  currentRoute: string;
  renderContent: () => React.ReactNode;
}

export const DynamicAppContent: React.FC<DynamicAppContentProps> = ({
  currentRoute,
  renderContent,
}) => {
  const { leagueInfo, contactInfo, aboutFeatures, sportsInfo, heroContent } =
    useContentContext();

  // Handle sport card clicks
  const handleSportClick = (sport: SportInfo) => {
    console.log('🎯 Sport clicked:', sport.name, 'comingSoon:', sport.comingSoon, 'rosterPath:', sport.rosterPath);
    if (sport.rosterPath) {
      console.log('🚀 Navigating to:', sport.rosterPath);
      navigateTo(sport.rosterPath);
    } else {
      console.log('❌ No rosterPath found for sport:', sport.name);
    }
  };

  // Convert database sports info to display format
  const getDisplaySports = (): SportInfo[] => {
    // If no database data, use fallback sports data
    if (!sportsInfo.data || sportsInfo.data.length === 0) {
      // Get the next upcoming kickball game - direct approach
      const currentDate = new Date();
      let nextKickballGame: Date | undefined;
      
      // Find the next scheduled game directly from the kickball schedule
      for (const week of kickballSchedule.weeks) {
        for (const game of week.games) {
          if (game.status === "scheduled" && game.date > currentDate) {
            if (!nextKickballGame || game.date < nextKickballGame) {
              nextKickballGame = game.date;
            }
          }
        }
      }
      
      // Fallback if no scheduled game found
      if (!nextKickballGame) {
        nextKickballGame = new Date(2025, 7, 3); // August 3, 2025
      }
      
      // Debug logging in development  
      if (import.meta.env.DEV) {
        console.log('📊 Current date:', currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric',
          weekday: 'short'
        }));
        console.log('📊 Kickball schedule weeks:', kickballSchedule.weeks.length);
        
        // Show all kickball games with detailed info
        const allKickballGames: any[] = [];
        kickballSchedule.weeks.forEach(week => {
          week.games.forEach(game => {
            const isAfterToday = game.date > currentDate;
            const isOnOrAfterToday = game.date >= currentDate;
            allKickballGames.push({
              id: game.id,
              date: game.date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                weekday: 'short'
              }),
              status: game.status,
              homeTeam: game.homeTeam.name,
              awayTeam: game.awayTeam.name,
              week: game.week,
              isAfterToday,
              isOnOrAfterToday,
              daysDiff: Math.round((game.date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
            });
          });
        });
        console.log('🎮 All kickball games:', allKickballGames);
        
        // Show only scheduled games that are in the future
        const futureScheduledGames = allKickballGames.filter(g => 
          g.status === "scheduled" && g.isAfterToday
        );
        console.log('📅 Future scheduled games:', futureScheduledGames);
        
        console.log('🎯 Next game found:', nextKickballGame.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric',
          weekday: 'short'
        }));
      }

      return [
        {
          name: "kickball",
          title: "Kickball",
          description:
            "A fun, accessible sport that combines the best of baseball and soccer. Teams alternate between kicking and fielding in this inclusive, beginner-friendly game perfect for building community connections.",
          gradient: "orange" as const,
          participants: 62,
          nextGame: nextKickballGame,
          features: [
            "All skill levels welcome",
            "Equipment provided",
            "Weekend games",
          ],
          totalTeams: 4,
          rosterPath: "#summer-kickball-schedule",
          comingSoon: false,
        },
        {
          name: "dodgeball",
          title: "Dodgeball",
          description:
            "Fast-paced indoor fun that emphasizes strategy, teamwork, and quick reflexes. Our modified rules ensure everyone gets to play and have a great time regardless of athletic background.",
          gradient: "green" as const,
          participants: 140,
          features: [
            "Beginner to advanced",
            "Indoor play",
            "All equipment provided",
          ],
          totalTeams: 4,
          rosterPath: "#dodgeball-teams",
          comingSoon: true,
        },
      ];
    }

    return sportsInfo.data.map(sport => ({
      name: sport.name,
      title: sport.title,
      description: sport.description,
      gradient: sport.gradient as "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan",
      participants: sport.participants || 0,
      nextGame: sport.nextGame ? (() => {
        try {
          // Handle different date formats properly
          const dateStr = sport.nextGame.toString();
          let date: Date;
          
          if (dateStr.includes('T')) {
            // Already has time component (ISO string)
            date = new Date(dateStr);
          } else {
            // Date only (YYYY-MM-DD format) - parse as local date
            const [year, month, day] = dateStr.split('-').map(Number);
            date = new Date(year, month - 1, day); // month is 0-indexed
          }
          
          // Validate the date
          return isNaN(date.getTime()) ? undefined : date;
        } catch (error) {
          console.warn('Invalid date format for nextGame:', sport.nextGame);
          return undefined;
        }
      })() : undefined,
      features: sport.features || [],
      totalTeams: sport.totalTeams || 0,
      rosterPath: sport.rosterPath || undefined,
      comingSoon: sport.comingSoon || false,
    }));
  };

  // Convert database about features to display format
  const getDisplayFeatures = (): Feature[] => {
    if (!aboutFeatures.data) return [];

    return aboutFeatures.data.map(feature => ({
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
    }));
  };

  if (currentRoute === "#home") {
    return (
      <>
        {/* Hero Section */}
        <ContentSection
          loading={leagueInfo.loading || heroContent.loading}
          error={leagueInfo.error || heroContent.error}
          minHeight="60vh"
        >
          {leagueInfo.data && (
            <Hero
              title={heroContent.data?.title || "Welcome to Out Sports League"}
              subtitle={
                heroContent.data?.subtitle ||
                "Building an inclusive sports community where everyone can play, compete, and belong."
              }
              primaryCTA={{
                text: heroContent.data?.primaryCtaText || "Join the League",
                variant: "primary",
                href: "#registration",
              }}
              secondaryCTA={{
                text: heroContent.data?.secondaryCtaText || "Learn More",
                variant: "secondary",
                href: "#info",
              }}
              backgroundImage={heroContent.data?.backgroundImageUrl}
            />
          )}
        </ContentSection>

        {/* Sports Section */}
        <ContentSection loading={sportsInfo.loading} error={sportsInfo.error}>
          <Sports
            sports={getDisplaySports().map(sport => ({
              ...sport,
              onClick: () => handleSportClick(sport),
            }))}
          />
        </ContentSection>

        {/* About Section */}
        <ContentSection
          loading={leagueInfo.loading || aboutFeatures.loading}
          error={leagueInfo.error || aboutFeatures.error}
        >
          {leagueInfo.data && (
            <About
              title="Building Community Through Sports"
              content={leagueInfo.data.mission}
              features={getDisplayFeatures()}
            />
          )}
        </ContentSection>

        {/* Footer */}
        <ContentSection
          loading={leagueInfo.loading || contactInfo.loading}
          error={leagueInfo.error || contactInfo.error}
        >
          {leagueInfo.data && contactInfo.data && (
            <footer className="bg-gray-900 text-white py-12">
              <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="heading-5 mb-4 text-gradient-brand">
                      Out Sports League
                    </h3>
                    <p className="body-base text-gray-300">
                      {leagueInfo.data.mission}
                    </p>
                  </div>
                  <div>
                    <h4 className="heading-6 mb-4">Contact Info</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>{contactInfo.data.email}</li>
                      <li>{contactInfo.data.phone}</li>
                      <li>
                        {contactInfo.data.address.street},{" "}
                        {contactInfo.data.address.city},{" "}
                        {contactInfo.data.address.state}{" "}
                        {contactInfo.data.address.zipCode}
                      </li>
                    </ul>
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
                          href="#summer-kickball-teams"
                          className="text-gray-300 hover:text-white transition-colors"
                        >
                          Kickball Teams
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                  <p>© 2024 Out Sports League. All rights reserved.</p>
                </div>
              </div>
            </footer>
          )}
        </ContentSection>
      </>
    );
  }

  // For all other routes, use the existing renderContent function
  return <>{renderContent()}</>;
};
