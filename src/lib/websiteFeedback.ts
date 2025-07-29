import { supabase } from "./supabase";

export interface WebsiteFeedback {
  id: string;
  url: string;
  user_agent: string;
  issue_description: string;
  feedback_type: 'bug' | 'suggestion' | 'content' | 'other';
  status: 'new' | 'in_progress' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  admin_notes?: string;
}

export interface CreateFeedbackData {
  url: string;
  user_agent: string;
  issue_description: string;
  feedback_type?: 'bug' | 'suggestion' | 'content' | 'other';
}

// Website Feedback API
export const websiteFeedbackApi = {
  // Create new feedback
  async create(data: CreateFeedbackData): Promise<WebsiteFeedback> {
    const { data: feedback, error } = await supabase
      .from("website_feedback")
      .insert({
        url: data.url,
        user_agent: data.user_agent,
        issue_description: data.issue_description,
        feedback_type: data.feedback_type || 'other',
        status: 'new',
        priority: 'medium',
      })
      .select()
      .single();

    if (error) throw error;
    return feedback;
  },

  // Get all feedback
  async getAll(): Promise<WebsiteFeedback[]> {
    const { data, error } = await supabase
      .from("website_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get feedback by status
  async getByStatus(status: WebsiteFeedback['status']): Promise<WebsiteFeedback[]> {
    const { data, error } = await supabase
      .from("website_feedback")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get feedback by priority
  async getByPriority(priority: WebsiteFeedback['priority']): Promise<WebsiteFeedback[]> {
    const { data, error } = await supabase
      .from("website_feedback")
      .select("*")
      .eq("priority", priority)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update feedback
  async update(id: string, updates: Partial<Omit<WebsiteFeedback, 'id' | 'created_at'>>): Promise<WebsiteFeedback> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("website_feedback")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark as resolved
  async markResolved(id: string, adminNotes?: string): Promise<WebsiteFeedback> {
    return this.update(id, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      admin_notes: adminNotes,
    });
  },

  // Mark as dismissed
  async markDismissed(id: string, adminNotes?: string): Promise<WebsiteFeedback> {
    return this.update(id, {
      status: 'dismissed',
      admin_notes: adminNotes,
    });
  },

  // Delete feedback
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("website_feedback")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Get counts by status for dashboard
  async getStatusCounts(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("website_feedback")
      .select("status");

    if (error) throw error;

    const counts = {
      new: 0,
      in_progress: 0,
      resolved: 0,
      dismissed: 0,
    };

    data?.forEach(item => {
      if (item.status in counts) {
        counts[item.status as keyof typeof counts]++;
      }
    });

    return counts;
  },
};
