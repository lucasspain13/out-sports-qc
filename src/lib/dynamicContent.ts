// Dynamic Content Loaders - Replace static data imports with database calls
import { useEffect, useState } from "react";
import {
  aboutFeaturesApi,
  contactInfoApi,
  coreValuesApi,
  faqsApi,
  heroContentApi,
  leadershipApi,
  leagueInfoApi,
  siteSettingsApi,
  sportsInfoApi,
  testimonialsApi,
  timelineApi,
  type AboutFeature,
  type ContactInfo,
  type CoreValue,
  type FAQ,
  type HeroContent,
  type LeadershipMember,
  type LeagueInfo,
  type SportsInfo,
  type Testimonial,
  type TimelineMilestone,
} from "./contentManagement";

// Cache management
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(key: string, params?: any): string {
  return params ? `${key}_${JSON.stringify(params)}` : key;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Dynamic data loaders with caching
export async function getLeagueInfo(): Promise<LeagueInfo | null> {
  const cacheKey = getCacheKey("league_info");
  const cached = getFromCache<LeagueInfo>(cacheKey);
  if (cached) return cached;

  try {
    const data = await leagueInfoApi.get();
    if (data) setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load league info:", error);
    return null;
  }
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  const cacheKey = getCacheKey("contact_info");
  const cached = getFromCache<ContactInfo>(cacheKey);
  if (cached) return cached;

  try {
    const data = await contactInfoApi.get();
    if (data) setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load contact info:", error);
    return null;
  }
}

export async function getCoreValues(): Promise<CoreValue[]> {
  const cacheKey = getCacheKey("core_values");
  const cached = getFromCache<CoreValue[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await coreValuesApi.getAll();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load core values:", error);
    return [];
  }
}

export async function getLeadershipTeam(): Promise<LeadershipMember[]> {
  const cacheKey = getCacheKey("leadership");
  const cached = getFromCache<LeadershipMember[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await leadershipApi.getAll();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load leadership team:", error);
    return [];
  }
}

export async function getTestimonials(
  featured: boolean = false
): Promise<Testimonial[]> {
  const cacheKey = getCacheKey("testimonials", { featured });
  const cached = getFromCache<Testimonial[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = featured
      ? await testimonialsApi.getFeatured()
      : await testimonialsApi.getAll();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    return [];
  }
}

export async function getTestimonialsBySport(
  sportType: string
): Promise<Testimonial[]> {
  const cacheKey = getCacheKey("testimonials", { sportType });
  const cached = getFromCache<Testimonial[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await testimonialsApi.getBySport(sportType);
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load testimonials by sport:", error);
    return [];
  }
}

export async function getAboutFeatures(): Promise<AboutFeature[]> {
  const cacheKey = getCacheKey("about_features");
  const cached = getFromCache<AboutFeature[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await aboutFeaturesApi.getAll();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load about features:", error);
    return [];
  }
}

export async function getHeroContent(
  page: string
): Promise<HeroContent | null> {
  const cacheKey = getCacheKey("hero_content", { page });
  const cached = getFromCache<HeroContent>(cacheKey);
  if (cached) return cached;

  try {
    const data = await heroContentApi.getByPage(page);
    if (data) setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load hero content:", error);
    return null;
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const cacheKey = getCacheKey("site_setting", { key });
  const cached = getFromCache<string>(cacheKey);
  if (cached) return cached;

  try {
    const data = await siteSettingsApi.getValue(key);
    if (data) setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to load site setting ${key}:`, error);
    return null;
  }
}

export async function getPublicSiteSettings(): Promise<Record<string, string>> {
  const cacheKey = getCacheKey("public_site_settings");
  const cached = getFromCache<Record<string, string>>(cacheKey);
  if (cached) return cached;

  try {
    const settings = await siteSettingsApi.getPublic();
    const data = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load public site settings:", error);
    return {};
  }
}

// Hook for React components to use dynamic content
// React Hooks for dynamic content loading
export function useLeagueInfo() {
  const [data, setData] = useState<LeagueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLeagueInfo()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useContactInfo() {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getContactInfo()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useCoreValues() {
  const [data, setData] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCoreValues()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useLeadershipTeam() {
  const [data, setData] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLeadershipTeam()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useTestimonials(featured: boolean = false, sportType?: string) {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = sportType
      ? getTestimonialsBySport(sportType)
      : getTestimonials(featured);

    loadData
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [featured, sportType]);

  return { data, loading, error };
}

export function useAboutFeatures() {
  const [data, setData] = useState<AboutFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAboutFeatures()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useHeroContent(page: string) {
  const [data, setData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHeroContent(page)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return { data, loading, error };
}

export async function getSportsInfo(): Promise<SportsInfo[]> {
  const cacheKey = getCacheKey("sports_info");
  const cached = getFromCache<SportsInfo[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await sportsInfoApi.getAll();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load sports info:", error);
    return [];
  }
}

export function useSportsInfo() {
  const [data, setData] = useState<SportsInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSportsInfo()
      .then(setData)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export async function getFAQs(category?: string): Promise<FAQ[]> {
  const cacheKey = getCacheKey("faqs", { category });
  const cached = getFromCache<FAQ[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await faqsApi.getAll();
    const filtered = category
      ? data.filter(faq => faq.category === category)
      : data;
    setCache(cacheKey, filtered);
    return filtered;
  } catch (error) {
    console.error("Failed to load FAQs:", error);
    return [];
  }
}

export async function getTimelineMilestones(): Promise<TimelineMilestone[]> {
  const cacheKey = getCacheKey("timeline_milestones");
  const cached = getFromCache<TimelineMilestone[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await timelineApi.getAll();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to load timeline milestones:", error);
    return [];
  }
}

export function useFAQs(category?: string) {
  const [data, setData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFAQs(category)
      .then(setData)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { data, loading, error };
}

export function useTimelineMilestones() {
  const [data, setData] = useState<TimelineMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTimelineMilestones()
      .then(setData)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useSiteSetting(key: string) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSiteSetting(key)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  return { data, loading, error };
}

export function useSiteSettings() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicSiteSettings()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Cache management utilities
export function clearContentCache(): void {
  cache.clear();
  console.log("🧹 Content cache cleared!");
}

export function invalidateCache(key: string): void {
  for (const cacheKey of cache.keys()) {
    if (cacheKey.startsWith(key)) {
      cache.delete(cacheKey);
    }
  }
  console.log(`🧹 Cache cleared for: ${key}`);
}

// Add to window for browser console access
if (typeof window !== "undefined") {
  // @ts-ignore
  window.clearSportsCache = () => {
    invalidateCache("sports_info");
    console.log("🔄 Sports cache cleared! Page will refresh...");
    setTimeout(() => window.location.reload(), 500);
  };
}
