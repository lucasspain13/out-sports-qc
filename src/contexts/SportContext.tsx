import React, { createContext, useContext, useState, useEffect } from 'react';
import { useContentContext } from '../components/providers/ContentProvider';

interface SportContext {
  currentSport: string | null; // e.g., "Kickball"
  currentSeason: string | null; // e.g., "Summer"
  currentYear: string | null; // e.g., "2025"
  currentRoute: string;
  sportData: any | null; // The full sport data object
}

const SportContextProvider = createContext<SportContext>({
  currentSport: null,
  currentSeason: null,
  currentYear: null,
  currentRoute: '',
  sportData: null,
});

export const useSportContext = () => useContext(SportContextProvider);

interface SportProviderProps {
  children: React.ReactNode;
  currentRoute: string;
}

export const SportProvider: React.FC<SportProviderProps> = ({ children, currentRoute }) => {
  const { sportsInfo } = useContentContext();
  const [sportContext, setSportContext] = useState<SportContext>({
    currentSport: null,
    currentSeason: null,
    currentYear: null,
    currentRoute,
    sportData: null,
  });

  useEffect(() => {
    // Determine current sport context based on route and available sports data
    let currentSport: string | null = null;
    let currentSeason: string | null = null;
    let currentYear: string | null = null;
    let sportData: any | null = null;

    // Parse URL parameters for sport, season, and year
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const sportParam = urlParams.get('sport');
    const seasonParam = urlParams.get('season');
    const yearParam = urlParams.get('year');

    // If we're on schedule, teams, or registration routes, find the appropriate sport
    if (currentRoute === '#schedule' || currentRoute === '#teams' || currentRoute === '#registration') {
      if (sportsInfo.data && sportsInfo.data.length > 0) {
        
        // If URL has specific sport/season/year parameters, validate them
        if (sportParam && seasonParam && yearParam) {
          // Find the matching sport data
          const targetName = `${seasonParam} ${yearParam} ${sportParam}`;
          const foundSport = sportsInfo.data.find(sport => sport.name === targetName);
          
          if (foundSport) {
            // Valid parameters - use them
            currentSport = sportParam;
            currentSeason = seasonParam;
            currentYear = yearParam;
            sportData = foundSport;
          } else {
            // Invalid parameters - redirect to homepage
            console.warn(`Invalid sport parameters: "${targetName}" not found. Available sports:`, 
              sportsInfo.data.map(s => s.name).join(', '));
            setTimeout(() => {
              window.location.hash = '#home';
            }, 0);
            return;
          }
        } else {
          // Fallback to finding appropriate sport based on route type
          if (currentRoute === '#schedule' || currentRoute === '#teams') {
            // For schedule/teams, find active sports
            const activeSport = sportsInfo.data.find(sport => sport.isActive && !sport.comingSoon);
            if (activeSport) {
              const nameParts = activeSport.name.split(' ');
              if (nameParts.length >= 3) {
                currentSeason = nameParts[0];
                currentYear = nameParts[1];
                currentSport = nameParts.slice(2).join(' ');
                sportData = activeSport;
              }
            }
          } else if (currentRoute === '#registration') {
            // For registration, find coming soon sports
            const comingSoonSport = sportsInfo.data.find(sport => sport.comingSoon && sport.isActive);
            if (comingSoonSport) {
              const nameParts = comingSoonSport.name.split(' ');
              if (nameParts.length >= 3) {
                currentSeason = nameParts[0];
                currentYear = nameParts[1];
                currentSport = nameParts.slice(2).join(' ');
                sportData = comingSoonSport;
              }
            }
          }
        }
      } else {
        // Fallback for when no database data is available
        if (currentRoute === '#schedule' || currentRoute === '#teams') {
          currentSport = 'Kickball';
          currentSeason = 'Summer';
          currentYear = '2025';
        } else if (currentRoute === '#registration') {
          currentSport = 'Kickball';
          currentSeason = 'Fall';
          currentYear = '2025';
        }
      }
    }

    setSportContext({
      currentSport,
      currentSeason,
      currentYear,
      currentRoute,
      sportData,
    });
  }, [currentRoute, sportsInfo.data]);

  return (
    <SportContextProvider.Provider value={sportContext}>
      {children}
    </SportContextProvider.Provider>
  );
};
