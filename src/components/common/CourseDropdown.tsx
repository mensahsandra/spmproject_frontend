import React from 'react';
import { Course, courseUtils } from '../../utils/courseApi';
import { ChevronDown, BookOpen } from 'lucide-react';

interface CourseDropdownProps {
  courses: Course[];
  selectedCourseId?: string;
  onCourseSelect: (courseId: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showFullCourses?: boolean;
  filterByDepartment?: string;
}

const CourseDropdown: React.FC<CourseDropdownProps> = ({
  courses,
  selectedCourseId,
  onCourseSelect,
  placeholder = "Select a course...",
  disabled = false,
  className = '',
  showFullCourses = true,
  filterByDepartment
}) => {
  // Filter courses based on props
  const filteredCourses = courses.filter(course => {
    // Filter by department if specified
    if (filterByDepartment && course.department !== filterByDepartment) {
      return false;
    }

    // Filter out full courses if showFullCourses is false
    if (!showFullCourses && courseUtils.isCourseFullyEnrolled(course)) {
      return false;
    }

    return true;
  });

  const selectedCourse = selectedCourseId 
    ? courses.find(course => course.id === selectedCourseId)
    : null;

  return (
    <div className={`course-dropdown ${className}`}>
      <select
        className="form-select"
        value={selectedCourseId || ''}
        onChange={(e) => onCourseSelect(e.target.value || null)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {filteredCourses.map(course => {
          const isFull = courseUtils.isCourseFullyEnrolled(course);
          const displayName = courseUtils.formatCourseDisplayName(course);
          
          return (
            <option 
              key={course.id} 
              value={course.id}
              disabled={isFull && !showFullCourses}
            >
              {displayName}
              {isFull ? ' (Full)' : ''}
              {course.credits ? ` - ${course.credits} Credits` : ''}
            </option>
          );
        })}
      </select>

      {/* Selected course details */}
      {selectedCourse && (
        <div className="mt-2 p-2 bg-light rounded small">
          <div className="d-flex align-items-start gap-2">
            <BookOpen size={16} className="text-primary mt-1" />
            <div>
              <div className="fw-semibold">{selectedCourse.name}</div>
              {selectedCourse.description && (
                <div className="text-muted">{selectedCourse.description}</div>
              )}
              <div className="d-flex gap-3 mt-1">
                <span><strong>Credits:</strong> {selectedCourse.credits}</span>
                <span><strong>Department:</strong> {selectedCourse.department}</span>
                {selectedCourse.lecturer && (
                  <span><strong>Lecturer:</strong> {selectedCourse.lecturer.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="mt-2 p-3 text-center text-muted">
          <BookOpen size={24} className="mb-2" />
          <div>No courses available</div>
          {filterByDepartment && (
            <small>No courses found in {filterByDepartment} department</small>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDropdown;