/**
 * Database Error Handling Utilities
 *
 * Provides user-friendly error messages for database operations,
 * especially for foreign key constraint violations.
 */

interface DatabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

interface ForeignKeyConstraint {
  constraint: string;
  table: string;
  referencedBy: string;
  userMessage: string;
}

/**
 * Foreign key constraint mappings for user-friendly error messages
 */
const FOREIGN_KEY_CONSTRAINTS: ForeignKeyConstraint[] = [
  {
    constraint: "games_location_id_fkey",
    table: "locations",
    referencedBy: "games",
    userMessage:
      "This location cannot be deleted because it has games scheduled. Please delete or move the associated games first.",
  },
  {
    constraint: "games_team1_id_fkey",
    table: "teams",
    referencedBy: "games",
    userMessage:
      "This team cannot be deleted because they have games scheduled. Please delete the associated games first.",
  },
  {
    constraint: "games_team2_id_fkey",
    table: "teams",
    referencedBy: "games",
    userMessage:
      "This team cannot be deleted because they have games scheduled. Please delete the associated games first.",
  },
  {
    constraint: "players_team_id_fkey",
    table: "teams",
    referencedBy: "players",
    userMessage:
      "This team cannot be deleted because it has players assigned. Please remove all players from this team first.",
  },
  {
    constraint: "team_stats_team_id_fkey",
    table: "teams",
    referencedBy: "team_stats",
    userMessage:
      "This team cannot be deleted because it has statistics recorded. Please remove the team statistics first.",
  },
  {
    constraint: "announcements_author_id_fkey",
    table: "user_profiles",
    referencedBy: "announcements",
    userMessage:
      "This user cannot be deleted because they have authored announcements. Please reassign or delete their announcements first.",
  },
  {
    constraint: "registrations_team_id_fkey",
    table: "teams",
    referencedBy: "registrations",
    userMessage:
      "This team cannot be deleted because there are registrations associated with it. Please handle the registrations first.",
  },
];

/**
 * Parse PostgreSQL error codes into user-friendly messages
 */
export function parseSupabaseError(error: any): string {
  // Handle null or undefined errors
  if (!error) {
    return "An unknown error occurred.";
  }

  // If error is already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // Extract error details from Supabase error object
  const dbError: DatabaseError = {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  };

  // Handle foreign key constraint violations (23503)
  if (dbError.code === "23503") {
    return handleForeignKeyError(dbError);
  }

  // Handle unique constraint violations (23505)
  if (dbError.code === "23505") {
    return handleUniqueConstraintError(dbError);
  }

  // Handle not null constraint violations (23502)
  if (dbError.code === "23502") {
    return handleNotNullError(dbError);
  }

  // Handle check constraint violations (23514)
  if (dbError.code === "23514") {
    return handleCheckConstraintError(dbError);
  }

  // Handle authentication/authorization errors
  if (dbError.code === "42501") {
    return "You don't have permission to perform this operation.";
  }

  // Handle row level security policy violations
  if (
    dbError.code === "42P01" ||
    dbError.message?.includes("permission denied")
  ) {
    return "Access denied. You may not have permission to access this data.";
  }

  // Handle network/connection errors
  if (error.message?.includes("fetch") || error.message?.includes("network")) {
    return "Network error. Please check your internet connection and try again.";
  }

  // Return the original message if we can't parse it, but make it more user-friendly
  if (dbError.message) {
    return `Database error: ${dbError.message}`;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Handle foreign key constraint violations with specific user messages
 */
function handleForeignKeyError(error: DatabaseError): string {
  const message = error.message || "";
  const details = error.details || "";

  // Find matching constraint from our mappings
  for (const constraint of FOREIGN_KEY_CONSTRAINTS) {
    if (
      message.includes(constraint.constraint) ||
      details.includes(constraint.referencedBy)
    ) {
      return constraint.userMessage;
    }
  }

  // Generic foreign key error message
  if (details.includes("Key is still referenced")) {
    // Try to extract the referencing table from the details
    const tableMatch = details.match(/from table "(\w+)"/);
    if (tableMatch) {
      const referencingTable = tableMatch[1];
      return `This item cannot be deleted because it is still being used by ${referencingTable}. Please remove those references first.`;
    }
  }

  return "This item cannot be deleted because it is still being used elsewhere. Please remove any dependencies first.";
}

/**
 * Handle unique constraint violations
 */
function handleUniqueConstraintError(error: DatabaseError): string {
  const message = error.message || "";

  // Common unique constraint patterns
  if (message.includes("email")) {
    return "This email address is already in use. Please use a different email.";
  }

  if (message.includes("name")) {
    return "This name is already taken. Please choose a different name.";
  }

  if (message.includes("username")) {
    return "This username is already taken. Please choose a different username.";
  }

  return "This value already exists. Please use a unique value.";
}

/**
 * Handle not null constraint violations
 */
function handleNotNullError(error: DatabaseError): string {
  const message = error.message || "";

  // Try to extract the column name
  const columnMatch = message.match(/column "(\w+)"/);
  if (columnMatch) {
    const columnName = columnMatch[1].replace(/_/g, " ");
    return `${
      columnName.charAt(0).toUpperCase() + columnName.slice(1)
    } is required and cannot be empty.`;
  }

  return "A required field is missing. Please fill in all required information.";
}

/**
 * Handle check constraint violations
 */
function handleCheckConstraintError(error: DatabaseError): string {
  const message = error.message || "";

  if (message.includes("email")) {
    return "Please enter a valid email address.";
  }

  if (message.includes("phone")) {
    return "Please enter a valid phone number.";
  }

  if (message.includes("url")) {
    return "Please enter a valid URL.";
  }

  if (message.includes("gradient")) {
    return "The selected color theme is not valid. Please choose from the available color options.";
  }

  if (message.includes("sport_type") && message.includes("kickball")) {
    return "Sport type must be either 'kickball' or 'dodgeball'.";
  }

  return "The provided data does not meet the required format or constraints.";
}

/**
 * Get a user-friendly action suggestion based on the error
 */
export function getErrorActionSuggestion(error: any): string | null {
  if (!error || typeof error === "string") return null;

  const dbError: DatabaseError = {
    code: error.code,
    message: error.message,
    details: error.details,
  };

  // Foreign key constraint suggestions
  if (dbError.code === "23503") {
    const details = dbError.details || "";

    if (details.includes("games")) {
      return "Go to Game Management to delete or reassign the related games.";
    }

    if (details.includes("players")) {
      return "Go to Player Management to remove players from this team.";
    }

    if (details.includes("announcements")) {
      return "Go to Announcements to reassign or delete the related announcements.";
    }

    if (details.includes("registrations")) {
      return "Go to Registration Management to handle the related registrations.";
    }
  }

  return null;
}
