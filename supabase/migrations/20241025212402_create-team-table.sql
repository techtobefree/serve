-- Create the team table with RLS
CREATE TABLE public.team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  unlisted boolean DEFAULT false,
  lead_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows read access to all users for non-unlisted teams
CREATE POLICY "read_non_unlisted_team" ON public.team
  FOR SELECT
  USING (
    true
    -- TODO: should only be able to see if you are in the team, or it is not unlisted
    -- unlisted = false
    -- OR
    -- auth.uid() = admin_id
  );

-- Create a policy that allows insert, update, and delete for the admin
CREATE POLICY "insert_own_or_admin_team" ON public.team
  FOR INSERT
  WITH CHECK (
    auth.uid() = admin_id OR (auth.role() = 'admin')
  );

CREATE POLICY "update_own_or_admin_team" ON public.team
  FOR UPDATE
  USING (
    auth.uid() = admin_id OR (auth.role() = 'admin')
  );

CREATE POLICY "delete_own_or_admin_team" ON public.team
  FOR DELETE
  USING (
    auth.uid() = admin_id OR (auth.role() = 'admin')
  );

-- Create an index on the admin column for better performance
CREATE INDEX team_admin_id_idx ON public.team(admin_id);

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_team_modtime
  BEFORE UPDATE ON public.team
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();
