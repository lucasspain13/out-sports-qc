import React, { useEffect, useState } from "react";
import { WebsiteFeedback, websiteFeedbackApi } from "../../lib/websiteFeedback";

const WebsiteFeedbackManagement: React.FC = () => {
  const [feedback, setFeedback] = useState<WebsiteFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'dismissed'>('all');
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadFeedback();
    loadStatusCounts();
  }, [selectedStatus]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      let data: WebsiteFeedback[];
      
      if (selectedStatus === 'all') {
        data = await websiteFeedbackApi.getAll();
      } else {
        data = await websiteFeedbackApi.getByStatus(selectedStatus);
      }
      
      setFeedback(data);
    } catch (error) {
      console.error("Error loading feedback:", error);
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const loadStatusCounts = async () => {
    try {
      const counts = await websiteFeedbackApi.getStatusCounts();
      setStatusCounts(counts);
    } catch (error) {
      console.error("Error loading status counts:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: WebsiteFeedback['status'], adminNotes?: string) => {
    try {
      if (newStatus === 'resolved') {
        await websiteFeedbackApi.markResolved(id, adminNotes);
      } else if (newStatus === 'dismissed') {
        await websiteFeedbackApi.markDismissed(id, adminNotes);
      } else {
        await websiteFeedbackApi.update(id, { status: newStatus });
      }
      
      await loadFeedback();
      await loadStatusCounts();
    } catch (error) {
      console.error("Error updating feedback status:", error);
      setError("Failed to update feedback status");
    }
  };

  const handlePriorityChange = async (id: string, priority: WebsiteFeedback['priority']) => {
    try {
      await websiteFeedbackApi.update(id, { priority });
      await loadFeedback();
    } catch (error) {
      console.error("Error updating priority:", error);
      setError("Failed to update priority");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this feedback entry? This action cannot be undone.")) {
      return;
    }
    
    try {
      await websiteFeedbackApi.delete(id);
      await loadFeedback();
      await loadStatusCounts();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError("Failed to delete feedback");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return '🐛';
      case 'content':
        return '📝';
      case 'suggestion':
        return '💡';
      default:
        return '💬';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        <span className="ml-2 text-gray-600">Loading feedback...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Feedback</h1>
          <p className="text-gray-600">Manage user feedback, bug reports, and suggestions</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: feedback.length },
            { key: 'new', label: 'New', count: statusCounts.new || 0 },
            { key: 'in_progress', label: 'In Progress', count: statusCounts.in_progress || 0 },
            { key: 'resolved', label: 'Resolved', count: statusCounts.resolved || 0 },
            { key: 'dismissed', label: 'Dismissed', count: statusCounts.dismissed || 0 },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key as typeof selectedStatus)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStatus === tab.key
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">💭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No feedback found
            </h3>
            <p className="text-gray-500">
              {selectedStatus === 'all' 
                ? "No feedback has been submitted yet."
                : `No ${selectedStatus.replace('_', ' ')} feedback found.`}
            </p>
          </div>
        ) : (
          feedback.map(item => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getFeedbackTypeIcon(item.feedback_type)}</span>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityBadgeClass(item.priority)}`}>
                        {item.priority} priority
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                        {item.feedback_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Submitted {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setExpandedFeedback(expandedFeedback === item.id ? null : item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedFeedback === item.id ? '▼' : '▶'}
                </button>
              </div>

              {/* Feedback Content */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {item.issue_description}
                </p>
              </div>

              {/* URL */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">Page URL:</h4>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline text-sm break-all"
                >
                  {item.url}
                </a>
              </div>

              {/* Expanded Details */}
              {expandedFeedback === item.id && (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  {/* User Agent */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Browser Info:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {item.user_agent}
                    </p>
                  </div>

                  {/* Admin Notes */}
                  {item.admin_notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Admin Notes:</h4>
                      <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        {item.admin_notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {/* Status Updates */}
                    {item.status === 'new' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'in_progress')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        Mark In Progress
                      </button>
                    )}
                    
                    {(item.status === 'new' || item.status === 'in_progress') && (
                      <>
                        <button
                          onClick={() => {
                            const notes = prompt("Add resolution notes (optional):");
                            handleStatusChange(item.id, 'resolved', notes || undefined);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt("Add dismissal reason (optional):");
                            handleStatusChange(item.id, 'dismissed', notes || undefined);
                          }}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Dismiss
                        </button>
                      </>
                    )}

                    {/* Priority Updates */}
                    {item.priority !== 'high' && (
                      <button
                        onClick={() => handlePriorityChange(item.id, 'high')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-200"
                      >
                        Set to High Priority
                      </button>
                    )}
                    {item.priority !== 'medium' && (
                      <button
                        onClick={() => handlePriorityChange(item.id, 'medium')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-200"
                      >
                        Set to Medium Priority
                      </button>
                    )}
                    {item.priority !== 'low' && (
                      <button
                        onClick={() => handlePriorityChange(item.id, 'low')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-200"
                      >
                        Set to Low Priority
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 border border-red-700"
                      title="Permanently delete this feedback"
                    >
                      Permanently Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebsiteFeedbackManagement;
