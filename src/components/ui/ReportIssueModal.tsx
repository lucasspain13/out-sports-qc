import { X } from "lucide-react";
import React, { useState } from "react";
import { websiteFeedbackApi } from "../../lib/websiteFeedback";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose }) => {
  const [issue, setIssue] = useState("");
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'content' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUrl = window.location.href;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issue.trim()) {
      setError("Please describe the issue before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await websiteFeedbackApi.create({
        url: currentUrl,
        user_agent: navigator.userAgent,
        issue_description: issue,
        feedback_type: feedbackType,
      });
      
      setIsSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setIssue("");
        setFeedbackType('other');
        setIsSubmitted(false);
        setError(null);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("There was an error submitting your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIssue("");
    setFeedbackType('other');
    setIsSubmitted(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-10">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Submit Website Feedback
              </h3>
              <button
                onClick={handleClose}
                className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Thank you for your feedback!
                </h4>
                <p className="text-gray-600">
                  Your feedback has been submitted and will be reviewed by our team. We appreciate your input in helping us improve the website.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Current URL Display */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Page URL
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600 break-all">
                    {currentUrl}
                  </div>
                </div>

                {/* Feedback Type */}
                <div className="mb-4">
                  <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of feedback *
                  </label>
                  <select
                    id="feedbackType"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value as typeof feedbackType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    required
                  >
                    <option value="bug">🐛 Bug Report - Something isn't working</option>
                    <option value="content">📝 Content Feedback - Text needs updating</option>
                    <option value="suggestion">💡 Suggestion - Feature or improvement idea</option>
                    <option value="other">💬 Other - General feedback</option>
                  </select>
                </div>

                {/* Issue Description */}
                <div className="mb-6">
                  <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-2">
                    Please share your feedback *
                  </label>
                  <textarea
                    id="issue"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-vertical"
                    placeholder={
                      feedbackType === 'bug' 
                        ? "Describe what went wrong and steps to reproduce the issue..."
                        : feedbackType === 'content'
                        ? "What text or content should be updated? Please be specific about what needs to change..."
                        : feedbackType === 'suggestion'
                        ? "Describe your idea for improvement or new feature..."
                        : "Share any feedback, questions, or suggestions you have..."
                    }
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {feedbackType === 'bug' && "Please include steps to reproduce the issue if applicable."}
                    {feedbackType === 'content' && "Help us make our content more relevant and accurate for the Quad Cities community."}
                    {feedbackType === 'suggestion' && "We value your ideas for improving the website experience."}
                    {feedbackType === 'other' && "All feedback is welcome and helps us improve."}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-brand-blue text-white hover:bg-brand-blue/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;
