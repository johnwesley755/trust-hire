-- ==============================================================================
-- TrustHyre: 100% Dynamic Onboarding & Cascading Location Hierarchy Migration
-- Compatible with PostgreSQL 14+, Supabase, and AWS RDS
-- Idempotent script: Safe to run multiple times in Local and Production
-- ==============================================================================

-- 1. Create location_master Table
CREATE TABLE IF NOT EXISTS location_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100),
    locality_name VARCHAR(150) NOT NULL,
    locality_type VARCHAR(50) NOT NULL, -- CORPORATION, MUNICIPALITY, TOWN_PANCHAYAT, TALUK, VILLAGE
    pincode VARCHAR(10),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_loc_state ON location_master(state);
CREATE INDEX IF NOT EXISTS idx_loc_state_district ON location_master(state, district);
CREATE INDEX IF NOT EXISTS idx_loc_district_locality ON location_master(district, locality_name);
CREATE INDEX IF NOT EXISTS idx_loc_pincode ON location_master(pincode);

-- 2. Create onboarding_master_options Table
CREATE TABLE IF NOT EXISTS onboarding_master_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- EDUCATION, DEGREE, SCHOOL_MEDIUM, ENGLISH_LEVEL, DISABILITY_TYPE, DISABILITY_AREA, DISABILITY_REASON, LANGUAGE, ROLE, SKILL, EXPERIENCE_LEVEL
    option_key VARCHAR(100) NOT NULL,
    label_en VARCHAR(255) NOT NULL,
    label_ta VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_onboard_cat_key UNIQUE (category, option_key)
);

CREATE INDEX IF NOT EXISTS idx_onboard_category_active ON onboarding_master_options(category, is_active, sort_order);

-- 3. Add New Profile & Location Columns to worker_profiles
ALTER TABLE worker_profiles
    ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
    ADD COLUMN IF NOT EXISTS is_differently_abled BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS disability_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS disability_area VARCHAR(100),
    ADD COLUMN IF NOT EXISTS disability_reason VARCHAR(100),
    ADD COLUMN IF NOT EXISTS state VARCHAR(100),
    ADD COLUMN IF NOT EXISTS district VARCHAR(100),
    ADD COLUMN IF NOT EXISTS taluk VARCHAR(100),
    ADD COLUMN IF NOT EXISTS town_panchayat VARCHAR(150),
    ADD COLUMN IF NOT EXISTS pincode VARCHAR(10),
    ADD COLUMN IF NOT EXISTS work_experience_type VARCHAR(20) DEFAULT 'FRESHER';

CREATE INDEX IF NOT EXISTS idx_worker_profiles_state_district ON worker_profiles(state, district);

-- ==============================================================================
-- 4. Seed onboarding_master_options
-- ==============================================================================

INSERT INTO onboarding_master_options (category, option_key, label_en, label_ta, sort_order) VALUES
-- Education Levels
('EDUCATION', 'BELOW_10TH', 'Below 10th Standard', '10-ஆம் வகுப்புக்கு கீழ்', 1),
('EDUCATION', '10TH_PASS', '10th Standard (SSLC)', '10-ஆம் வகுப்பு தேர்ச்சி', 2),
('EDUCATION', '12TH_PASS', '12th Standard (HSC)', '12-ஆம் வகுப்பு தேர்ச்சி', 3),
('EDUCATION', 'ITI', 'ITI / Vocational Training', 'ஐடிஐ / தொழிற்பயிற்சி', 4),
('EDUCATION', 'DIPLOMA', 'Diploma / Polytechnic', 'டிப்ளமோ / பாலிடெக்னிக்', 5),
('EDUCATION', 'GRADUATE', 'Graduate / Bachelor''s Degree', 'பட்டதாரி (UG)', 6),
('EDUCATION', 'POST_GRADUATE', 'Post Graduate / Master''s Degree', 'முதுகலை பட்டதாரி (PG)', 7),
('EDUCATION', 'NO_FORMAL', 'No Formal Education', 'முறைசாரா கல்வி', 8),

-- Degrees & Disciplines
('DEGREE', 'BE_BTECH', 'B.E / B.Tech (Engineering)', 'பி.இ / பி.டெக்', 1),
('DEGREE', 'BSC', 'B.Sc (Science / Computer)', 'பி.எஸ்.சி', 2),
('DEGREE', 'BCOM', 'B.Com (Commerce / Accounts)', 'பி.காம்', 3),
('DEGREE', 'BA', 'B.A (Arts / Literature)', 'பி.ஏ', 4),
('DEGREE', 'BBA_BCA', 'BBA / BCA', 'பிபிஏ / பிசிஏ', 5),
('DEGREE', 'DIP_MECH', 'Diploma in Mechanical', 'டிப்ளமோ மெக்கானிக்கல்', 6),
('DEGREE', 'DIP_EEE_ECE', 'Diploma in EEE / ECE', 'டிப்ளமோ இஇஇ / இசிஇ', 7),
('DEGREE', 'DIP_CIVIL', 'Diploma in Civil Engineering', 'டிப்ளமோ சிவில்', 8),
('DEGREE', 'ITI_FITTER', 'ITI Fitter / Turner / Machinist', 'ஐடிஐ ஃபிட்டர் / மெஷினிஸ்ட்', 9),
('DEGREE', 'ITI_ELECTRICIAN', 'ITI Electrician / Wireman', 'ஐடிஐ எலக்ட்ரீசியன்', 10),
('DEGREE', 'ITI_WELDER', 'ITI Welder / Fabrication', 'ஐடிஐ வெல்டர்', 11),
('DEGREE', 'OTHER_DEGREE', 'Other Degree / Certification', 'பிற படிப்பு', 12),

-- School Mediums
('SCHOOL_MEDIUM', 'TAMIL', 'Tamil Medium', 'தமிழ் வழி கல்வி', 1),
('SCHOOL_MEDIUM', 'ENGLISH', 'English Medium', 'ஆங்கில வழி கல்வி', 2),
('SCHOOL_MEDIUM', 'TELUGU', 'Telugu Medium', 'தெலுங்கு வழி கல்வி', 3),
('SCHOOL_MEDIUM', 'MALAYALAM', 'Malayalam Medium', 'மலையாள வழி கல்வி', 4),
('SCHOOL_MEDIUM', 'HINDI', 'Hindi Medium', 'இந்தி வழி கல்வி', 5),
('SCHOOL_MEDIUM', 'OTHER', 'Other Medium', 'பிற மொழி வழி கல்வி', 6),

-- English Proficiency
('ENGLISH_LEVEL', 'NONE', 'No English (Native Language Only)', 'ஆங்கிலம் தெரியாது', 1),
('ENGLISH_LEVEL', 'BASIC', 'Basic (Can understand words & signs)', 'அடிப்படை ஆங்கிலம்', 2),
('ENGLISH_LEVEL', 'INTERMEDIATE', 'Intermediate (Can converse simply)', 'சுமாராக பேச தெரியும்', 3),
('ENGLISH_LEVEL', 'FLUENT', 'Fluent / Professional', 'நன்றாக பேச தெரியும்', 4),

-- Inclusivity: Disability Types
('DISABILITY_TYPE', 'LOCOMOTOR', 'Locomotor Disability / Movement', 'உடலியக்க குறைபாடு', 1),
('DISABILITY_TYPE', 'VISUAL_LOW', 'Low Vision / Partial Sight', 'பார்வை குறைபாடு', 2),
('DISABILITY_TYPE', 'HEARING_HARD', 'Hard of Hearing / Partial Hearing', 'கேட்கும் திறன் குறைபாடு', 3),
('DISABILITY_TYPE', 'SPEECH', 'Speech and Language Disability', 'பேச்சுத்திறன் குறைபாடு', 4),
('DISABILITY_TYPE', 'INTELLECTUAL', 'Intellectual / Learning Disability', 'கற்றல் குறைபாடு', 5),
('DISABILITY_TYPE', 'OTHER', 'Other Physical Challenge', 'பிற உடல் சவால்', 6),

-- Inclusivity: Disability Affected Areas
('DISABILITY_AREA', 'LOWER_LIMB', 'Legs / Lower Limb', 'கால்கள்', 1),
('DISABILITY_AREA', 'UPPER_LIMB', 'Hands / Arms / Upper Limb', 'கைகள்', 2),
('DISABILITY_AREA', 'SPINE', 'Spine / Posture / Back', 'முதுகுத்தண்டு', 3),
('DISABILITY_AREA', 'EYES', 'Eyes / Vision', 'கண்கள் / பார்வை', 4),
('DISABILITY_AREA', 'EARS', 'Ears / Hearing', 'காதுகள் / கேட்டல்', 5),
('DISABILITY_AREA', 'VOCAL', 'Vocal / Speech', 'குரல் / பேச்சு', 6),
('DISABILITY_AREA', 'FULL_BODY', 'Multiple Areas / Full Body', 'முழு உடல்', 7),

-- Inclusivity: Disability Reasons
('DISABILITY_REASON', 'BIRTH', 'From Birth / Congenital', 'பிறவியிலேயே', 1),
('DISABILITY_REASON', 'ACCIDENT', 'Accident / Workplace Injury', 'விபத்து காரணமாக', 2),
('DISABILITY_REASON', 'ILLNESS', 'Illness / Medical Condition', 'நோய் / உடல்நலக்குறைவு', 3),
('DISABILITY_REASON', 'AGE', 'Age-Related', 'வயது மூப்பு காரணமாக', 4),
('DISABILITY_REASON', 'OTHER', 'Other / Prefer not to say', 'பிற காரணங்கள்', 5),

-- Languages Known
('LANGUAGE', 'TAMIL', 'Tamil (தமிழ்)', 'தமிழ்', 1),
('LANGUAGE', 'ENGLISH', 'English', 'ஆங்கிலம்', 2),
('LANGUAGE', 'HINDI', 'Hindi (हिन्दी)', 'இந்தி', 3),
('LANGUAGE', 'TELUGU', 'Telugu (తెలుగు)', 'தெலுங்கு', 4),
('LANGUAGE', 'MALAYALAM', 'Malayalam (മലയാളം)', 'மலையாளம்', 5),
('LANGUAGE', 'KANNADA', 'Kannada (ಕನ್ನಡ)', 'கன்னடம்', 6),
('LANGUAGE', 'URDU', 'Urdu (اردو)', 'உருது', 7),
('LANGUAGE', 'BENGALI', 'Bengali (বাংলা)', 'வங்காளம்', 8),

-- Experience Levels
('EXPERIENCE_LEVEL', 'FRESHER', 'Fresher (0 years / Looking for first job)', 'புதியவர் (Fresher)', 1),
('EXPERIENCE_LEVEL', '1_2_YEARS', '1 - 2 Years', '1 - 2 ஆண்டுகள்', 2),
('EXPERIENCE_LEVEL', '3_5_YEARS', '3 - 5 Years', '3 - 5 ஆண்டுகள்', 3),
('EXPERIENCE_LEVEL', '5_PLUS_YEARS', '5+ Years (Experienced)', '5+ ஆண்டுகள் அனுபவம்', 4),

-- Popular Job Roles
('ROLE', 'DRIVER', 'Driver (Car / Van / Truck / Auto)', 'டிரைவர்', 1),
('ROLE', 'ELECTRICIAN', 'Electrician / Wireman', 'எலக்ட்ரீசியன்', 2),
('ROLE', 'PLUMBER', 'Plumber / Pipe Fitter', 'பிளம்பர்', 3),
('ROLE', 'CARPENTER', 'Carpenter / Wood Worker', 'தச்சர்', 4),
('ROLE', 'PAINTER', 'Painter (House / Commercial)', 'பெயிண்டர்', 5),
('ROLE', 'WELDER', 'Welder / Fabricator', 'வெல்டர்', 6),
('ROLE', 'MECHANIC', 'Auto / Two-Wheeler Mechanic', 'மெக்கானிக்', 7),
('ROLE', 'AC_TECH', 'AC & Appliance Technician', 'ஏசி டெக்னீசியன்', 8),
('ROLE', 'TAILOR', 'Tailor / Garment Worker', 'தையல் கலைஞர்', 9),
('ROLE', 'COOK', 'Cook / Chef / Kitchen Helper', 'சமையல் கலைஞர்', 10),
('ROLE', 'HOUSEKEEPING', 'Housekeeping / Cleaning Staff', 'துப்புரவு பணியாளர்', 11),
('ROLE', 'SECURITY_GUARD', 'Security Guard', 'பாதுகாவலர்', 12),
('ROLE', 'DELIVERY_PARTNER', 'Delivery Partner / Courier', 'டெலிவரி நபர்', 13),
('ROLE', 'WAREHOUSE_HELPER', 'Warehouse Loader / Helper', 'கிடங்கு உதவியாளர்', 14),
('ROLE', 'MASON', 'Mason / Construction Worker', 'கொத்தனார் / கட்டுமான பணியாளர்', 15),
('ROLE', 'CNC_OPERATOR', 'CNC / Lathe Machine Operator', 'இயந்திர ஆபரேட்டர்', 16),
('ROLE', 'OFFICE_ASSISTANT', 'Office Assistant / Peon / Attendant', 'அலுவலக உதவியாளர்', 17),
('ROLE', 'DATA_ENTRY', 'Data Entry / Computer Operator', 'கம்ப்யூட்டர் ஆபரேட்டர்', 18)
ON CONFLICT (category, option_key) DO UPDATE SET
    label_en = EXCLUDED.label_en,
    label_ta = EXCLUDED.label_ta,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- ==============================================================================
-- 5. Seed location_master: All 36 States & UTs of India
-- ==============================================================================

-- We seed the state master entries (headquarters/capital)
INSERT INTO location_master (state, district, taluk, locality_name, locality_type, pincode) VALUES
('Tamil Nadu', 'Chennai', 'Fort Tondiarpet', 'Chennai City (GPO)', 'CORPORATION', '600001'),
('Karnataka', 'Bengaluru Urban', 'Bengaluru North', 'Bengaluru Central', 'CORPORATION', '560001'),
('Kerala', 'Thiruvananthapuram', 'Thiruvananthapuram', 'Thiruvananthapuram Central', 'CORPORATION', '695001'),
('Andhra Pradesh', 'Visakhapatnam', 'Visakhapatnam Urban', 'Visakhapatnam City', 'CORPORATION', '530001'),
('Telangana', 'Hyderabad', 'Hyderabad', 'Hyderabad GPO', 'CORPORATION', '500001'),
('Maharashtra', 'Mumbai', 'Mumbai City', 'Mumbai Fort GPO', 'CORPORATION', '400001'),
('Delhi NCR', 'New Delhi', 'New Delhi', 'Connaught Place', 'CORPORATION', '110001'),
('Gujarat', 'Ahmedabad', 'Ahmedabad City', 'Ahmedabad GPO', 'CORPORATION', '380001'),
('Rajasthan', 'Jaipur', 'Jaipur', 'Jaipur City', 'CORPORATION', '302001'),
('Uttar Pradesh', 'Lucknow', 'Lucknow', 'Lucknow GPO', 'CORPORATION', '226001'),
('West Bengal', 'Kolkata', 'Kolkata', 'Kolkata GPO', 'CORPORATION', '700001'),
('Bihar', 'Patna', 'Patna', 'Patna GPO', 'CORPORATION', '800001'),
('Madhya Pradesh', 'Bhopal', 'Bhopal', 'Bhopal City', 'CORPORATION', '462001'),
('Punjab', 'Ludhiana', 'Ludhiana Central', 'Ludhiana City', 'CORPORATION', '141001'),
('Haryana', 'Gurugram', 'Gurugram', 'Gurugram Sector 14', 'CORPORATION', '122001'),
('Odisha', 'Bhubaneswar', 'Bhubaneswar', 'Bhubaneswar City', 'CORPORATION', '751001'),
('Assam', 'Kamrup Metropolitan', 'Guwahati', 'Guwahati GPO', 'CORPORATION', '781001'),
('Jharkhand', 'Ranchi', 'Ranchi', 'Ranchi GPO', 'CORPORATION', '834001'),
('Chhattisgarh', 'Raipur', 'Raipur', 'Raipur City', 'CORPORATION', '492001'),
('Uttarakhand', 'Dehradun', 'Dehradun', 'Dehradun City', 'CORPORATION', '248001'),
('Goa', 'North Goa', 'Tiswadi', 'Panaji', 'MUNICIPALITY', '403001'),
('Himachal Pradesh', 'Shimla', 'Shimla Urban', 'Shimla GPO', 'CORPORATION', '171001'),
('Tripura', 'West Tripura', 'Agartala', 'Agartala GPO', 'CORPORATION', '799001'),
('Manipur', 'Imphal West', 'Imphal', 'Imphal GPO', 'MUNICIPALITY', '795001'),
('Meghalaya', 'East Khasi Hills', 'Shillong', 'Shillong GPO', 'MUNICIPALITY', '793001'),
('Nagaland', 'Kohima', 'Kohima', 'Kohima City', 'MUNICIPALITY', '797001'),
('Arunachal Pradesh', 'Papum Pare', 'Itanagar', 'Itanagar', 'MUNICIPALITY', '791111'),
('Mizoram', 'Aizawl', 'Aizawl', 'Aizawl GPO', 'MUNICIPALITY', '796001'),
('Sikkim', 'Gangtok', 'Gangtok', 'Gangtok GPO', 'MUNICIPALITY', '737101'),
('Puducherry', 'Puducherry', 'Puducherry', 'Puducherry Town', 'MUNICIPALITY', '605001'),
('Chandigarh', 'Chandigarh', 'Chandigarh', 'Sector 17 Chandigarh', 'CORPORATION', '160017'),
('Jammu and Kashmir', 'Srinagar', 'Srinagar', 'Srinagar GPO', 'CORPORATION', '190001'),
('Ladakh', 'Leh', 'Leh', 'Leh Town', 'MUNICIPALITY', '194101'),
('Andaman and Nicobar Islands', 'South Andaman', 'Port Blair', 'Port Blair GPO', 'MUNICIPALITY', '744101'),
('Dadra and Nagar Haveli and Daman and Diu', 'Daman', 'Daman', 'Daman Town', 'MUNICIPALITY', '396210'),
('Lakshadweep', 'Lakshadweep', 'Kavaratti', 'Kavaratti Island', 'TOWN_PANCHAYAT', '682555')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 6. Seed location_master: Comprehensive Tamil Nadu (All 38 Districts, Taluks, Town Panchayats)
-- ==============================================================================

INSERT INTO location_master (state, district, taluk, locality_name, locality_type, pincode) VALUES
-- 1. Chennai District (All key Zones & Taluks)
('Tamil Nadu', 'Chennai', 'Tondiarpet', 'Royapuram', 'CORPORATION', '600013'),
('Tamil Nadu', 'Chennai', 'Tondiarpet', 'Tondiarpet', 'CORPORATION', '600081'),
('Tamil Nadu', 'Chennai', 'Fort Tondiarpet', 'Parrys / George Town', 'CORPORATION', '600001'),
('Tamil Nadu', 'Chennai', 'Egmore', 'Egmore', 'CORPORATION', '600008'),
('Tamil Nadu', 'Chennai', 'Purasawalkam', 'Kilpauk', 'CORPORATION', '600010'),
('Tamil Nadu', 'Chennai', 'Ayanavaram', 'Ayanavaram', 'CORPORATION', '600023'),
('Tamil Nadu', 'Chennai', 'Aminjikarai', 'Anna Nagar West', 'CORPORATION', '600040'),
('Tamil Nadu', 'Chennai', 'Mambalam', 'T. Nagar', 'CORPORATION', '600017'),
('Tamil Nadu', 'Chennai', 'Mambalam', 'West Mambalam', 'CORPORATION', '600033'),
('Tamil Nadu', 'Chennai', 'Guindy', 'Guindy Industrial Estate', 'CORPORATION', '600032'),
('Tamil Nadu', 'Chennai', 'Mylapore', 'Mylapore / Santhome', 'CORPORATION', '600004'),
('Tamil Nadu', 'Chennai', 'Mylapore', 'Alwarpet', 'CORPORATION', '600018'),
('Tamil Nadu', 'Chennai', 'Velachery', 'Velachery', 'CORPORATION', '600042'),
('Tamil Nadu', 'Chennai', 'Perambur', 'Perambur', 'CORPORATION', '600011'),
('Tamil Nadu', 'Chennai', 'Thiru Vi Ka Nagar', 'Kolathur', 'CORPORATION', '600099'),
('Tamil Nadu', 'Chennai', 'Ambattur', 'Ambattur OT & Industrial Estate', 'CORPORATION', '600053'),
('Tamil Nadu', 'Chennai', 'Maduravoyal', 'Koyambedu / Wholesale Market', 'CORPORATION', '600107'),
('Tamil Nadu', 'Chennai', 'Sholinganallur', 'Sholinganallur OMR', 'CORPORATION', '600119'),
('Tamil Nadu', 'Chennai', 'Sholinganallur', 'Thoraipakkam', 'CORPORATION', '600097'),
('Tamil Nadu', 'Chennai', 'Alandur', 'Adambakkam / Alandur', 'CORPORATION', '600088'),

-- 2. Chengalpattu District
('Tamil Nadu', 'Chengalpattu', 'Tambaram', 'Tambaram West & East', 'CORPORATION', '600045'),
('Tamil Nadu', 'Chengalpattu', 'Tambaram', 'Chromepet', 'CORPORATION', '600044'),
('Tamil Nadu', 'Chengalpattu', 'Pallavaram', 'Pallavaram', 'CORPORATION', '600043'),
('Tamil Nadu', 'Chengalpattu', 'Chengalpattu', 'Chengalpattu Town', 'MUNICIPALITY', '603001'),
('Tamil Nadu', 'Chengalpattu', 'Vandalur', 'Vandalur', 'TOWN_PANCHAYAT', '600048'),
('Tamil Nadu', 'Chengalpattu', 'Vandalur', 'Guduvanchery', 'TOWN_PANCHAYAT', '603202'),
('Tamil Nadu', 'Chengalpattu', 'Maraimalai Nagar', 'Maraimalai Nagar Industrial', 'MUNICIPALITY', '603209'),
('Tamil Nadu', 'Chengalpattu', 'Thiruporur', 'Kelambakkam', 'TOWN_PANCHAYAT', '603103'),
('Tamil Nadu', 'Chengalpattu', 'Thirukalukundram', 'Mamallapuram (Mahabalipuram)', 'TOWN_PANCHAYAT', '603104'),
('Tamil Nadu', 'Chengalpattu', 'Madhuranthakam', 'Madhuranthakam Town', 'MUNICIPALITY', '603306'),

-- 3. Tiruvallur District
('Tamil Nadu', 'Tiruvallur', 'Tiruvallur', 'Tiruvallur Town', 'MUNICIPALITY', '602001'),
('Tamil Nadu', 'Tiruvallur', 'Avadi', 'Avadi Municipal Corporation', 'CORPORATION', '600054'),
('Tamil Nadu', 'Tiruvallur', 'Poonamallee', 'Poonamallee', 'MUNICIPALITY', '600056'),
('Tamil Nadu', 'Tiruvallur', 'Gummidipoondi', 'Gummidipoondi SIPCOT', 'TOWN_PANCHAYAT', '601201'),
('Tamil Nadu', 'Tiruvallur', 'Ponneri', 'Ponneri', 'TOWN_PANCHAYAT', '601204'),
('Tamil Nadu', 'Tiruvallur', 'Tiruttani', 'Tiruttani Town', 'MUNICIPALITY', '631209'),

-- 4. Coimbatore District
('Tamil Nadu', 'Coimbatore', 'Coimbatore North', 'Gandhipuram / RS Puram', 'CORPORATION', '641012'),
('Tamil Nadu', 'Coimbatore', 'Coimbatore South', 'Perur Town Panchayat', 'TOWN_PANCHAYAT', '641010'),
('Tamil Nadu', 'Coimbatore', 'Coimbatore South', 'Ukkadam / Town Hall', 'CORPORATION', '641001'),
('Tamil Nadu', 'Coimbatore', 'Singanallur', 'Singanallur / Ramanathapuram', 'CORPORATION', '641005'),
('Tamil Nadu', 'Coimbatore', 'Pollachi', 'Pollachi Municipality', 'MUNICIPALITY', '642001'),
('Tamil Nadu', 'Coimbatore', 'Kinathukadavu', 'Kinathukadavu Town Panchayat', 'TOWN_PANCHAYAT', '642109'),
('Tamil Nadu', 'Coimbatore', 'Mettupalayam', 'Mettupalayam Town', 'MUNICIPALITY', '641301'),
('Tamil Nadu', 'Coimbatore', 'Sulur', 'Sulur Town Panchayat', 'TOWN_PANCHAYAT', '641402'),
('Tamil Nadu', 'Coimbatore', 'Annur', 'Annur Town Panchayat', 'TOWN_PANCHAYAT', '641653'),
('Tamil Nadu', 'Coimbatore', 'Valparai', 'Valparai Municipality', 'MUNICIPALITY', '642127'),
('Tamil Nadu', 'Coimbatore', 'Madukkarai', 'Madukkarai Municipality', 'MUNICIPALITY', '641105'),
('Tamil Nadu', 'Coimbatore', 'Karamadai', 'Karamadai Municipality', 'MUNICIPALITY', '641104'),
('Tamil Nadu', 'Coimbatore', 'Irugur', 'Irugur Town Panchayat', 'TOWN_PANCHAYAT', '641103'),

-- 5. Madurai District
('Tamil Nadu', 'Madurai', 'Madurai North', 'Goripalayam / Sellur', 'CORPORATION', '625002'),
('Tamil Nadu', 'Madurai', 'Madurai South', 'Meenakshi Temple / Periyar', 'CORPORATION', '625001'),
('Tamil Nadu', 'Madurai', 'Madurai West', 'Koodal Nagar', 'CORPORATION', '625018'),
('Tamil Nadu', 'Madurai', 'Madurai East', 'Othakadai', 'TOWN_PANCHAYAT', '625107'),
('Tamil Nadu', 'Madurai', 'Vadipatti', 'Alanganallur Town Panchayat', 'TOWN_PANCHAYAT', '625501'),
('Tamil Nadu', 'Madurai', 'Vadipatti', 'Palamedu Town Panchayat', 'TOWN_PANCHAYAT', '625503'),
('Tamil Nadu', 'Madurai', 'Melur', 'Melur Municipality', 'MUNICIPALITY', '625106'),
('Tamil Nadu', 'Madurai', 'Tirumangalam', 'Tirumangalam Municipality', 'MUNICIPALITY', '625706'),
('Tamil Nadu', 'Madurai', 'Usilampatti', 'Usilampatti Municipality', 'MUNICIPALITY', '625532'),
('Tamil Nadu', 'Madurai', 'Thiruparankundram', 'Thiruparankundram', 'CORPORATION', '625005'),
('Tamil Nadu', 'Madurai', 'Sholavandan', 'Sholavandan Town Panchayat', 'TOWN_PANCHAYAT', '625214'),

-- 6. Tiruchirappalli District
('Tamil Nadu', 'Tiruchirappalli', 'Tiruchirappalli West', 'Central Bus Stand / Cantonment', 'CORPORATION', '620001'),
('Tamil Nadu', 'Tiruchirappalli', 'Tiruchirappalli East', 'Srirangam / Thillai Nagar', 'CORPORATION', '620006'),
('Tamil Nadu', 'Tiruchirappalli', 'Thiruverumbur', 'Thiruverumbur / BHEL', 'MUNICIPALITY', '620014'),
('Tamil Nadu', 'Tiruchirappalli', 'Manapparai', 'Manapparai Municipality', 'MUNICIPALITY', '621306'),
('Tamil Nadu', 'Tiruchirappalli', 'Lalgudi', 'Lalgudi Municipality', 'MUNICIPALITY', '621601'),
('Tamil Nadu', 'Tiruchirappalli', 'Musiri', 'Musiri Town Panchayat', 'TOWN_PANCHAYAT', '621211'),
('Tamil Nadu', 'Tiruchirappalli', 'Thuraiyur', 'Thuraiyur Municipality', 'MUNICIPALITY', '621010'),

-- 7. Salem District
('Tamil Nadu', 'Salem', 'Salem West', 'Salem Town / Shevapet', 'CORPORATION', '636001'),
('Tamil Nadu', 'Salem', 'Salem North', 'Hasthampatti / Fairlands', 'CORPORATION', '636007'),
('Tamil Nadu', 'Salem', 'Attur', 'Attur Municipality', 'MUNICIPALITY', '636102'),
('Tamil Nadu', 'Salem', 'Mettur', 'Mettur Dam Municipality', 'MUNICIPALITY', '636401'),
('Tamil Nadu', 'Salem', 'Edappadi', 'Edappadi Municipality', 'MUNICIPALITY', '637101'),
('Tamil Nadu', 'Salem', 'Omalur', 'Omalur Town Panchayat', 'TOWN_PANCHAYAT', '636455'),
('Tamil Nadu', 'Salem', 'Sankari', 'Sankari Town Panchayat', 'TOWN_PANCHAYAT', '637301'),
('Tamil Nadu', 'Salem', 'Yercaud', 'Yercaud Hills', 'TOWN_PANCHAYAT', '636601'),

-- 8. Tiruppur District
('Tamil Nadu', 'Tiruppur', 'Tiruppur North', 'Tiruppur Corporation Central', 'CORPORATION', '641601'),
('Tamil Nadu', 'Tiruppur', 'Tiruppur South', 'Veerapandi / Arulpuram', 'CORPORATION', '641605'),
('Tamil Nadu', 'Tiruppur', 'Avinashi', 'Avinashi Town Panchayat', 'TOWN_PANCHAYAT', '641654'),
('Tamil Nadu', 'Tiruppur', 'Palladam', 'Palladam Municipality', 'MUNICIPALITY', '641664'),
('Tamil Nadu', 'Tiruppur', 'Dharapuram', 'Dharapuram Municipality', 'MUNICIPALITY', '638656'),
('Tamil Nadu', 'Tiruppur', 'Kangeyam', 'Kangeyam Municipality', 'MUNICIPALITY', '638701'),
('Tamil Nadu', 'Tiruppur', 'Udumalaipettai', 'Udumalaipettai Municipality', 'MUNICIPALITY', '642126'),
('Tamil Nadu', 'Tiruppur', 'Madathukulam', 'Madathukulam Town Panchayat', 'TOWN_PANCHAYAT', '642113'),

-- 9. Erode District
('Tamil Nadu', 'Erode', 'Erode', 'Erode Municipal Corporation', 'CORPORATION', '638001'),
('Tamil Nadu', 'Erode', 'Perundurai', 'Perundurai SIPCOT', 'TOWN_PANCHAYAT', '638052'),
('Tamil Nadu', 'Erode', 'Bhavani', 'Bhavani Municipality', 'MUNICIPALITY', '638301'),
('Tamil Nadu', 'Erode', 'Gobichettipalayam', 'Gobichettipalayam Municipality', 'MUNICIPALITY', '638452'),
('Tamil Nadu', 'Erode', 'Sathyamangalam', 'Sathyamangalam Municipality', 'MUNICIPALITY', '638401'),
('Tamil Nadu', 'Erode', 'Anthiyur', 'Anthiyur Town Panchayat', 'TOWN_PANCHAYAT', '638501'),
('Tamil Nadu', 'Erode', 'Kodumudi', 'Kodumudi Town Panchayat', 'TOWN_PANCHAYAT', '638151'),

-- 10. Tirunelveli District
('Tamil Nadu', 'Tirunelveli', 'Tirunelveli', 'Tirunelveli Town / Junction', 'CORPORATION', '627001'),
('Tamil Nadu', 'Tirunelveli', 'Palayamkottai', 'Palayamkottai', 'CORPORATION', '627002'),
('Tamil Nadu', 'Tirunelveli', 'Ambasamudram', 'Ambasamudram Municipality', 'MUNICIPALITY', '627401'),
('Tamil Nadu', 'Tirunelveli', 'Nanguneri', 'Nanguneri Town Panchayat', 'TOWN_PANCHAYAT', '627108'),
('Tamil Nadu', 'Tirunelveli', 'Radhapuram', 'Valliyoor / Radhapuram', 'TOWN_PANCHAYAT', '627117'),
('Tamil Nadu', 'Tirunelveli', 'Cheranmahadevi', 'Cheranmahadevi Town Panchayat', 'TOWN_PANCHAYAT', '627414'),

-- 11. Vellore District
('Tamil Nadu', 'Vellore', 'Vellore', 'Vellore City / Fort / Katpadi', 'CORPORATION', '632001'),
('Tamil Nadu', 'Vellore', 'Katpadi', 'Katpadi Railway Junction', 'CORPORATION', '632007'),
('Tamil Nadu', 'Vellore', 'Gudiyattam', 'Gudiyattam Municipality', 'MUNICIPALITY', '632602'),
('Tamil Nadu', 'Vellore', 'Pernambut', 'Pernambut Municipality', 'MUNICIPALITY', '635810'),
('Tamil Nadu', 'Vellore', 'Anaicut', 'Anaicut Town Panchayat', 'TOWN_PANCHAYAT', '632101'),

-- 12. Ranipet District
('Tamil Nadu', 'Ranipet', 'Walajah', 'Ranipet SIPCOT / Walajah', 'MUNICIPALITY', '632401'),
('Tamil Nadu', 'Ranipet', 'Arakkonam', 'Arakkonam Municipality', 'MUNICIPALITY', '631001'),
('Tamil Nadu', 'Ranipet', 'Arcot', 'Arcot Municipality', 'MUNICIPALITY', '632503'),
('Tamil Nadu', 'Ranipet', 'Sholinghur', 'Sholinghur Municipality', 'MUNICIPALITY', '631102'),

-- 13. Tirupathur District
('Tamil Nadu', 'Tirupathur', 'Tirupathur', 'Tirupathur Municipality', 'MUNICIPALITY', '635601'),
('Tamil Nadu', 'Tirupathur', 'Vaniyambadi', 'Vaniyambadi Municipality', 'MUNICIPALITY', '635751'),
('Tamil Nadu', 'Tirupathur', 'Ambur', 'Ambur Leather Hub', 'MUNICIPALITY', '635802'),
('Tamil Nadu', 'Tirupathur', 'Natrampalli', 'Natrampalli Town Panchayat', 'TOWN_PANCHAYAT', '635852'),

-- 14. Kanchipuram District
('Tamil Nadu', 'Kanchipuram', 'Kanchipuram', 'Kanchipuram Silk City', 'CORPORATION', '631501'),
('Tamil Nadu', 'Kanchipuram', 'Sriperumbudur', 'Sriperumbudur Industrial SEZ', 'TOWN_PANCHAYAT', '602105'),
('Tamil Nadu', 'Kanchipuram', 'Kundrathur', 'Kundrathur Municipality', 'MUNICIPALITY', '600069'),
('Tamil Nadu', 'Kanchipuram', 'Walajabad', 'Walajabad Town Panchayat', 'TOWN_PANCHAYAT', '631605'),
('Tamil Nadu', 'Kanchipuram', 'Uthiramerur', 'Uthiramerur Town Panchayat', 'TOWN_PANCHAYAT', '603406'),

-- 15. Dindigul District
('Tamil Nadu', 'Dindigul', 'Dindigul West', 'Dindigul Corporation Central', 'CORPORATION', '624001'),
('Tamil Nadu', 'Dindigul', 'Palani', 'Palani Municipality', 'MUNICIPALITY', '624601'),
('Tamil Nadu', 'Dindigul', 'Kodaikanal', 'Kodaikanal Hill Station', 'MUNICIPALITY', '624101'),
('Tamil Nadu', 'Dindigul', 'Oddanchatram', 'Oddanchatram Municipality', 'MUNICIPALITY', '624619'),
('Tamil Nadu', 'Dindigul', 'Natham', 'Natham Town Panchayat', 'TOWN_PANCHAYAT', '624401'),
('Tamil Nadu', 'Dindigul', 'Nilakottai', 'Nilakottai Town Panchayat', 'TOWN_PANCHAYAT', '624208'),

-- 16. Thanjavur District
('Tamil Nadu', 'Thanjavur', 'Thanjavur', 'Thanjavur Big Temple City', 'CORPORATION', '613001'),
('Tamil Nadu', 'Thanjavur', 'Kumbakonam', 'Kumbakonam Corporation', 'CORPORATION', '612001'),
('Tamil Nadu', 'Thanjavur', 'Pattukkottai', 'Pattukkottai Municipality', 'MUNICIPALITY', '614601'),
('Tamil Nadu', 'Thanjavur', 'Orathanadu', 'Orathanadu Town Panchayat', 'TOWN_PANCHAYAT', '614625'),
('Tamil Nadu', 'Thanjavur', 'Thiruvaiyaru', 'Thiruvaiyaru Town Panchayat', 'TOWN_PANCHAYAT', '613204'),

-- 17. Thoothukudi District
('Tamil Nadu', 'Thoothukudi', 'Thoothukudi', 'Thoothukudi Port City', 'CORPORATION', '628001'),
('Tamil Nadu', 'Thoothukudi', 'Kovilpatti', 'Kovilpatti Municipality', 'MUNICIPALITY', '628501'),
('Tamil Nadu', 'Thoothukudi', 'Tiruchendur', 'Tiruchendur Municipality', 'MUNICIPALITY', '628215'),
('Tamil Nadu', 'Thoothukudi', 'Kayalpattinam', 'Kayalpattinam Municipality', 'MUNICIPALITY', '628204'),
('Tamil Nadu', 'Thoothukudi', 'Sathankulam', 'Sathankulam Town Panchayat', 'TOWN_PANCHAYAT', '628704'),

-- 18. Cuddalore District
('Tamil Nadu', 'Cuddalore', 'Cuddalore', 'Cuddalore Corporation', 'CORPORATION', '607001'),
('Tamil Nadu', 'Cuddalore', 'Panruti', 'Panruti Municipality', 'MUNICIPALITY', '607106'),
('Tamil Nadu', 'Cuddalore', 'Chidambaram', 'Chidambaram Municipality', 'MUNICIPALITY', '608001'),
('Tamil Nadu', 'Cuddalore', 'Neyveli', 'Neyveli Township (NLC)', 'TOWN_PANCHAYAT', '607801'),
('Tamil Nadu', 'Cuddalore', 'Virudhachalam', 'Virudhachalam Municipality', 'MUNICIPALITY', '606001'),

-- 19. Karur District
('Tamil Nadu', 'Karur', 'Karur', 'Karur Textile City', 'CORPORATION', '639001'),
('Tamil Nadu', 'Karur', 'Kulithalai', 'Kulithalai Municipality', 'MUNICIPALITY', '639107'),
('Tamil Nadu', 'Karur', 'Aravakurichi', 'Aravakurichi Town Panchayat', 'TOWN_PANCHAYAT', '639201'),
('Tamil Nadu', 'Karur', 'Pallapatti', 'Pallapatti Municipality', 'MUNICIPALITY', '639207'),

-- 20. Krishnagiri District
('Tamil Nadu', 'Krishnagiri', 'Hosur', 'Hosur Industrial Corporation', 'CORPORATION', '635109'),
('Tamil Nadu', 'Krishnagiri', 'Krishnagiri', 'Krishnagiri Municipality', 'MUNICIPALITY', '635001'),
('Tamil Nadu', 'Krishnagiri', 'Denkanikottai', 'Denkanikottai Town Panchayat', 'TOWN_PANCHAYAT', '635107'),
('Tamil Nadu', 'Krishnagiri', 'Pochampalli', 'Pochampalli Town Panchayat', 'TOWN_PANCHAYAT', '635206'),
('Tamil Nadu', 'Krishnagiri', 'Uthangarai', 'Uthangarai Town Panchayat', 'TOWN_PANCHAYAT', '635207'),

-- 21. Dharmapuri District
('Tamil Nadu', 'Dharmapuri', 'Dharmapuri', 'Dharmapuri Town', 'MUNICIPALITY', '636701'),
('Tamil Nadu', 'Dharmapuri', 'Palacode', 'Palacode Town Panchayat', 'TOWN_PANCHAYAT', '636808'),
('Tamil Nadu', 'Dharmapuri', 'Harur', 'Harur Town Panchayat', 'TOWN_PANCHAYAT', '636903'),
('Tamil Nadu', 'Dharmapuri', 'Pennagaram', 'Pennagaram Town Panchayat', 'TOWN_PANCHAYAT', '636810'),

-- 22. Namakkal District
('Tamil Nadu', 'Namakkal', 'Namakkal', 'Namakkal Transport City', 'MUNICIPALITY', '637001'),
('Tamil Nadu', 'Namakkal', 'Tiruchengode', 'Tiruchengode Municipality', 'MUNICIPALITY', '637211'),
('Tamil Nadu', 'Namakkal', 'Rasipuram', 'Rasipuram Municipality', 'MUNICIPALITY', '637408'),
('Tamil Nadu', 'Namakkal', 'Komarapalayam', 'Komarapalayam Municipality', 'MUNICIPALITY', '638183'),
('Tamil Nadu', 'Namakkal', 'Paramathi Velur', 'Paramathi Velur Town Panchayat', 'TOWN_PANCHAYAT', '638182'),

-- 23. Kanyakumari District
('Tamil Nadu', 'Kanyakumari', 'Agastheeswaram', 'Nagercoil Corporation', 'CORPORATION', '629001'),
('Tamil Nadu', 'Kanyakumari', 'Agastheeswaram', 'Kanyakumari Cape Town', 'TOWN_PANCHAYAT', '629702'),
('Tamil Nadu', 'Kanyakumari', 'Thovalai', 'Boothapandi Town Panchayat', 'TOWN_PANCHAYAT', '629852'),
('Tamil Nadu', 'Kanyakumari', 'Kalkulam', 'Thuckalay Municipality', 'MUNICIPALITY', '629175'),
('Tamil Nadu', 'Kanyakumari', 'Vilavancode', 'Kuzhithurai Municipality', 'MUNICIPALITY', '629163'),
('Tamil Nadu', 'Kanyakumari', 'Killiyoor', 'Colachel Municipality', 'MUNICIPALITY', '629251'),

-- 24. Nilgiris District
('Tamil Nadu', 'Nilgiris', 'Udhagamandalam', 'Ooty (Udhagamandalam)', 'MUNICIPALITY', '643001'),
('Tamil Nadu', 'Nilgiris', 'Coonoor', 'Coonoor Municipality', 'MUNICIPALITY', '643101'),
('Tamil Nadu', 'Nilgiris', 'Kotagiri', 'Kotagiri Town Panchayat', 'TOWN_PANCHAYAT', '643217'),
('Tamil Nadu', 'Nilgiris', 'Gudalur', 'Gudalur Municipality', 'MUNICIPALITY', '643212'),

-- 25. Virudhunagar District
('Tamil Nadu', 'Virudhunagar', 'Sivakasi', 'Sivakasi Corporation', 'CORPORATION', '626123'),
('Tamil Nadu', 'Virudhunagar', 'Virudhunagar', 'Virudhunagar Municipality', 'MUNICIPALITY', '626001'),
('Tamil Nadu', 'Virudhunagar', 'Rajapalayam', 'Rajapalayam Municipality', 'MUNICIPALITY', '626117'),
('Tamil Nadu', 'Virudhunagar', 'Aruppukkottai', 'Aruppukkottai Municipality', 'MUNICIPALITY', '626101'),
('Tamil Nadu', 'Virudhunagar', 'Sattur', 'Sattur Municipality', 'MUNICIPALITY', '626203'),

-- 26. Tenkasi District
('Tamil Nadu', 'Tenkasi', 'Tenkasi', 'Tenkasi Municipality', 'MUNICIPALITY', '627811'),
('Tamil Nadu', 'Tenkasi', 'Sankarankovil', 'Sankarankovil Municipality', 'MUNICIPALITY', '627756'),
('Tamil Nadu', 'Tenkasi', 'Kadayanallur', 'Kadayanallur Municipality', 'MUNICIPALITY', '627751'),
('Tamil Nadu', 'Tenkasi', 'Shenkottai', 'Shenkottai Municipality', 'MUNICIPALITY', '627809'),
('Tamil Nadu', 'Tenkasi', 'Alangulam', 'Alangulam Town Panchayat', 'TOWN_PANCHAYAT', '627851'),
('Tamil Nadu', 'Tenkasi', 'Courtallam', 'Courtallam Town Panchayat', 'TOWN_PANCHAYAT', '627802'),

-- 27. Theni District
('Tamil Nadu', 'Theni', 'Theni', 'Theni Allinagaram Municipality', 'MUNICIPALITY', '625531'),
('Tamil Nadu', 'Theni', 'Periyakulam', 'Periyakulam Municipality', 'MUNICIPALITY', '625601'),
('Tamil Nadu', 'Theni', 'Bodinayakanur', 'Bodinayakanur Cardamom City', 'MUNICIPALITY', '625513'),
('Tamil Nadu', 'Theni', 'Cumbum', 'Cumbum Municipality', 'MUNICIPALITY', '625516'),
('Tamil Nadu', 'Theni', 'Chinnamanur', 'Chinnamanur Municipality', 'MUNICIPALITY', '625515'),
('Tamil Nadu', 'Theni', 'Andipatti', 'Andipatti Town Panchayat', 'TOWN_PANCHAYAT', '625512'),

-- 28. Ramanathapuram District
('Tamil Nadu', 'Ramanathapuram', 'Ramanathapuram', 'Ramanathapuram Town', 'MUNICIPALITY', '623501'),
('Tamil Nadu', 'Ramanathapuram', 'Rameswaram', 'Rameswaram Island Municipality', 'MUNICIPALITY', '623526'),
('Tamil Nadu', 'Ramanathapuram', 'Paramakudi', 'Paramakudi Municipality', 'MUNICIPALITY', '623707'),
('Tamil Nadu', 'Ramanathapuram', 'Keelakarai', 'Keelakarai Municipality', 'MUNICIPALITY', '623517'),

-- 29. Sivaganga District
('Tamil Nadu', 'Sivaganga', 'Sivaganga', 'Sivaganga Town', 'MUNICIPALITY', '630561'),
('Tamil Nadu', 'Sivaganga', 'Karaikudi', 'Karaikudi Municipality (Chettinad)', 'MUNICIPALITY', '630001'),
('Tamil Nadu', 'Sivaganga', 'Devakottai', 'Devakottai Municipality', 'MUNICIPALITY', '630302'),
('Tamil Nadu', 'Sivaganga', 'Manamadurai', 'Manamadurai Municipality', 'MUNICIPALITY', '630606'),

-- 30. Pudukkottai District
('Tamil Nadu', 'Pudukkottai', 'Pudukkottai', 'Pudukkottai Municipality', 'MUNICIPALITY', '622001'),
('Tamil Nadu', 'Pudukkottai', 'Aranthangi', 'Aranthangi Municipality', 'MUNICIPALITY', '614616'),
('Tamil Nadu', 'Pudukkottai', 'Alangudi', 'Alangudi Town Panchayat', 'TOWN_PANCHAYAT', '622301'),
('Tamil Nadu', 'Pudukkottai', 'Illuppur', 'Illuppur Town Panchayat', 'TOWN_PANCHAYAT', '622102'),

-- 31. Nagapattinam District
('Tamil Nadu', 'Nagapattinam', 'Nagapattinam', 'Nagapattinam Port Town', 'MUNICIPALITY', '611001'),
('Tamil Nadu', 'Nagapattinam', 'Kilvelur', 'Kilvelur Town Panchayat', 'TOWN_PANCHAYAT', '611104'),
('Tamil Nadu', 'Nagapattinam', 'Vedaranyam', 'Vedaranyam Municipality', 'MUNICIPALITY', '614810'),
('Tamil Nadu', 'Nagapattinam', 'Velankanni', 'Velankanni Town Panchayat', 'TOWN_PANCHAYAT', '611111'),

-- 32. Mayiladuthurai District
('Tamil Nadu', 'Mayiladuthurai', 'Mayiladuthurai', 'Mayiladuthurai Municipality', 'MUNICIPALITY', '609001'),
('Tamil Nadu', 'Mayiladuthurai', 'Sirkazhi', 'Sirkazhi Municipality', 'MUNICIPALITY', '609110'),
('Tamil Nadu', 'Mayiladuthurai', 'Tharangambadi', 'Tharangambadi (Tranquebar)', 'TOWN_PANCHAYAT', '609313'),
('Tamil Nadu', 'Mayiladuthurai', 'Kuthalam', 'Kuthalam Town Panchayat', 'TOWN_PANCHAYAT', '609801'),

-- 33. Tiruvarur District
('Tamil Nadu', 'Tiruvarur', 'Tiruvarur', 'Tiruvarur Chariot Town', 'MUNICIPALITY', '610001'),
('Tamil Nadu', 'Tiruvarur', 'Mannargudi', 'Mannargudi Municipality', 'MUNICIPALITY', '614001'),
('Tamil Nadu', 'Tiruvarur', 'Thiruthuraipoondi', 'Thiruthuraipoondi Municipality', 'MUNICIPALITY', '614713'),
('Tamil Nadu', 'Tiruvarur', 'Kudavasal', 'Kudavasal Town Panchayat', 'TOWN_PANCHAYAT', '612601'),

-- 34. Perambalur District
('Tamil Nadu', 'Perambalur', 'Perambalur', 'Perambalur Municipality', 'MUNICIPALITY', '621212'),
('Tamil Nadu', 'Perambalur', 'Kunnam', 'Labbaikudikadu Town Panchayat', 'TOWN_PANCHAYAT', '621108'),
('Tamil Nadu', 'Perambalur', 'Veppanthattai', 'Veppanthattai Taluk', 'TALUK', '621116'),

-- 35. Ariyalur District
('Tamil Nadu', 'Ariyalur', 'Ariyalur', 'Ariyalur Cement Town', 'MUNICIPALITY', '621704'),
('Tamil Nadu', 'Ariyalur', 'Udayarpalayam', 'Jayankondam Municipality', 'MUNICIPALITY', '621802'),
('Tamil Nadu', 'Ariyalur', 'Sendurai', 'Sendurai Town Panchayat', 'TOWN_PANCHAYAT', '621714'),

-- 36. Tiruvannamalai District
('Tamil Nadu', 'Tiruvannamalai', 'Tiruvannamalai', 'Tiruvannamalai Temple City', 'MUNICIPALITY', '606601'),
('Tamil Nadu', 'Tiruvannamalai', 'Arani', 'Arani Silk Municipality', 'MUNICIPALITY', '632301'),
('Tamil Nadu', 'Tiruvannamalai', 'Cheyyar', 'Cheyyar SIPCOT Municipality', 'MUNICIPALITY', '604407'),
('Tamil Nadu', 'Tiruvannamalai', 'Polur', 'Polur Town Panchayat', 'TOWN_PANCHAYAT', '606803'),
('Tamil Nadu', 'Tiruvannamalai', 'Chengam', 'Chengam Town Panchayat', 'TOWN_PANCHAYAT', '606701'),

-- 37. Viluppuram District
('Tamil Nadu', 'Viluppuram', 'Viluppuram', 'Viluppuram Junction Municipality', 'MUNICIPALITY', '605602'),
('Tamil Nadu', 'Viluppuram', 'Tindivanam', 'Tindivanam Municipality', 'MUNICIPALITY', '604001'),
('Tamil Nadu', 'Viluppuram', 'Gingee', 'Gingee Fort Town', 'TOWN_PANCHAYAT', '604202'),
('Tamil Nadu', 'Viluppuram', 'Vanur', 'Auroville / Kottakuppam', 'MUNICIPALITY', '605104'),
('Tamil Nadu', 'Viluppuram', 'Marakkanam', 'Marakkanam Town Panchayat', 'TOWN_PANCHAYAT', '604303'),

-- 38. Kallakurichi District
('Tamil Nadu', 'Kallakurichi', 'Kallakurichi', 'Kallakurichi Municipality', 'MUNICIPALITY', '606202'),
('Tamil Nadu', 'Kallakurichi', 'Ulundurpet', 'Ulundurpet Municipality', 'MUNICIPALITY', '606107'),
('Tamil Nadu', 'Kallakurichi', 'Sankarapuram', 'Sankarapuram Town Panchayat', 'TOWN_PANCHAYAT', '606401'),
('Tamil Nadu', 'Kallakurichi', 'Chinnasalem', 'Chinnasalem Town Panchayat', 'TOWN_PANCHAYAT', '606201'),
('Tamil Nadu', 'Kallakurichi', 'Tirukkoyilur', 'Tirukkoyilur Municipality', 'MUNICIPALITY', '605757')
ON CONFLICT DO NOTHING;

-- Verification Check
SELECT 'location_master count' AS table_name, COUNT(*) FROM location_master
UNION ALL
SELECT 'onboarding_master_options count', COUNT(*) FROM onboarding_master_options;
