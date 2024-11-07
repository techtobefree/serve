-- Create the profile table with RLS
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  handle text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the profile table
CREATE POLICY "read_profile" ON public.profile
  FOR SELECT
  USING (true);

-- Create a policy that allows insert, update, and delete for the admin
CREATE POLICY "insert_own_or_admin_profile" ON public.profile
  FOR INSERT
  WITH CHECK (
    (select auth.jwt()) ->> 'profile_id' = id::text
    OR
    (select auth.jwt()) ->> 'role' = 'admin'
  );

CREATE POLICY "update_own_or_admin_profile" ON public.profile
  FOR UPDATE
  USING (
    (select auth.jwt()) ->> 'profile_id' = id::text
    OR
    (select auth.jwt()) ->> 'role' = 'admin'
  );

CREATE POLICY "delete_own_or_admin_profile" ON public.profile
  FOR DELETE
  USING (
    (select auth.jwt()) ->> 'profile_id' = id::text
    OR
    (select auth.jwt()) ->> 'role' = 'admin'
  );

-- Create an index on the handle column for better performance
CREATE INDEX profile_handle_idx ON public.profile(handle);

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_profile_modtime
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();

-- Add to claim JWT
create or replace function public.auth_custom_claims()
returns jsonb
language plpgsql
as $$
  declare
    claims jsonb;
  begin
    claims := jsonb_build_object('role', (select role from public.admin_user where id = auth.uid()));
    return claims;
  end;
$$;
