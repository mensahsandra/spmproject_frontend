import React, { useState, useEffect } from 'react';
import { Course, courseUtils } from '../../utils/courseApi';
import { Search, Filter, BookOpen, Users, Award } from 'lucide-react';

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseIds: Set<string>;
  onSelectionChange: (courseId: string, selected: boolean) => void;
  mode: 'checkbox' | 'dropdown' | 'card';
  maxSelection?: number;
  showFilters?: boolean;
  disabled?: boolean;
  className?: string;
}

interface FilterState {
  search: string;
  department: string;
  credits: string;
  availability: 'all' | 'available' | 'full';
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  selectedCourseIds,
  onSelectionChange,
  mode = 'checkbox',
  maxSelection,
  showFilters = true,
  disabled = false,
  className = ''
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: '',
    credits: '',
    availability: 'all'
  });

  const departments = courseUtils.getUniqueDepartments(courses);
  const creditOptions = [...new Set(courses.map(c => c.credits))].sort((a, b) => a - b);

  // Filter courses based on current filters
  const filteredCourses = courses.filter(course => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        course.name.toLowerCase().includes(searchLower) ||
        course.code.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Department filter
    if (filters.department && course.department !== filters.department) {
      return false;
    }

    // Credits filter
    if (filters.credits && course.credits.toString() !== filters.credits) {
      return false;
    }

    // Availability filter
    if (filters.availability === 'available' && courseUtils.isCourseFullyEnrolled(course)) {
      return false;
    }
    if (filters.availability === 'full' && !courseUtils.isCourseFullyEnrolled(course)) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      department: '',
      credits: '',
      availability: 'all'
    });
  };

  const isMaxSelectionReached = maxSelection ? selectedCourseIds.size >= maxSelection : false;

  // Checkbox Mode
  if (mode === 'checkbox') {
    return (
      <div className={`course-selector ${className}`}>
        {showFilters && (
          <div className="course-filters mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search courses..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.credits}
                  onChange={(e) => handleFilterChange('credits', e.target.value)}
                >
                  <option value="">All Credits</option>
                  {creditOptions.map(credits => (
                    <option key={credits} value={credits}>{credits} Credits</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value as FilterState['availability'])}
                >
                  <option value="all">All Courses</option>
                  <option value="available">Available</option>
                  <option value="full">Full</option>
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="course-list">
          {filteredCourses.map(course => {
            const isSelected = selectedCourseIds.has(course.id);
            const isFull = courseUtils.isCourseFullyEnrolled(course);
            const canSelect = !disabled && (!isMaxSelectionReached || isSelected) && (!isFull || isSelected);

            return (
              <div key={course.id} className="form-check mb-3 p-3 border rounded">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`course-checkbox-${course.id}`}
                  checked={isSelected}
                  onChange={(e) => onSelectionChange(course.id, e.target.checked)}
                  disabled={!canSelect}
                />
                <label className="form-check-label w-100" htmlFor={`course-checkbox-${course.id}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{courseUtils.formatCourseDisplayName(course)}</h6>
                      <p className="text-muted mb-1 small">{course.description}</p>
                      <div className="d-flex gap-3 small text-muted">
                        <span><Award size={12} className="me-1" />{course.credits} Credits</span>
                        <span><Users size={12} className="me-1" />{course.enrollmentCount || 0}/{course.maxEnrollment || '∞'}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      {isFull && <span className="badge bg-danger">Full</span>}
                      {isSelected && <span className="badge bg-success">Selected</span>}
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-4">
            <BookOpen size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No courses found</h5>
            <p className="text-muted">Try adjusting your filters to see more courses.</p>
          </div>
        )}
      </div>
    );
  }

  // Dropdown Mode
  if (mode === 'dropdown') {
    return (
      <div className={`course-selector ${className}`}>
        <select
          className="form-select"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              const isCurrentlySelected = selectedCourseIds.has(e.target.value);
              onSelectionChange(e.target.value, !isCurrentlySelected);
              e.target.value = ''; // Reset dropdown
            }
          }}
          disabled={disabled}
        >
          <option value="">Select a course...</option>
          {filteredCourses.map(course => {
            const isSelected = selectedCourseIds.has(course.id);
            const isFull = courseUtils.isCourseFullyEnrolled(course);
            const canSelect = !isMaxSelectionReached || isSelected;

            return (
              <option 
                key={course.id} 
                value={course.id}
                disabled={!canSelect || (isFull && !isSelected)}
              >
                {courseUtils.formatCourseDisplayName(course)} 
                {isSelected ? ' (Selected)' : ''}
                {isFull && !isSelected ? ' (Full)' : ''}
              </option>
            );
          })}
        </select>

        {/* Selected courses display */}
        {selectedCourseIds.size > 0 && (
          <div className="mt-3">
            <h6>Selected Courses:</h6>
            <div className="d-flex flex-wrap gap-2">
              {Array.from(selectedCourseIds).map(courseId => {
                const course = courses.find(c => c.id === courseId);
                if (!course) return null;

                return (
                  <span key={courseId} className="badge bg-primary d-flex align-items-center gap-1">
                    {course.code}
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      style={{ fontSize: '0.6em' }}
                      onClick={() => onSelectionChange(courseId, false)}
                      disabled={disabled}
                    ></button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Card Mode
  return (
    <div className={`course-selector ${className}`}>
      {showFilters && (
        <div className="course-filters mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <Filter size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3">
        {filteredCourses.map(course => {
          const isSelected = selectedCourseIds.has(course.id);
          const isFull = courseUtils.isCourseFullyEnrolled(course);
          const canSelect = !disabled && (!isMaxSelectionReached || isSelected) && (!isFull || isSelected);

          return (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div 
                className={`card h-100 ${isSelected ? 'border-success' : ''} ${canSelect ? 'cursor-pointer' : ''}`}
                onClick={() => canSelect && onSelectionChange(course.id, !isSelected)}
                style={{ cursor: canSelect ? 'pointer' : 'default' }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-1">{course.code}</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (canSelect) {
                            onSelectionChange(course.id, e.target.checked);
                          }
                        }}
                        disabled={!canSelect}
                      />
                    </div>
                  </div>
                  <h6 className="card-subtitle mb-2 text-muted">{course.name}</h6>
                  <p className="card-text small">{course.description}</p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">{course.credits} Credits</small>
                      <div>
                        {isFull && <span className="badge bg-danger me-1">Full</span>}
                        {isSelected && <span className="badge bg-success">Selected</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-5">
          <BookOpen size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No courses found</h5>
          <p className="text-muted">Try adjusting your filters to see more courses.</p>
        </div>
      )}
    </div>
  );
};

export default CourseSelector;