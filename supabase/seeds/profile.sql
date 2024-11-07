-- Seed data for the profile table
INSERT INTO public.profile (id, user_id, handle, created_by)
VALUES 
  ('00000000-0000-0000-0000-009909113001', '0c62f531-1c21-467b-aa7f-94ab684b50c8', 'demo_profile1', '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-009909113002', '00000000-0000-0000-0000-00000c53c001', 'demo_profile2', '00000000-0000-0000-0000-00000c53c002')
ON CONFLICT (id) 
DO UPDATE SET 
  user_id = EXCLUDED.user_id,
  handle = EXCLUDED.handle,
  created_by = EXCLUDED.created_by;