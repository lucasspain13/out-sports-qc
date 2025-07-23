import React, { useEffect, useState } from "react";
import {
  heroContentApi,
  testSupabaseConnection,
  type HeroContent,
} from "../../lib/contentManagement";

interface HeroContentManagementProps {
  onNavigate?: (page: string) => void;
}

export const HeroContentManagement: React.FC<
  HeroContentManagementProps
> = () => {
  const [heroContents, setHeroContents] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    page: "home",
    title: "",
    subtitle: "",
    primaryCtaText: "",
    primaryCtaAction: "",
    secondaryCtaText: "",
    secondaryCtaAction: "",
    backgroundImageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    fetchHeroContents();
  }, []);

  const fetchHeroContents = async () => {
    try {
      setLoading(true);

      // Test Supabase connection first
      console.log("=== CONNECTION TEST ===");
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        throw new Error(
          "Unable to connect to Supabase. Please check your connection and try again."
        );
      }

      // First check if we have admin access
      const hasAccess = await heroContentApi.checkAdminAccess();
      if (!hasAccess) {
        throw new Error(
          "You don't have admin permissions to manage hero content. Please ensure you're logged in as an admin."
        );
      }

      console.log("Admin access confirmed, fetching hero content...");

      // Debug: Check what records actually exist
      await heroContentApi.debugRecords();

      const data = await heroContentApi.getAll();

      // If no hero content exists, seed initial content
      if (data.length === 0) {
        console.log("No hero content found, seeding initial content...");
        await heroContentApi.seedInitialContent();
        // Fetch again after seeding
        await heroContentApi.debugRecords(); // Debug again after seeding
        const seededData = await heroContentApi.getAll();
        setHeroContents(seededData);
      } else {
        setHeroContents(data);
      }
    } catch (err) {
      console.error("fetchHeroContents error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load hero contents"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      page: "home",
      title: "",
      subtitle: "",
      primaryCtaText: "",
      primaryCtaAction: "",
      secondaryCtaText: "",
      secondaryCtaAction: "",
      backgroundImageUrl: "",
      isActive: true,
    });
    setEditingHero(null);
    setIsCreateMode(false);
  };

  const handleEdit = (hero: HeroContent) => {
    setFormData({
      page: hero.page,
      title: hero.title,
      subtitle: hero.subtitle || "",
      primaryCtaText: hero.primaryCtaText || "",
      primaryCtaAction: hero.primaryCtaAction || "",
      secondaryCtaText: hero.secondaryCtaText || "",
      secondaryCtaAction: hero.secondaryCtaAction || "",
      backgroundImageUrl: hero.backgroundImageUrl || "",
      isActive: hero.isActive,
    });
    setEditingHero(hero);
    setIsCreateMode(false);
  };

  const handleSave = async () => {
    try {
      if (editingHero) {
        console.log("=== SAVE DEBUG ===");
        console.log("Editing hero ID:", editingHero.id);
        console.log("Form data:", formData);
        console.log("Full editing hero object:", editingHero);

        // Debug: Check if this record still exists before trying to update
        await heroContentApi.debugRecords();

        await heroContentApi.update(editingHero.id, formData);
      } else {
        console.log("Creating new hero content:", formData);
        await heroContentApi.create(formData);
      }
      await fetchHeroContents();
      resetForm();
    } catch (err) {
      console.error("Hero content save error:", err);
      let errorMessage = "Failed to save hero content";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        errorMessage = JSON.stringify(err);
      }
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero content?")) return;
    try {
      await heroContentApi.delete(id);
      await fetchHeroContents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete hero content"
      );
    }
  };

  const pageOptions = [
    { value: "home", label: "Home Page" },
    { value: "about", label: "About Page" },
    { value: "mission", label: "Mission Page" },
    { value: "info", label: "General Info Page" },
    { value: "kickball", label: "Kickball Pages" },
    { value: "dodgeball", label: "Dodgeball Pages" },
  ];

  const actionOptions = [
    { value: "info", label: "League Info" },
    { value: "teams", label: "View Teams" },
    { value: "signup", label: "Sign Up" },
    { value: "learn-more", label: "Learn More" },
    { value: "register", label: "Register" },
    { value: "contact", label: "Contact Us" },
  ];

  if (loading) {
    return <div className="text-center py-8">Loading hero contents...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Hero Content Management
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setIsCreateMode(true);
              resetForm();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Hero Content
          </button>
        </div>

        {/* Create/Edit Form */}
        {(isCreateMode || editingHero) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingHero ? "Edit Hero Content" : "Create New Hero Content"}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page *
                  </label>
                  <select
                    value={formData.page}
                    onChange={e =>
                      setFormData({ ...formData, page: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {pageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Main hero title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    value={formData.subtitle}
                    onChange={e =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hero subtitle or description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.backgroundImageUrl}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        backgroundImageUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/hero-bg.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hero-active"
                    checked={formData.isActive}
                    onChange={e =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="hero-active"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Active (visible on site)
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Primary Call-to-Action
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.primaryCtaText}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            primaryCtaText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="League Info"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action
                      </label>
                      <select
                        value={formData.primaryCtaAction}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            primaryCtaAction: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select action</option>
                        {actionOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Secondary Call-to-Action
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryCtaText}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            secondaryCtaText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="View Teams"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action
                      </label>
                      <select
                        value={formData.secondaryCtaAction}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            secondaryCtaAction: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select action</option>
                        {actionOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!formData.page || !formData.title}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingHero ? "Update" : "Create"}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Hero Contents List */}
        <div className="space-y-4">
          {heroContents.map(hero => (
            <div
              key={hero.id}
              className={`bg-white border border-gray-200 rounded-lg p-6 ${
                !hero.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {pageOptions.find(p => p.value === hero.page)?.label ||
                        hero.page}
                    </span>
                    {!hero.isActive && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {hero.title}
                  </h3>

                  {hero.subtitle && (
                    <p className="text-gray-700 mb-4">{hero.subtitle}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    {hero.primaryCtaText && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Primary CTA:</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {hero.primaryCtaText}
                        </span>
                        {hero.primaryCtaAction && (
                          <span className="text-gray-500">
                            → {hero.primaryCtaAction}
                          </span>
                        )}
                      </div>
                    )}
                    {hero.secondaryCtaText && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Secondary CTA:</span>
                        <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded">
                          {hero.secondaryCtaText}
                        </span>
                        {hero.secondaryCtaAction && (
                          <span className="text-gray-500">
                            → {hero.secondaryCtaAction}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(hero)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hero.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {heroContents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hero content found. Create your first hero section!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
