-- Create the user table with RLS
CREATE TABLE public.user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the user table
CREATE POLICY "read_user" ON public.user
  FOR SELECT
  USING (true);

-- Create a policy that allows insert, update, and delete for the admin
CREATE POLICY "insert_own_or_admin_user" ON public.user
  FOR INSERT
  WITH CHECK (
    (select auth.jwt()) ->> 'user_id' = id::text
    OR
    (select auth.jwt()) ->> 'role' = 'admin'
  );

CREATE POLICY "update_own_or_admin_user" ON public.user
  FOR UPDATE
  USING (
    (select auth.jwt()) ->> 'user_id' = id::text
    OR
    (select auth.jwt()) ->> 'role' = 'admin'
  );

CREATE POLICY "delete_own_or_admin_user" ON public.user
  FOR DELETE
  USING (
    (select auth.jwt()) ->> 'user_id' = id::text
    OR
    (select auth.jwt()) ->> 'role' = 'admin'
  );

-- Create an index on the handle column for better performance
CREATE INDEX user_handle_idx ON public.user(handle);

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_user_modtime
  BEFORE UPDATE ON public.user
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();
