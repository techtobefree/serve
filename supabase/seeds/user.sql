-- Seed data for the user table
INSERT INTO public.user (id, handle, created_by)
VALUES 
  ('00000000-0000-0000-0000-00000c53c001', 'demo_user1', '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-00000c53c002', 'demo_user2', '00000000-0000-0000-0000-00000c53c002')
ON CONFLICT (id) 
DO UPDATE SET 
  handle = EXCLUDED.handle,
  created_by = EXCLUDED.created_by;
