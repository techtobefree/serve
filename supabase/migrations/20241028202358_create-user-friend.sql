-- Create the user table with RLS
CREATE TABLE public.user_friend (
  user_id uuid NOT NULL,
  friend_id uuid NOT NULL,
  PRIMARY KEY (user_id, friend_id),
  friends boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Enable Row Level Security
ALTER TABLE public.user_friend ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the user table
CREATE POLICY "read_own_or_friend_user_friend" ON public.user_friend
  FOR SELECT
  USING (
    (select auth.jwt()) ->> 'user_id' = user_id::text
    OR
    (select auth.jwt()) ->> 'friend_id' = friend_id::text
  );

-- Create a policy that allows users manage their own data
CREATE POLICY "insert_own_user_friend" ON public.user_friend
  FOR INSERT
  WITH CHECK ((select auth.jwt()) ->> 'user_id' = user_id::text);

CREATE POLICY "update_own_user_friend" ON public.user_friend
  FOR UPDATE
  USING ((select auth.jwt()) ->> 'user_id' = user_id::text);

CREATE POLICY "delete_own_user_friend" ON public.user_friend
  FOR DELETE
  USING ((select auth.jwt()) ->> 'user_id' = user_id::text);


-- Create a trigger to call the update_modified_columns function
CREATE TRIGGER update_user_friend_modtime
  BEFORE UPDATE ON public.user_friend
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_columns();
