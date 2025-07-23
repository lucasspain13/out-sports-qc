const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { authLimiter } = require("../middleware/rateLimit");
const {
  authValidation,
  signInValidation,
} = require("../middleware/validation");

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Sign in endpoint with rate limiting and validation
router.post("/signin", authLimiter, signInValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log security event
    console.log(`🔐 Sign-in attempt for: ${email} from IP: ${req.ip}`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`❌ Sign-in failed for: ${email} - ${error.message}`);
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password",
      });
    }

    console.log(`✅ Sign-in successful for: ${email}`);

    res.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// Sign up endpoint with rate limiting and validation
router.post("/signup", authLimiter, authValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`📝 Sign-up attempt for: ${email} from IP: ${req.ip}`);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log(`❌ Sign-up failed for: ${email} - ${error.message}`);
      return res.status(400).json({
        error: "Registration failed",
        message: error.message,
      });
    }

    console.log(`✅ Sign-up successful for: ${email}`);

    res.json({
      success: true,
      user: data.user,
      message: "Please check your email for verification link",
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// Token refresh endpoint
router.post("/refresh", authLimiter, async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        error: "Missing refresh token",
        message: "Refresh token is required",
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return res.status(401).json({
        error: "Token refresh failed",
        message: "Invalid or expired refresh token",
      });
    }

    res.json({
      success: true,
      session: data.session,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

module.exports = router;
