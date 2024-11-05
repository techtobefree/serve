-- Seed data for the project table
INSERT INTO public.project (id, admin_id, name, description, unlisted, created_by)
VALUES 
  ('00000000-0000-0000-0000-00bb0b3b1001', '00000000-0000-0000-0000-00000c53c001', 'Demo Project 1', 'A sample project for testing', false, '00000000-0000-0000-0000-00000c53c001'),
  ('00000000-0000-0000-0000-00bb0b3b1002', '00000000-0000-0000-0000-00000c53c002', 'Demo Project 2', 'Another sample project', false, '00000000-0000-0000-0000-00000c53c001')
ON CONFLICT (id) 
DO UPDATE SET 
  admin_id = EXCLUDED.admin_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  unlisted = EXCLUDED.unlisted,
  created_by = EXCLUDED.created_by;
