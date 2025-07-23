import React, { useEffect, useState } from "react";
import {
  faqsApi,
  testSupabaseConnection,
  type FAQ,
} from "../../lib/contentManagement";

interface FAQManagementProps {
  onNavigate?: (page: string) => void;
}

export const FAQManagement: React.FC<FAQManagementProps> = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "general" | "registration" | "rules" | "costs" | "events" | "safety"
  >("all");

  // Form state
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general" as FAQ["category"],
    priority: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);

      // Test Supabase connection first
      console.log("=== FAQ CONNECTION TEST ===");
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        throw new Error(
          "Unable to connect to Supabase. Please check your connection and try again."
        );
      }

      const data = await faqsApi.getAll();
      setFaqs(data.sort((a: FAQ, b: FAQ) => a.priority - b.priority));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "general",
      priority: faqs.length + 1,
      isActive: true,
    });
    setEditingFAQ(null);
    setIsCreateMode(false);
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      priority: faq.priority,
      isActive: faq.isActive,
    });
    setEditingFAQ(faq);
    setIsCreateMode(false);
  };

  const handleSave = async () => {
    try {
      if (editingFAQ) {
        await faqsApi.update(editingFAQ.id, formData);
      } else {
        await faqsApi.create(formData);
      }
      await fetchFAQs();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await faqsApi.delete(id);
      await fetchFAQs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete FAQ");
    }
  };

  const filteredFAQs = faqs.filter(
    faq => filter === "all" || faq.category === filter
  );

  const categories = [
    { key: "general", label: "General", icon: "❓" },
    { key: "registration", label: "Registration", icon: "📝" },
    { key: "rules", label: "Rules", icon: "📋" },
    { key: "costs", label: "Costs", icon: "💰" },
    { key: "events", label: "Events", icon: "🎉" },
    { key: "safety", label: "Safety", icon: "🛡️" },
  ];

  if (loading) {
    return <div className="text-center py-8">Loading FAQs...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          FAQ Management
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => {
              setIsCreateMode(true);
              resetForm();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New FAQ
          </button>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({faqs.length})
            </button>
            {categories.map(category => {
              const count = faqs.filter(
                faq => faq.category === category.key
              ).length;
              return (
                <button
                  key={category.key}
                  onClick={() => setFilter(category.key as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === category.key
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.icon} {category.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreateMode || editingFAQ) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingFAQ ? "Edit FAQ" : "Create New FAQ"}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={e =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        category: e.target.value as FAQ["category"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority (lower numbers appear first)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="faq-active"
                    checked={formData.isActive}
                    onChange={e =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="faq-active"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Active (visible on site)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={e =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!formData.question || !formData.answer}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingFAQ ? "Update" : "Create"}
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

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFAQs.map(faq => (
            <div
              key={faq.id}
              className={`bg-white border border-gray-200 rounded-lg p-6 ${
                !faq.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {categories.find(c => c.key === faq.category)?.label ||
                        faq.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Priority: {faq.priority}
                    </span>
                    {!faq.isActive && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>

                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No FAQs found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
