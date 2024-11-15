-- Create the project table with RLS
CREATE TABLE public.project (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  unlisted boolean DEFAULT false,
  lead_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows read access to all users for non-unlisted projects
CREATE POLICY "read_non_unlisted_project" ON public.project
  FOR SELECT TO authenticated, anon
  USING (
    true
    -- TODO: should only be able to see if you are in the project, or it is not unlisted
    -- unlisted = false
    -- OR
    -- auth.uid() = owner_id
  );

-- Create a policy that allows insert, update, and delete for the admin
CREATE POLICY "insert_own_or_admin_project" ON public.project
  FOR INSERT TO authenticated
  WITH CHECK (
    ((select auth.uid()) = owner_id) OR ((select auth.role()) = 'admin')
  );

CREATE POLICY "update_own_or_admin_project" ON public.project
  FOR UPDATE TO authenticated
  USING (
    ((select auth.uid()) = owner_id) OR ((select auth.role()) = 'admin')
  );

CREATE POLICY "delete_own_or_admin_project" ON public.project 
  FOR DELETE TO authenticated
  USING (
    ((select auth.uid()) = owner_id) OR ((select auth.role()) = 'admin')
  );

-- Create an index on the admin column for better performance
CREATE INDEX project_owner_id_idx ON public.project(owner_id);

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_project_modtime
  BEFORE UPDATE ON public.project
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();
