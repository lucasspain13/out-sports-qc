import React from "react";
import {
  useContactInfo,
  useCoreValues,
  useFAQs,
  useLeadershipTeam,
  useLeagueInfo,
  useTestimonials,
  useTimelineMilestones,
} from "../../lib/dynamicContent";
import { navigateTo } from "../../lib/navigation";
import {
  CommunityTestimonials,
  ContactInfo,
  CoreValues,
  FoundationStory,
  LeadershipTeam,
  MissionHero,
} from "../sections";
import FAQ from "../ui/FAQ";
import { ContentSection } from "../ui/LoadingState";

interface GeneralInfoPageProps {
  className?: string;
}

const GeneralInfoPage: React.FC<GeneralInfoPageProps> = ({
  className = "",
}) => {
  // Load all dynamic content
  const leagueInfo = useLeagueInfo();
  const coreValues = useCoreValues();
  const leadership = useLeadershipTeam();
  const testimonials = useTestimonials();
  const timeline = useTimelineMilestones();
  const contactInfo = useContactInfo();
  const faqs = useFAQs();

  const handleJoinClick = () => {
    navigateTo("#registration");
  };

  // Transform data to match component expectations
  const getTransformedLeagueInfo = () => {
    if (!leagueInfo.data || !coreValues.data || !contactInfo.data) return null;

    return {
      ...leagueInfo.data,
      values: coreValues.data,
      contact: contactInfo.data,
    };
  };

  const getTransformedLeadership = () => {
    if (!leadership.data) return [];

    return leadership.data.map(member => ({
      ...member,
      favoriteQuote: member.favoriteQuote || "",
    }));
  };

  const getTransformedTestimonials = () => {
    if (!testimonials.data) return [];

    return testimonials.data.map(testimonial => ({
      ...testimonial,
      sportType:
        (testimonial.sportType as "kickball" | "dodgeball" | undefined) ||
        undefined,
      memberSince: testimonial.memberSince || new Date().getFullYear(),
    }));
  };

  const getTransformedTimeline = () => {
    if (!timeline.data) return null;

    return {
      milestones: timeline.data.map(milestone => ({
        ...milestone,
        month: milestone.month || "January",
        type:
          (milestone.type as
            | "founding"
            | "expansion"
            | "achievement"
            | "community"
            | "facility") || "achievement",
      })),
    };
  };

  const getTransformedFAQs = () => {
    if (!faqs.data) return [];

    return faqs.data.map(faq => ({
      ...faq,
      category:
        (faq.category as
          | "general"
          | "registration"
          | "rules"
          | "costs"
          | "events"
          | "safety") || "general",
    }));
  };

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Mission Hero Section */}
      <ContentSection
        loading={
          leagueInfo.loading || coreValues.loading || contactInfo.loading
        }
        error={leagueInfo.error || coreValues.error || contactInfo.error}
      >
        {(() => {
          const transformedLeagueInfo = getTransformedLeagueInfo();
          return (
            transformedLeagueInfo && (
              <MissionHero
                leagueInfo={transformedLeagueInfo}
                onJoinClick={handleJoinClick}
                showLearnMore={false}
              />
            )
          );
        })()}
      </ContentSection>

      {/* Foundation Story Section */}
      <ContentSection loading={timeline.loading} error={timeline.error}>
        {(() => {
          const transformedTimeline = getTransformedTimeline();
          return (
            transformedTimeline && (
              <FoundationStory timeline={transformedTimeline} />
            )
          );
        })()}
      </ContentSection>

      {/* Core Values Section */}
      <ContentSection loading={coreValues.loading} error={coreValues.error}>
        {coreValues.data && <CoreValues values={coreValues.data} />}
      </ContentSection>

      {/* Leadership Team Section */}
      <ContentSection loading={leadership.loading} error={leadership.error}>
        {(() => {
          const transformedLeadership = getTransformedLeadership();
          return (
            transformedLeadership.length > 0 && (
              <LeadershipTeam leadership={transformedLeadership} />
            )
          );
        })()}
      </ContentSection>

      {/* Community Testimonials Section */}
      <ContentSection loading={testimonials.loading} error={testimonials.error}>
        {(() => {
          const transformedTestimonials = getTransformedTestimonials();
          return (
            transformedTestimonials.length > 0 && (
              <CommunityTestimonials testimonials={transformedTestimonials} />
            )
          );
        })()}
      </ContentSection>

      {/* FAQ Section */}
      <ContentSection loading={faqs.loading} error={faqs.error}>
        {(() => {
          const transformedFAQs = getTransformedFAQs();
          return transformedFAQs.length > 0 && <FAQ faqs={transformedFAQs} />;
        })()}
      </ContentSection>

      {/* Contact Info Section */}
      <ContentSection loading={contactInfo.loading} error={contactInfo.error}>
        {contactInfo.data && <ContactInfo contact={contactInfo.data} />}
      </ContentSection>
    </div>
  );
};

export default GeneralInfoPage;
