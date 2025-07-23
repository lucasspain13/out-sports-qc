import React, { useEffect, useState } from "react";
import {
  contactInfoApi,
  leagueInfoApi,
  type ContactInfo,
  type LeagueInfo,
} from "../../lib/contentManagement";

interface ContentManagementProps {
  onNavigate?: (page: string) => void;
}

export const ContentManagement: React.FC<ContentManagementProps> = () => {
  const [_leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null);
  const [_contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // League Info Form
  const [leagueFormData, setLeagueFormData] = useState({
    mission: "",
    history: "",
    foundedYear: 2025,
    memberCount: 62,
    seasonsCompleted: 0,
  });

  // Contact Info Form
  const [contactFormData, setContactFormData] = useState({
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      discord: "",
    },
    officeHours: {
      weekdays: "",
      weekends: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leagueData, contactData] = await Promise.all([
        leagueInfoApi.get(),
        contactInfoApi.get(),
      ]);

      if (leagueData) {
        setLeagueInfo(leagueData);
        setLeagueFormData({
          mission: leagueData.mission,
          history: leagueData.history,
          foundedYear: leagueData.foundedYear,
          memberCount: leagueData.memberCount,
          seasonsCompleted: leagueData.seasonsCompleted,
        });
      }

      if (contactData) {
        setContactInfo(contactData);
        setContactFormData({
          email: contactData.email,
          phone: contactData.phone,
          address: contactData.address,
          socialMedia: {
            facebook: contactData.socialMedia.facebook || "",
            instagram: contactData.socialMedia.instagram || "",
            twitter: contactData.socialMedia.twitter || "",
            discord: contactData.socialMedia.discord || "",
          },
          officeHours: contactData.officeHours,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLeagueInfo = async () => {
    try {
      setSaving(true);
      await leagueInfoApi.update(leagueFormData);
      await fetchData(); // Refresh data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save league info"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      setSaving(true);
      await contactInfoApi.update(contactFormData);
      await fetchData(); // Refresh data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save contact info"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Site Content Management
        </h1>
        <p className="text-gray-600">
          Manage the core content that appears throughout your website.
        </p>
      </div>

      {/* League Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          League Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission Statement
            </label>
            <textarea
              value={leagueFormData.mission}
              onChange={e =>
                setLeagueFormData({
                  ...leagueFormData,
                  mission: e.target.value,
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Enter your league's mission statement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              History
            </label>
            <textarea
              value={leagueFormData.history}
              onChange={e =>
                setLeagueFormData({
                  ...leagueFormData,
                  history: e.target.value,
                })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Tell the story of how your league started..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founded Year
              </label>
              <input
                type="number"
                value={leagueFormData.foundedYear}
                onChange={e =>
                  setLeagueFormData({
                    ...leagueFormData,
                    foundedYear: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Count
              </label>
              <input
                type="number"
                value={leagueFormData.memberCount}
                onChange={e =>
                  setLeagueFormData({
                    ...leagueFormData,
                    memberCount: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seasons Completed
              </label>
              <input
                type="number"
                value={leagueFormData.seasonsCompleted}
                onChange={e =>
                  setLeagueFormData({
                    ...leagueFormData,
                    seasonsCompleted: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            onClick={handleSaveLeagueInfo}
            disabled={saving}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save League Info"}
          </button>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={contactFormData.email}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                placeholder="hello@yourleague.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={contactFormData.phone}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    phone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street Address"
                value={contactFormData.address.street}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    address: {
                      ...contactFormData.address,
                      street: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={contactFormData.address.city}
                  onChange={e =>
                    setContactFormData({
                      ...contactFormData,
                      address: {
                        ...contactFormData.address,
                        city: e.target.value,
                      },
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={contactFormData.address.state}
                  onChange={e =>
                    setContactFormData({
                      ...contactFormData,
                      address: {
                        ...contactFormData.address,
                        state: e.target.value,
                      },
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                />

                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={contactFormData.address.zipCode}
                  onChange={e =>
                    setContactFormData({
                      ...contactFormData,
                      address: {
                        ...contactFormData.address,
                        zipCode: e.target.value,
                      },
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Social Media
            </h3>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="Facebook URL"
                value={contactFormData.socialMedia.facebook || ""}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    socialMedia: {
                      ...contactFormData.socialMedia,
                      facebook: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />

              <input
                type="url"
                placeholder="Instagram URL"
                value={contactFormData.socialMedia.instagram || ""}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    socialMedia: {
                      ...contactFormData.socialMedia,
                      instagram: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />

              <input
                type="url"
                placeholder="Twitter URL"
                value={contactFormData.socialMedia.twitter || ""}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    socialMedia: {
                      ...contactFormData.socialMedia,
                      twitter: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />

              <input
                type="url"
                placeholder="Discord URL"
                value={contactFormData.socialMedia.discord || ""}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    socialMedia: {
                      ...contactFormData.socialMedia,
                      discord: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Office Hours
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Weekday Hours (e.g., Monday - Friday: 9:00 AM - 6:00 PM)"
                value={contactFormData.officeHours.weekdays}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    officeHours: {
                      ...contactFormData.officeHours,
                      weekdays: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />

              <input
                type="text"
                placeholder="Weekend Hours (e.g., Saturday: 10:00 AM - 4:00 PM, Sunday: Closed)"
                value={contactFormData.officeHours.weekends}
                onChange={e =>
                  setContactFormData({
                    ...contactFormData,
                    officeHours: {
                      ...contactFormData.officeHours,
                      weekends: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            onClick={handleSaveContactInfo}
            disabled={saving}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Contact Info"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
