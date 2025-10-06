import React, { useState, useMemo } from 'react';

interface Program {
  code: string;
  name: string;
  courses: Course[];
}

interface Course {
  code: string;
  name: string;
  semester: string;
}

interface CourseHierarchySelectorProps {
  programs: Program[];
  selectedCourseId?: string;
  onSelectCourse: (courseId: string) => void;
}

const CourseHierarchySelector: React.FC<CourseHierarchySelectorProps> = ({
  programs,
  selectedCourseId,
  onSelectCourse
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  
  // Flatten all courses with program context
  const allCourses = useMemo(() => {
    const courses: Array<Course & { programName: string }> = [];
    programs.forEach(program => {
      program.courses.forEach(course => {
        courses.push({
          ...course,
          programName: program.name
        });
      });
    });
    return courses;
  }, [programs]);

  // Filter courses by selected program
  const filteredCourses = selectedProgram 
    ? allCourses.filter(course => 
        programs.find(p => p.code === selectedProgram)?.courses.some(c => c.code === course.code)
      )
    : allCourses;

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <div className="row">
          {/* Program Selection */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Program</label>
            <select
              className="form-select"
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value);
                onSelectCourse(''); // Reset course selection
              }}
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program.code} value={program.code}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Selection */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Specific Course</label>
            <select
              className="form-select"
              value={selectedCourseId || ''}
              onChange={(e) => onSelectCourse(e.target.value)}
            >
              <option value="" disabled>Select a course</option>
              {filteredCourses.map(course => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.name}
                  {!selectedProgram && ` (${course.programName})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-muted small">
          <strong>Available:</strong> {filteredCourses.length} courses
          {selectedProgram && ` in ${programs.find(p => p.code === selectedProgram)?.name}`}
        </div>
      </div>
    </div>
  );
};

export default CourseHierarchySelector;