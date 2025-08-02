import React from "react";
import { useContentContext } from "../providers/ContentProvider";
import { MenuItem } from "../../types";

interface DynamicNavigationProps {
  currentRoute: string;
  children: (menuItems: MenuItem[]) => React.ReactNode;
}

export const DynamicNavigation: React.FC<DynamicNavigationProps> = ({
  currentRoute,
  children,
}) => {
  const { sportsInfo } = useContentContext();

  // Generate dynamic menu items based on sports data
  const generateMenuItems = (): MenuItem[] => {
    const staticItems: MenuItem[] = [
      { label: "Home", href: "#home", isActive: currentRoute === "#home" },
      {
        label: "General",
        hasDropdown: true,
        isActive: currentRoute === "#info" || currentRoute === "#league-rules" || currentRoute === "#liability" || currentRoute === "#photo",
        dropdownItems: [
          // { label: "About Us", href: "#info" }, // Temporarily disabled
          { label: "League Rules", href: "#league-rules" },
          { label: "Liability Release Waiver", href: "#liability" },
          { label: "Photo Release Waiver", href: "#photo" },
        ],
      },
    ];

    // If no sports data, return static items with default kickball menu
    if (!sportsInfo.data || sportsInfo.data.length === 0) {
      return [
        ...staticItems,
        {
          label: "Kickball",
          hasDropdown: true,
          isActive: currentRoute.includes("kickball") || currentRoute.includes("schedule") || currentRoute.includes("teams") || currentRoute.includes("registration"),
          dropdownItems: [
            { label: "Kickball Rules", href: "#kickball-rules" },
            { label: "Summer 2025 Schedule", href: "#schedule" },
            // { label: "Summer 2025 Teams", href: "#teams" }, // Temporarily hidden
            { label: "Fall 2025 Registration", href: "#registration" },
          ],
        },
      ];
    }

    // Parse sport names and group by sport type
    const sportGroups: Record<string, Array<{ season: string; year: string; sport: string; data: any }>> = {};
    
    sportsInfo.data.forEach(sportData => {
      // Parse name like "Summer 2025 Kickball" to get components
      const nameParts = sportData.name.split(' ');
      if (nameParts.length >= 3) {
        const season = nameParts[0]; // Summer/Fall
        const year = nameParts[1]; // 2025
        const sport = nameParts.slice(2).join(' '); // Kickball
        
        if (!sportGroups[sport]) {
          sportGroups[sport] = [];
        }
        
        sportGroups[sport].push({
          season,
          year,
          sport,
          data: sportData
        });
      }
    });

    // Create menu items for each sport type
    const dynamicSportItems: MenuItem[] = Object.entries(sportGroups).map(([sportName]) => {
      const dropdownItems: MenuItem[] = [];
      
      // Add sport-specific rules only (League Rules moved to General Info)
      dropdownItems.push(
        { label: `${sportName} Rules`, href: `#${sportName.toLowerCase()}-rules` }
      );
      
      // Find active sport (is_active=true, coming_soon=false, name ends with " [SportName]")
      const activeSport = sportsInfo.data.find(sport => 
        sport.isActive && 
        !sport.comingSoon && 
        sport.name.endsWith(` ${sportName}`)
      );
      
      if (activeSport) {
        // Extract season and year from name like "Summer 2025 Kickball"
        const nameWithoutSport = activeSport.name.replace(` ${sportName}`, '');
        const [season, year] = nameWithoutSport.split(' ');
        dropdownItems.push(
          { label: `${nameWithoutSport} Schedule`, href: `#schedule?sport=${encodeURIComponent(sportName)}&season=${season}&year=${year}` }
          // { label: `${nameWithoutSport} Teams`, href: `#teams?sport=${encodeURIComponent(sportName)}&season=${season}&year=${year}` } // Temporarily hidden
        );
      }
      
      // Find coming soon sport (is_active=true, coming_soon=true, name ends with " [SportName]")
      const comingSoonSport = sportsInfo.data.find(sport => 
        sport.isActive && 
        sport.comingSoon && 
        sport.name.endsWith(` ${sportName}`)
      );
      
      if (comingSoonSport) {
        // Extract season and year from name like "Fall 2025 Kickball"
        const nameWithoutSport = comingSoonSport.name.replace(` ${sportName}`, '');
        const [season, year] = nameWithoutSport.split(' ');
        dropdownItems.push(
          { label: `${nameWithoutSport} Registration`, href: `#registration?sport=${encodeURIComponent(sportName)}&season=${season}&year=${year}` }
        );
      }

      return {
        label: sportName,
        hasDropdown: true,
        isActive: currentRoute.includes(sportName.toLowerCase()) || 
                 currentRoute.includes("schedule") || 
                 currentRoute.includes("teams") || 
                 currentRoute.includes("registration"),
        dropdownItems,
      };
    });

    return [...staticItems, ...dynamicSportItems];
  };

  const menuItems = generateMenuItems();

  return <>{children(menuItems)}</>;
};
