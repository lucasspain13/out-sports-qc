-- Update teams table gradient constraint to support all 12 colors
-- This migration updates the existing constraint to include the new color options

-- First, drop the existing constraint
ALTER TABLE public.teams DROP CONSTRAINT IF EXISTS teams_gradient_check;

-- Add the new constraint with all 12 colors
ALTER TABLE public.teams ADD CONSTRAINT teams_gradient_check CHECK (
  gradient = ANY (
    ARRAY[
      'orange'::text,
      'green'::text,
      'blue'::text,
      'pink'::text,
      'white'::text,
      'black'::text,
      'gray'::text,
      'brown'::text,
      'purple'::text,
      'yellow'::text,
      'red'::text,
      'cyan'::text
    ]
  )
);

-- Add comment for documentation
COMMENT ON CONSTRAINT teams_gradient_check ON public.teams IS 'Ensures gradient field contains only valid color values for team themes';
