const { body, validationResult } = require("express-validator");

// Email validation
const validateEmail = () =>
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email is too long");

// Password validation
const validatePassword = () =>
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );

// General string validation with sanitization
const validateString = (field, maxLength = 1000) =>
  body(field)
    .trim()
    .escape()
    .isLength({ max: maxLength })
    .withMessage(`${field} is too long`);

// Sanitize HTML content
const validateHtmlContent = field =>
  body(field)
    .customSanitizer(value => {
      // Remove potentially dangerous HTML tags and attributes
      return value
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "")
        .replace(/on\w+="[^"]*"/gi, "")
        .replace(/javascript:/gi, "");
    })
    .isLength({ max: 5000 })
    .withMessage("Content is too long");

// Check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
    }));

    return res.status(400).json({
      error: "Validation failed",
      details: errorMessages,
    });
  }
  next();
};

// Common validation chains
const authValidation = [
  validateEmail(),
  validatePassword(),
  handleValidationErrors,
];

const signInValidation = [
  validateEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const announcementValidation = [
  validateString("title", 200),
  validateHtmlContent("content"),
  body("priority")
    .isIn(["low", "normal", "high", "urgent"])
    .withMessage("Invalid priority"),
  body("type")
    .isIn(["general", "game", "registration", "maintenance", "event"])
    .withMessage("Invalid type"),
  handleValidationErrors,
];

module.exports = {
  validateEmail,
  validatePassword,
  validateString,
  validateHtmlContent,
  handleValidationErrors,
  authValidation,
  signInValidation,
  announcementValidation,
};
