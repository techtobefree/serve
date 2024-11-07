-- Seed data for the project table
INSERT INTO public.project (id, admin_id, name, description, unlisted, created_by)
VALUES 
  ('00000000-0000-0000-0000-00bb0b3b1001', '0c62f531-1c21-467b-aa7f-94ab684b50c8', 'Is My Demo Project', 'A sample project for testing', false, '0c62f531-1c21-467b-aa7f-94ab684b50c8'),
  ('00000000-0000-0000-0000-00bb0b3b1002', '00000000-0000-0000-0000-00000c53c001', 'Was My Demo Project', 'A sample project for testing', false, '0c62f531-1c21-467b-aa7f-94ab684b50c8'),
  ('00000000-0000-0000-0000-00bb0b3b1003', '00000000-0000-0000-0000-00000c53c002', 'No Demo Project', 'Another sample project', false, '00000000-0000-0000-0000-00000c53c001')
ON CONFLICT (id) 
DO UPDATE SET 
  admin_id = EXCLUDED.admin_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  unlisted = EXCLUDED.unlisted,
  created_by = EXCLUDED.created_by;
