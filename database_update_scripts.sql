-- Database Update Scripts for Course Assignment
-- Replace table names and column names according to your actual database schema

-- Option 1: If courses are stored as a JSON array or comma-separated string
UPDATE lecturers 
SET courses = '["BIT"]' 
WHERE email = 'kwabena@knust.edu.gh';

-- OR if courses are stored as comma-separated string:
UPDATE lecturers 
SET courses = 'BIT' 
WHERE email = 'kwabena@knust.edu.gh';

-- Option 2: If there's a separate lecturer_courses table (many-to-many relationship)
INSERT INTO lecturer_courses (lecturer_id, course_code, course_name) 
SELECT l.id, 'BIT', 'BSc in Information Technology'
FROM lecturers l 
WHERE l.email = 'kwabena@knust.edu.gh';

-- Option 3: If courses table exists separately
-- First, ensure the course exists
INSERT IGNORE INTO courses (code, name, description) 
VALUES ('BIT', 'BSc in Information Technology', 'Bachelor of Science in Information Technology');

-- Then assign to lecturer
INSERT INTO lecturer_course_assignments (lecturer_id, course_id)
SELECT l.id, c.id
FROM lecturers l, courses c
WHERE l.email = 'kwabena@knust.edu.gh' 
AND c.code = 'BIT';

-- Verify the update
SELECT l.email, l.name, l.courses 
FROM lecturers l 
WHERE l.email = 'kwabena@knust.edu.gh';