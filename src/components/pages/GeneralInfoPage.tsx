import React from "react";
import {
  contactInfo,
  coreValues,
  faqs,
  leadership,
  leagueInfo,
  testimonials,
  timeline,
} from "../../data/leagueInfo";
import {
  CommunityTestimonials,
  ContactInfo,
  CoreValues,
  FoundationStory,
  LeadershipTeam,
  MissionHero,
} from "../sections";
import FAQ from "../ui/FAQ";

interface GeneralInfoPageProps {
  className?: string;
}

const GeneralInfoPage: React.FC<GeneralInfoPageProps> = ({
  className = "",
}) => {
  const handleJoinClick = () => {
    // Navigate to registration or contact
    window.location.hash = "#signup";
  };

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Mission Hero Section */}
      <MissionHero leagueInfo={leagueInfo} onJoinClick={handleJoinClick} />

      {/* Foundation Story Section */}
      <FoundationStory timeline={timeline} />

      {/* Core Values Section */}
      <CoreValues values={coreValues} />

      {/* Leadership Team Section */}
      <LeadershipTeam leadership={leadership} />

      {/* Community Testimonials Section */}
      <CommunityTestimonials testimonials={testimonials} />

      {/* FAQ Section */}
      <FAQ faqs={faqs} />

      {/* Contact Info Section */}
      <ContactInfo contact={contactInfo} />
    </div>
  );
};

export default GeneralInfoPage;
