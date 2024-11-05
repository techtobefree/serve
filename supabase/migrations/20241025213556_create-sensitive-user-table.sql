-- Create the user table with RLS
CREATE TABLE public.sensitive_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  iss text, -- Auth0 issuer
  sub text, -- Auth0 subject
  email text,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.sensitive_user ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own data
CREATE POLICY "read_own_sensitive_user" ON public.sensitive_user
  FOR SELECT
  USING (
    (select auth.jwt()) ->> 'user_id' = user_id::text
  );

-- Create a policy that allows users manage their own data
CREATE POLICY "insert_own_sensitive_user" ON public.sensitive_user
  FOR INSERT
  WITH CHECK ((select auth.jwt()) ->> 'user_id' = user_id::text);

CREATE POLICY "update_own_sensitive_user" ON public.sensitive_user
  FOR UPDATE
  USING ((select auth.jwt()) ->> 'user_id' = user_id::text);

CREATE POLICY "delete_own_sensitive_user" ON public.sensitive_user
  FOR DELETE
  USING ((select auth.jwt()) ->> 'user_id' = user_id::text);

-- Create an index on the user_id column for better performance
CREATE INDEX user_user_id_idx ON public.sensitive_user(user_id);

-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_user_modtime
  BEFORE UPDATE ON public.sensitive_user
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();
