import React, { createContext, useContext } from "react";
import {
  useAboutFeatures,
  useContactInfo,
  useCoreValues,
  useHeroContent,
  useLeadershipTeam,
  useLeagueInfo,
  useSportsInfo,
  useTestimonials,
} from "../../lib/dynamicContent";

interface ContentContextType {
  leagueInfo: ReturnType<typeof useLeagueInfo>;
  contactInfo: ReturnType<typeof useContactInfo>;
  coreValues: ReturnType<typeof useCoreValues>;
  leadership: ReturnType<typeof useLeadershipTeam>;
  testimonials: ReturnType<typeof useTestimonials>;
  aboutFeatures: ReturnType<typeof useAboutFeatures>;
  heroContent: ReturnType<typeof useHeroContent>;
  sportsInfo: ReturnType<typeof useSportsInfo>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
};

interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
}) => {
  const leagueInfo = useLeagueInfo();
  const contactInfo = useContactInfo();
  const coreValues = useCoreValues();
  const leadership = useLeadershipTeam();
  const testimonials = useTestimonials();
  const aboutFeatures = useAboutFeatures();
  const heroContent = useHeroContent("home"); // Default to home page
  const sportsInfo = useSportsInfo();

  const contextValue: ContentContextType = {
    leagueInfo,
    contactInfo,
    coreValues,
    leadership,
    testimonials,
    aboutFeatures,
    heroContent,
    sportsInfo,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};
