-- Database Update Script for Kwabena's Lecturer Profile
-- Update kwabena@knust.edu.gh to include BIT course

-- Option 1: If courses are stored as JSON array in lecturers table
UPDATE lecturers 
SET courses = JSON_ARRAY('BIT')
WHERE email = 'kwabena@knust.edu.gh';

-- Option 2: If courses are stored as comma-separated string
UPDATE lecturers 
SET courses = 'BIT'
WHERE email = 'kwabena@knust.edu.gh';

-- Option 3: If courses are stored as simple text field
UPDATE lecturers 
SET course = 'BIT'
WHERE email = 'kwabena@knust.edu.gh';

-- Option 4: If using PostgreSQL with array type
UPDATE lecturers 
SET courses = ARRAY['BIT']
WHERE email = 'kwabena@knust.edu.gh';

-- Option 5: If there's a separate lecturer_courses junction table
INSERT INTO lecturer_courses (lecturer_id, course_code) 
SELECT id, 'BIT' 
FROM lecturers 
WHERE email = 'kwabena@knust.edu.gh'
AND NOT EXISTS (
    SELECT 1 FROM lecturer_courses 
    WHERE lecturer_id = lecturers.id AND course_code = 'BIT'
);

-- Verify the update worked
SELECT id, email, name, courses, role 
FROM lecturers 
WHERE email = 'kwabena@knust.edu.gh';

-- If you need to also ensure the BIT course exists in a courses table
INSERT IGNORE INTO courses (code, name, description) 
VALUES ('BIT', 'BSc in Information Technology', 'Bachelor of Science in Information Technology program');

-- Alternative verification query if using junction table
SELECT l.email, l.name, l.role, GROUP_CONCAT(lc.course_code) as assigned_courses
FROM lecturers l
LEFT JOIN lecturer_courses lc ON l.id = lc.lecturer_id
WHERE l.email = 'kwabena@knust.edu.gh'
GROUP BY l.id;