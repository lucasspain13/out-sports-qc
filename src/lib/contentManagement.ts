// Content Management API Layer
import type { Database } from "./supabase";
import { supabase } from "./supabase";

// Supabase connection test
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");

    // Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log("Supabase URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
    console.log("Supabase Anon Key:", supabaseAnonKey ? "✓ Set" : "✗ Missing");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return false;
    }

    // Test basic connection
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    console.log("Auth session:", session?.user?.email || "No user logged in");
    if (authError) console.error("Auth error:", authError);

    // Test database connection with a simple query
    const { error } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1);
    if (error) {
      console.error("Database connection error:", error);
      return false;
    }

    console.log("Supabase connection successful");
    return true;
  } catch (err) {
    console.error("Supabase connection test failed:", err);
    return false;
  }
};

// Type aliases for content management tables
type DbLeagueInfo = Database["public"]["Tables"]["league_info"]["Row"];
type DbContactInfo = Database["public"]["Tables"]["contact_info"]["Row"];
type DbCoreValue = Database["public"]["Tables"]["core_values"]["Row"];
type DbLeadership = Database["public"]["Tables"]["leadership_team"]["Row"];
type DbTestimonial = Database["public"]["Tables"]["testimonials"]["Row"];
type DbFAQ = Database["public"]["Tables"]["faqs"]["Row"];
type DbTimeline = Database["public"]["Tables"]["timeline_milestones"]["Row"];
type DbSportsInfo = Database["public"]["Tables"]["sports_info"]["Row"];
type DbAboutFeature = Database["public"]["Tables"]["about_features"]["Row"];
type DbHeroContent = Database["public"]["Tables"]["hero_content"]["Row"];
type DbSiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];

// Application types (matching existing interfaces)
export interface LeagueInfo {
  id: string;
  mission: string;
  history: string;
  foundedYear: number;
  memberCount: number;
  seasonsCompleted: number;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
  };
  officeHours: {
    weekdays: string;
    weekends: string;
  };
}

export interface CoreValue {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  email?: string;
  joinedYear: number;
  avatar?: string;
  specialties: string[];
  favoriteQuote?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  memberName: string;
  role: string;
  quote: string;
  avatar?: string;
  teamName?: string;
  sportType?: string;
  memberSince?: number;
  location: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  priority: number;
  isActive: boolean;
}

export interface TimelineMilestone {
  id: string;
  year: number;
  month?: string;
  title: string;
  description: string;
  type: string;
  isActive: boolean;
}

export interface SportsInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  gradient: string;
  participants: number;
  nextGame?: Date;
  features: string[];
  totalTeams: number;
  rosterPath?: string;
  comingSoon: boolean;
  isActive: boolean;
  season: string;
  year: number;
  createdAt: string;
}

export interface AboutFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface HeroContent {
  id: string;
  page: string;
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaAction?: string;
  secondaryCtaText?: string;
  secondaryCtaAction?: string;
  backgroundImageUrl?: string;
  isActive: boolean;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description?: string;
  isPublic: boolean;
}

// Transformation functions
const transformLeagueInfo = (db: DbLeagueInfo): LeagueInfo => ({
  id: db.id,
  mission: db.mission,
  history: db.history,
  foundedYear: db.founded_year,
  memberCount: db.member_count,
  seasonsCompleted: db.seasons_completed,
});

const transformContactInfo = (db: DbContactInfo): ContactInfo => ({
  id: db.id,
  email: db.email,
  phone: db.phone,
  address: {
    street: db.address_street,
    city: db.address_city,
    state: db.address_state,
    zipCode: db.address_zip,
  },
  socialMedia: {
    facebook: db.facebook_url || undefined,
    instagram: db.instagram_url || undefined,
  },
  officeHours: {
    weekdays: db.office_hours_weekdays,
    weekends: db.office_hours_weekends,
  },
});

const transformCoreValue = (db: DbCoreValue): CoreValue => ({
  id: db.id,
  name: db.name,
  description: db.description,
  icon: db.icon,
  sortOrder: db.sort_order,
  isActive: db.is_active,
});

const transformLeadershipMember = (db: DbLeadership): LeadershipMember => ({
  id: db.id,
  name: db.name,
  role: db.role,
  bio: db.bio,
  email: db.email || undefined,
  joinedYear: db.joined_year,
  avatar: db.avatar_url || undefined,
  specialties: db.specialties || [],
  favoriteQuote: db.favorite_quote || undefined,
  sortOrder: db.sort_order,
  isActive: db.is_active,
});

const transformTestimonial = (db: DbTestimonial): Testimonial => ({
  id: db.id,
  memberName: db.member_name,
  role: db.role,
  quote: db.quote,
  avatar: db.avatar_url || undefined,
  teamName: db.team_name || undefined,
  sportType: db.sport_type || undefined,
  memberSince: db.member_since || undefined,
  location: db.location,
  isFeatured: db.is_featured,
  isActive: db.is_active,
});

const transformFAQ = (db: DbFAQ): FAQ => ({
  id: db.id,
  question: db.question,
  answer: db.answer,
  category: db.category,
  priority: db.priority,
  isActive: db.is_active,
});

const transformTimelineMilestone = (db: DbTimeline): TimelineMilestone => ({
  id: db.id,
  year: db.year,
  month: db.month || undefined,
  title: db.title,
  description: db.description,
  type: db.type,
  isActive: db.is_active,
});

const transformSportsInfo = (db: DbSportsInfo): SportsInfo => {
  // Extract season and year from name like "Summer 2025 Kickball"
  let season = "Spring";
  let year = new Date().getFullYear();
  
  const nameParts = db.name.split(' ');
  if (nameParts.length >= 3) {
    const possibleSeason = nameParts[0];
    const possibleYear = parseInt(nameParts[1]);
    
    if (['Spring', 'Summer', 'Fall', 'Winter'].includes(possibleSeason)) {
      season = possibleSeason;
    }
    
    if (!isNaN(possibleYear) && possibleYear >= 2020 && possibleYear <= 2030) {
      year = possibleYear;
    }
  }
  
  return {
    id: db.id,
    name: db.name,
    title: db.title,
    description: db.description,
    gradient: db.gradient,
    participants: db.participants,
    nextGame: db.next_game ? new Date(db.next_game) : undefined,
    features: db.features || [],
    totalTeams: db.total_teams,
    rosterPath: db.roster_path || undefined,
    comingSoon: db.coming_soon,
    isActive: db.is_active,
    season: season,
    year: year,
    createdAt: db.created_at,
  };
};

const transformAboutFeature = (db: DbAboutFeature): AboutFeature => ({
  id: db.id,
  icon: db.icon,
  title: db.title,
  description: db.description,
  sortOrder: db.sort_order,
  isActive: db.is_active,
});

const transformHeroContent = (db: DbHeroContent): HeroContent => ({
  id: db.id,
  page: db.page,
  title: db.title,
  subtitle: db.subtitle || undefined,
  primaryCtaText: db.primary_cta_text || undefined,
  primaryCtaAction: db.primary_cta_action || undefined,
  secondaryCtaText: db.secondary_cta_text || undefined,
  secondaryCtaAction: db.secondary_cta_action || undefined,
  backgroundImageUrl: db.background_image_url || undefined,
  isActive: db.is_active,
});

const transformSiteSetting = (db: DbSiteSetting): SiteSetting => ({
  id: db.id,
  key: db.key,
  value: db.value,
  type: db.type,
  category: db.category,
  description: db.description || undefined,
  isPublic: db.is_public,
});

// API functions

// League Info API
export const leagueInfoApi = {
  async get(): Promise<LeagueInfo | null> {
    const { data, error } = await supabase
      .from("league_info")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformLeagueInfo(data) : null;
  },

  async update(updates: Partial<Omit<LeagueInfo, "id">>): Promise<LeagueInfo> {
    // First try to get existing record
    const existing = await this.get();
    
    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from("league_info")
        .update({
          mission: updates.mission,
          history: updates.history,
          founded_year: updates.foundedYear,
          member_count: updates.memberCount,
          seasons_completed: updates.seasonsCompleted,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return transformLeagueInfo(data);
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("league_info")
        .insert({
          mission: updates.mission || "",
          history: updates.history || "",
          founded_year: updates.foundedYear || 2019,
          member_count: updates.memberCount || 0,
          seasons_completed: updates.seasonsCompleted || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return transformLeagueInfo(data);
    }
  },
};

// Contact Info API
export const contactInfoApi = {
  async get(): Promise<ContactInfo | null> {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformContactInfo(data) : null;
  },

  async update(
    updates: Partial<Omit<ContactInfo, "id">>
  ): Promise<ContactInfo> {
    // First try to get existing record
    const existing = await this.get();
    
    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from("contact_info")
        .update({
          email: updates.email,
          phone: updates.phone,
          address_street: updates.address?.street,
          address_city: updates.address?.city,
          address_state: updates.address?.state,
          address_zip: updates.address?.zipCode,
          office_hours_weekdays: updates.officeHours?.weekdays,
          office_hours_weekends: updates.officeHours?.weekends,
          facebook_url: updates.socialMedia?.facebook,
          instagram_url: updates.socialMedia?.instagram,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return transformContactInfo(data);
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("contact_info")
        .insert({
          email: updates.email || "",
          phone: updates.phone || "",
          address_street: updates.address?.street || "",
          address_city: updates.address?.city || "",
          address_state: updates.address?.state || "",
          address_zip: updates.address?.zipCode || "",
          office_hours_weekdays: updates.officeHours?.weekdays || "",
          office_hours_weekends: updates.officeHours?.weekends || "",
          facebook_url: updates.socialMedia?.facebook,
          instagram_url: updates.socialMedia?.instagram,
        })
        .select()
        .single();

      if (error) throw error;
      return transformContactInfo(data);
    }
  },
};

// Core Values API
export const coreValuesApi = {
  async getAll(): Promise<CoreValue[]> {
    const { data, error } = await supabase
      .from("core_values")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data.map(transformCoreValue);
  },

  async getById(id: string): Promise<CoreValue | null> {
    const { data, error } = await supabase
      .from("core_values")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformCoreValue(data) : null;
  },

  async create(value: Omit<CoreValue, "id">): Promise<CoreValue> {
    const { data, error } = await supabase
      .from("core_values")
      .insert({
        name: value.name,
        description: value.description,
        icon: value.icon,
        sort_order: value.sortOrder,
        is_active: value.isActive,
      })
      .select()
      .single();

    if (error) throw error;
    return transformCoreValue(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<CoreValue, "id">>
  ): Promise<CoreValue> {
    const { data, error } = await supabase
      .from("core_values")
      .update({
        name: updates.name,
        description: updates.description,
        icon: updates.icon,
        sort_order: updates.sortOrder,
        is_active: updates.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformCoreValue(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("core_values").delete().eq("id", id);

    if (error) throw error;
  },
};

// Leadership Team API
export const leadershipApi = {
  async getAll(): Promise<LeadershipMember[]> {
    const { data, error } = await supabase
      .from("leadership_team")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data.map(transformLeadershipMember);
  },

  async getById(id: string): Promise<LeadershipMember | null> {
    const { data, error } = await supabase
      .from("leadership_team")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformLeadershipMember(data) : null;
  },

  async create(
    member: Omit<LeadershipMember, "id">
  ): Promise<LeadershipMember> {
    const { data, error } = await supabase
      .from("leadership_team")
      .insert({
        name: member.name,
        role: member.role,
        bio: member.bio,
        email: member.email,
        joined_year: member.joinedYear,
        avatar_url: member.avatar,
        specialties: member.specialties,
        favorite_quote: member.favoriteQuote,
        sort_order: member.sortOrder,
        is_active: member.isActive,
      })
      .select()
      .single();

    if (error) throw error;
    return transformLeadershipMember(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<LeadershipMember, "id">>
  ): Promise<LeadershipMember> {
    const { data, error } = await supabase
      .from("leadership_team")
      .update({
        name: updates.name,
        role: updates.role,
        bio: updates.bio,
        email: updates.email,
        joined_year: updates.joinedYear,
        avatar_url: updates.avatar,
        specialties: updates.specialties,
        favorite_quote: updates.favoriteQuote,
        sort_order: updates.sortOrder,
        is_active: updates.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformLeadershipMember(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("leadership_team")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// Testimonials API
export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(transformTestimonial);
  },

  async getFeatured(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(transformTestimonial);
  },

  async getBySport(sportType: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .eq("sport_type", sportType)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(transformTestimonial);
  },

  async getById(id: string): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformTestimonial(data) : null;
  },

  async create(testimonial: Omit<Testimonial, "id">): Promise<Testimonial> {
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        member_name: testimonial.memberName,
        role: testimonial.role,
        quote: testimonial.quote,
        avatar_url: testimonial.avatar,
        team_name: testimonial.teamName,
        sport_type: testimonial.sportType,
        member_since: testimonial.memberSince,
        location: testimonial.location,
        is_featured: testimonial.isFeatured,
        is_active: testimonial.isActive,
      })
      .select()
      .single();

    if (error) throw error;
    return transformTestimonial(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<Testimonial, "id">>
  ): Promise<Testimonial> {
    const { data, error } = await supabase
      .from("testimonials")
      .update({
        member_name: updates.memberName,
        role: updates.role,
        quote: updates.quote,
        avatar_url: updates.avatar,
        team_name: updates.teamName,
        sport_type: updates.sportType,
        member_since: updates.memberSince,
        location: updates.location,
        is_featured: updates.isFeatured,
        is_active: updates.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformTestimonial(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) throw error;
  },
};

// FAQs API
export const faqsApi = {
  async getAll(): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("priority");

    if (error) throw error;
    return data.map(transformFAQ);
  },

  async getByCategory(category: string): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .eq("category", category)
      .order("priority");

    if (error) throw error;
    return data.map(transformFAQ);
  },

  async getById(id: string): Promise<FAQ | null> {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformFAQ(data) : null;
  },

  async create(faq: Omit<FAQ, "id">): Promise<FAQ> {
    const { data, error } = await supabase
      .from("faqs")
      .insert({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        priority: faq.priority,
        is_active: faq.isActive,
      })
      .select()
      .single();

    if (error) throw error;
    return transformFAQ(data);
  },

  async update(id: string, updates: Partial<Omit<FAQ, "id">>): Promise<FAQ> {
    const { data, error } = await supabase
      .from("faqs")
      .update({
        question: updates.question,
        answer: updates.answer,
        category: updates.category,
        priority: updates.priority,
        is_active: updates.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformFAQ(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) throw error;
  },
};

// Timeline API
export const timelineApi = {
  async getAll(): Promise<TimelineMilestone[]> {
    const { data, error } = await supabase
      .from("timeline_milestones")
      .select("*")
      .eq("is_active", true)
      .order("year", { ascending: false })
      .order("month");

    if (error) throw error;
    return data.map(transformTimelineMilestone);
  },

  async getByType(type: string): Promise<TimelineMilestone[]> {
    const { data, error } = await supabase
      .from("timeline_milestones")
      .select("*")
      .eq("is_active", true)
      .eq("type", type)
      .order("year", { ascending: false });

    if (error) throw error;
    return data.map(transformTimelineMilestone);
  },

  async getById(id: string): Promise<TimelineMilestone | null> {
    const { data, error } = await supabase
      .from("timeline_milestones")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformTimelineMilestone(data) : null;
  },

  async create(
    milestone: Omit<TimelineMilestone, "id">
  ): Promise<TimelineMilestone> {
    const { data, error } = await supabase
      .from("timeline_milestones")
      .insert({
        year: milestone.year,
        month: milestone.month,
        title: milestone.title,
        description: milestone.description,
        type: milestone.type,
        is_active: milestone.isActive,
      })
      .select()
      .single();

    if (error) throw error;
    return transformTimelineMilestone(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<TimelineMilestone, "id">>
  ): Promise<TimelineMilestone> {
    const { data, error } = await supabase
      .from("timeline_milestones")
      .update({
        year: updates.year,
        month: updates.month,
        title: updates.title,
        description: updates.description,
        type: updates.type,
        is_active: updates.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformTimelineMilestone(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("timeline_milestones")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// Sports Info API
export const sportsInfoApi = {
  async getAll(): Promise<SportsInfo[]> {
    const { data, error } = await supabase
      .from("sports_info")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return data.map(transformSportsInfo);
  },

  async getByName(name: string): Promise<SportsInfo | null> {
    const { data, error } = await supabase
      .from("sports_info")
      .select("*")
      .eq("name", name)
      .eq("is_active", true)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformSportsInfo(data) : null;
  },

  async getById(id: string): Promise<SportsInfo | null> {
    const { data, error } = await supabase
      .from("sports_info")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformSportsInfo(data) : null;
  },

  async create(sport: Omit<SportsInfo, "id">): Promise<SportsInfo> {
    const { data, error } = await supabase
      .from("sports_info")
      .insert({
        name: sport.name,
        title: sport.title,
        description: sport.description,
        gradient: sport.gradient,
        participants: sport.participants,
        next_game: sport.nextGame?.toISOString().split("T")[0],
        features: sport.features,
        total_teams: sport.totalTeams,
        roster_path: sport.rosterPath,
        coming_soon: sport.comingSoon,
        is_active: sport.isActive,
        season: sport.season,
        year: sport.year,
      })
      .select()
      .single();

    if (error) throw error;
    return transformSportsInfo(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<SportsInfo, "id">>
  ): Promise<SportsInfo> {
    const { data, error } = await supabase
      .from("sports_info")
      .update({
        name: updates.name,
        title: updates.title,
        description: updates.description,
        gradient: updates.gradient,
        participants: updates.participants,
        next_game: updates.nextGame?.toISOString().split("T")[0],
        features: updates.features,
        total_teams: updates.totalTeams,
        roster_path: updates.rosterPath,
        coming_soon: updates.comingSoon,
        is_active: updates.isActive,
        season: updates.season,
        year: updates.year,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformSportsInfo(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("sports_info").delete().eq("id", id);

    if (error) throw error;
  },
};

// About Features API
export const aboutFeaturesApi = {
  async getAll(): Promise<AboutFeature[]> {
    const { data, error } = await supabase
      .from("about_features")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data.map(transformAboutFeature);
  },

  async getById(id: string): Promise<AboutFeature | null> {
    const { data, error } = await supabase
      .from("about_features")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformAboutFeature(data) : null;
  },

  async create(feature: Omit<AboutFeature, "id">): Promise<AboutFeature> {
    const { data, error } = await supabase
      .from("about_features")
      .insert({
        icon: feature.icon,
        title: feature.title,
        description: feature.description,
        sort_order: feature.sortOrder,
        is_active: feature.isActive,
      })
      .select()
      .single();

    if (error) throw error;
    return transformAboutFeature(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<AboutFeature, "id">>
  ): Promise<AboutFeature> {
    const { data, error } = await supabase
      .from("about_features")
      .update({
        icon: updates.icon,
        title: updates.title,
        description: updates.description,
        sort_order: updates.sortOrder,
        is_active: updates.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformAboutFeature(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("about_features")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// Hero Content API
export const heroContentApi = {
  async getAll(): Promise<HeroContent[]> {
    console.log("Fetching all hero content...");
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .order("page");

    if (error) {
      console.error("Error fetching hero content:", error);
      throw error;
    }

    console.log("Hero content data received:", data);
    return data.map(transformHeroContent);
  },

  async getAllActive(): Promise<HeroContent[]> {
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .order("page");

    if (error) throw error;
    return data.map(transformHeroContent);
  },

  async getByPage(page: string): Promise<HeroContent | null> {
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("page", page)
      .eq("is_active", true)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformHeroContent(data) : null;
  },

  async getById(id: string): Promise<HeroContent | null> {
    console.log("Fetching hero content by ID:", id);

    // For admin operations, we need to bypass RLS by using the service role
    // or ensure we have admin privileges. Let's try the normal query first.
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("No hero content found with ID:", id);
        return null;
      }

      if (error.message?.includes("permission") || error.code === "PGRST301") {
        console.error("Permission error when fetching hero content:", error);
        // Still return null instead of throwing to allow better error handling upstream
        return null;
      }

      console.error("Error fetching hero content by ID:", error);
      throw error;
    }

    if (!data) {
      console.log("No hero content found with ID:", id);
      return null;
    }

    console.log("Found hero content:", data);
    return transformHeroContent(data);
  },

  async create(hero: Omit<HeroContent, "id">): Promise<HeroContent> {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to create hero content");
    }

    const { data, error } = await supabase
      .from("hero_content")
      .insert({
        page: hero.page,
        title: hero.title,
        subtitle: hero.subtitle || null,
        primary_cta_text: hero.primaryCtaText || null,
        primary_cta_action: hero.primaryCtaAction || null,
        secondary_cta_text: hero.secondaryCtaText || null,
        secondary_cta_action: hero.secondaryCtaAction || null,
        background_image_url: hero.backgroundImageUrl || null,
        is_active: hero.isActive,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Hero content create error:", error);
      throw error;
    }
    return transformHeroContent(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<HeroContent, "id">>
  ): Promise<HeroContent> {
    // Get current user and verify admin access
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to update hero content");
    }

    // Check admin access first
    const hasAdminAccess = await this.checkAdminAccess();
    if (!hasAdminAccess) {
      throw new Error(
        "You don't have admin permissions to update hero content. Please ensure your account has admin privileges."
      );
    }

    // Verify the record exists and we can access it
    console.log("Checking if record exists and is accessible...");
    const existingRecord = await this.getById(id);
    if (!existingRecord) {
      throw new Error(
        `Hero content with ID ${id} does not exist or you don't have permission to access it`
      );
    }

    // Filter out undefined values and convert empty strings to null
    const updateData: any = {
      updated_by: user.id, // Always set the updated_by field
    };
    if (updates.page !== undefined) updateData.page = updates.page;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.subtitle !== undefined)
      updateData.subtitle = updates.subtitle || null;
    if (updates.primaryCtaText !== undefined)
      updateData.primary_cta_text = updates.primaryCtaText || null;
    if (updates.primaryCtaAction !== undefined)
      updateData.primary_cta_action = updates.primaryCtaAction || null;
    if (updates.secondaryCtaText !== undefined)
      updateData.secondary_cta_text = updates.secondaryCtaText || null;
    if (updates.secondaryCtaAction !== undefined)
      updateData.secondary_cta_action = updates.secondaryCtaAction || null;
    if (updates.backgroundImageUrl !== undefined)
      updateData.background_image_url = updates.backgroundImageUrl || null;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    console.log("Attempting to update hero content:", {
      id,
      updateData,
      userId: user.id,
    });

    const { data, error } = await supabase
      .from("hero_content")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Hero content update error:", error);
      if (error.code === "PGRST116") {
        throw new Error(
          `Hero content with ID ${id} not found or you don't have permission to update it. This could be due to insufficient admin privileges.`
        );
      }
      if (error.message?.includes("permission") || error.code === "PGRST301") {
        throw new Error(
          "Permission denied. Please ensure your account has admin privileges to update hero content."
        );
      }
      throw error;
    }
    return transformHeroContent(data);
  },

  async seedInitialContent(): Promise<void> {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to seed hero content");
    }

    // Check if any hero content exists
    const { data: existingContent, error: checkError } = await supabase
      .from("hero_content")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Error checking existing hero content:", checkError);
      // If we can't read the table, it might be a permissions issue
      if (
        checkError.message?.includes("permission") ||
        checkError.code === "PGRST301"
      ) {
        throw new Error(
          "Unable to access hero content table. Please check admin permissions."
        );
      }
      throw checkError;
    }

    if (existingContent && existingContent.length > 0) {
      console.log("Hero content already exists, skipping seed.");
      return; // Content already exists
    }

    console.log("Seeding initial hero content...");
    // Seed initial hero content
    const initialContent = [
      {
        page: "home",
        title: "Welcome to Out Sports League",
        subtitle:
          "Join our inclusive LGBTQ+ sports community where everyone belongs. Experience the joy of competition, friendship, and athletic achievement in a welcoming environment.",
        primary_cta_text: "Register for Fall Kickball",
        primary_cta_action: "info",
        secondary_cta_text: "View Teams",
        secondary_cta_action: "teams",
        is_active: true,
        updated_by: user.id,
      },
      {
        page: "mission",
        title: "Building Community Through Inclusive Sports",
        subtitle:
          "Creating an inclusive, welcoming sports community where everyone can play, grow, and belong.",
        primary_cta_text: "Register for Fall Kickball",
        primary_cta_action: "signup",
        secondary_cta_text: "Learn More",
        secondary_cta_action: "learn-more",
        is_active: true,
        updated_by: user.id,
      },
    ];

    const { error } = await supabase
      .from("hero_content")
      .insert(initialContent);

    if (error) {
      console.error("Failed to seed hero content:", error);
      throw error;
    }

    console.log("Successfully seeded initial hero content");
  },

  async checkAdminAccess(): Promise<boolean> {
    try {
      // First check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log("No authenticated user found");
        return false;
      }

      console.log("Current user:", user.id, user.email);

      // Check admin status from user profile in database
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error checking user admin status:", profileError);
        return false;
      }

      if (!profile?.is_admin) {
        console.log("User is not an admin");
        return false;
      }

      console.log("User has admin privileges");

      // Try a simple read operation to test admin access with new RLS policies
      const { error } = await supabase
        .from("hero_content")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Admin access check failed:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Admin access check error:", err);
      return false;
    }
  },

  async debugRecords(): Promise<void> {
    console.log("=== DEBUG: Checking all hero content records ===");
    const { data, error } = await supabase
      .from("hero_content")
      .select("id, page, title, is_active, created_at, updated_by");

    if (error) {
      console.error("Error fetching records for debug:", error);
      return;
    }

    console.log("Records found:", data?.length || 0);
    data?.forEach((record, index) => {
      console.log(`Record ${index + 1}:`, {
        id: record.id,
        page: record.page,
        title: record.title,
        is_active: record.is_active,
        created_at: record.created_at,
        updated_by: record.updated_by,
      });
    });
    console.log("=== END DEBUG ===");
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("hero_content").delete().eq("id", id);

    if (error) throw error;
  },
};

// Site Settings API
export const siteSettingsApi = {
  async getAll(): Promise<SiteSetting[]> {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("category", { ascending: true })
      .order("key", { ascending: true });

    if (error) throw error;
    return data.map(transformSiteSetting);
  },

  async getPublic(): Promise<SiteSetting[]> {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("is_public", true)
      .order("category", { ascending: true })
      .order("key", { ascending: true });

    if (error) throw error;
    return data.map(transformSiteSetting);
  },

  async getByKey(key: string): Promise<SiteSetting | null> {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? transformSiteSetting(data) : null;
  },

  async getByCategory(category: string): Promise<SiteSetting[]> {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", category)
      .order("key");

    if (error) throw error;
    return data.map(transformSiteSetting);
  },

  async getValue(key: string): Promise<string | null> {
    const setting = await this.getByKey(key);
    return setting ? setting.value : null;
  },

  async setValue(key: string, value: string): Promise<SiteSetting> {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert({
        key,
        value,
      })
      .select()
      .single();

    if (error) throw error;
    return transformSiteSetting(data);
  },

  async create(setting: Omit<SiteSetting, "id">): Promise<SiteSetting> {
    const { data, error } = await supabase
      .from("site_settings")
      .insert({
        key: setting.key,
        value: setting.value,
        type: setting.type,
        category: setting.category,
        description: setting.description,
        is_public: setting.isPublic,
      })
      .select()
      .single();

    if (error) throw error;
    return transformSiteSetting(data);
  },

  async update(
    id: string,
    updates: Partial<Omit<SiteSetting, "id">>
  ): Promise<SiteSetting> {
    const { data, error } = await supabase
      .from("site_settings")
      .update({
        key: updates.key,
        value: updates.value,
        type: updates.type,
        category: updates.category,
        description: updates.description,
        is_public: updates.isPublic,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return transformSiteSetting(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("site_settings")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
