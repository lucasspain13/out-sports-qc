-- One-time migration to restore purple teams that may have been converted to pink
-- Run this AFTER updating the database constraint to allow purple

-- Note: This is a manual restoration. You may need to manually update any teams
-- that should be purple but were automatically converted to pink.
-- You can do this through the admin interface or by running:

-- UPDATE teams SET gradient = 'purple' WHERE id = 'team-id-here' AND gradient = 'pink';

-- If you know specific team IDs that should be purple, uncomment and run:
-- UPDATE teams SET gradient = 'purple' WHERE id IN ('team1-id', 'team2-id') AND gradient = 'pink';

SELECT 'Purple color support restored. You can now manually update any teams that should be purple.' AS message;
