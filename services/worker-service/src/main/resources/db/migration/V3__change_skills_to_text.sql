-- Drop the dependent table if it was created by Hibernate (optional but safe)
DROP TABLE IF EXISTS worker_skills;

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worker_profiles' AND column_name='skills') THEN
        -- If it's already TEXT[], transform it to TEXT
        ALTER TABLE worker_profiles ALTER COLUMN skills TYPE TEXT USING array_to_string(skills, ', ');
    ELSE
        -- If it's missing entirely (e.g. baseline issue), add it as TEXT
        ALTER TABLE worker_profiles ADD COLUMN skills TEXT;
    END IF;
END $$;
