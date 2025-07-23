import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AnnouncementNotification {
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  target_audience: "all" | "players" | "teams" | "kickball" | "dodgeball";
}

interface PushTokenRecord {
  user_id: string;
  push_token: string;
  platform: "ios" | "android";
  is_active: boolean;
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify the request is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the user has admin permissions by checking the database
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid authentication");
    }

    // Check if user is admin from user_profiles table (more secure)
    const { data: userProfile, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile?.is_admin) {
      throw new Error("Admin access required");
    }

    // Parse the request body
    const {
      title,
      content,
      priority,
      target_audience,
    }: AnnouncementNotification = await req.json();

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    // Get push tokens based on target audience
    // Note: You'll need to create a push_tokens table to store user push tokens
    const { data: pushTokens, error: tokensError } = await supabaseClient
      .from("push_tokens")
      .select("*")
      .eq("is_active", true);

    if (tokensError) {
      console.error("Error fetching push tokens:", tokensError);
      throw new Error("Failed to fetch push tokens");
    }

    if (!pushTokens || pushTokens.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No push tokens found",
          tokens_sent: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Filter tokens based on target audience if needed
    // This is a simplified version - you might want more sophisticated targeting
    let filteredTokens = pushTokens;

    if (target_audience !== "all") {
      // You could implement audience filtering here based on your user data
      // For now, we'll send to all tokens
      console.log(`Target audience: ${target_audience}`);
    }

    // Prepare Firebase Cloud Messaging payload
    const fcmPayload = {
      notification: {
        title: `📢 ${title}`,
        body: content,
      },
      data: {
        type: "announcement",
        priority: priority,
        target_audience: target_audience,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        priority:
          priority === "urgent" || priority === "high" ? "high" : "normal",
        notification: {
          icon: "ic_notification",
          color: "#1976d2",
          sound: priority === "urgent" ? "urgent_sound" : "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: priority === "urgent" ? "urgent_sound.wav" : "default",
            badge: 1,
            "content-available": 1,
          },
        },
      },
    };

    // Send notifications to Firebase Cloud Messaging
    // Note: You'll need to set up FCM and get a server key
    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");

    if (!fcmServerKey) {
      throw new Error("FCM server key not configured");
    }

    const notificationPromises = filteredTokens.map(
      async (tokenRecord: PushTokenRecord) => {
        try {
          const response = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              Authorization: `key=${fcmServerKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...fcmPayload,
              to: tokenRecord.push_token,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `FCM error for token ${tokenRecord.push_token}:`,
              errorText
            );
            return {
              success: false,
              token: tokenRecord.push_token,
              error: errorText,
            };
          }

          const result = await response.json();
          return { success: true, token: tokenRecord.push_token, result };
        } catch (error) {
          console.error(
            `Error sending to token ${tokenRecord.push_token}:`,
            error
          );
          return {
            success: false,
            token: tokenRecord.push_token,
            error: error.message,
          };
        }
      }
    );

    const results = await Promise.all(notificationPromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(
      `Push notification results: ${successCount} successful, ${failureCount} failed`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Push notifications sent",
        tokens_sent: successCount,
        tokens_failed: failureCount,
        results: results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-announcement-notification:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
