INSERT INTO user_metadata (id, clerk_id, email, first_name, last_name, role, email_verified)
VALUES 
(gen_random_uuid(), 'user_admin_default', 'admin@trusthire.com', 'System', 'Admin', 'ADMIN', true),
(gen_random_uuid(), 'user_worker_test', 'worker@trusthire.com', 'John', 'Worker', 'WORKER', true),
(gen_random_uuid(), 'user_employer_test', 'employer@trusthire.com', 'Jane', 'Employer', 'EMPLOYER', true)
ON CONFLICT (clerk_id) DO NOTHING