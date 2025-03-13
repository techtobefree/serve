-- Seed data for the admnin table
INSERT INTO public.admin_user (id, user_id, role, created_by)
VALUES 
  ('00000000-0000-0000-0000-0000ad313001', '0c62f531-1c21-467b-aa7f-94ab684b50c8', 'admin', '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-0000ad313002', '00000000-0000-0000-0000-00000c53c001', 'admin', '00000000-0000-0000-0000-00000c53c001')
ON CONFLICT (id) 
DO UPDATE SET 
  user_id = EXCLUDED.user_id,
  role = EXCLUDED.role,
  created_by = EXCLUDED.created_by;

-- Seed data for the profile table
INSERT INTO public.profile (user_id, handle, created_by)
VALUES 
  ('0c62f531-1c21-467b-aa7f-94ab684b50c8', 'demo_profile1', '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-00000c53c001', 'demo_profile2', '00000000-0000-0000-0000-00000c53c002')
ON CONFLICT (user_id) 
DO UPDATE SET 
  handle = EXCLUDED.handle,
  created_by = EXCLUDED.created_by;

-- Seed data for the project table
INSERT INTO public.project (id, owner_id, name, description, published, created_by)
VALUES 
  ('00000000-0000-0000-0000-00bb0b3b1001', '0c62f531-1c21-467b-aa7f-94ab684b50c8', 'Is My Demo Project', 'A sample project for testing', false, '0c62f531-1c21-467b-aa7f-94ab684b50c8'),
  ('00000000-0000-0000-0000-00bb0b3b1002', '00000000-0000-0000-0000-00000c53c001', 'Was My Demo Project', 'A sample project for testing', false, '0c62f531-1c21-467b-aa7f-94ab684b50c8'),
  ('00000000-0000-0000-0000-00bb0b3b1003', '00000000-0000-0000-0000-00000c53c002', 'Not My Demo Project', 'Another sample project', false, '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-00bb0b3b1004', '00000000-0000-0000-0000-00000c53c002', 'Published Demo Project', 'Hidden sample project', true, '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-00bb0b3b1005', '00000000-0000-0000-0000-00000c53c002', 'Another Published Demo Project', 'Hidden sample project 2', true, '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-00bb0b3b1006', '0c62f531-1c21-467b-aa7f-94ab684b50c8', 'My Published Demo Project', 'Hidden sample project 3', true, '00000000-0000-0000-0000-00000c53c001')
ON CONFLICT (id) 
DO UPDATE SET 
  owner_id = EXCLUDED.owner_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  published = EXCLUDED.published,
  created_by = EXCLUDED.created_by;

-- Seed data for the team table
INSERT INTO public.team (id, owner_id, name, description, published, created_by)
VALUES 
  ('00000000-0000-0000-0000-00000d34d001', '0c62f531-1c21-467b-aa7f-94ab684b50c8', 'Is My Demo Team', 'A sample team', false, '0c62f531-1c21-467b-aa7f-94ab684b50c8'),
  ('00000000-0000-0000-0000-00000d34d002', '00000000-0000-0000-0000-00000c53c001', 'Was My Demo Team', 'A sample team', false, '0c62f531-1c21-467b-aa7f-94ab684b50c8'),
  ('00000000-0000-0000-0000-00000d34d003', '00000000-0000-0000-0000-00000c53c001', 'Not my Demo Team', 'Another sample team', false, '00000000-0000-0000-0000-00000c53c001')
ON CONFLICT (id) 
DO UPDATE SET 
  owner_id = EXCLUDED.owner_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  published = EXCLUDED.published,
  created_by = EXCLUDED.created_by;

