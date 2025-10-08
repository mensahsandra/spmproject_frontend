import React from 'react';
import { Course, UserCourse, courseUtils } from '../../utils/courseApi';
import { BookOpen, User, Award, Users, Calendar, MapPin } from 'lucide-react';

interface CourseDisplayProps {
  course?: Course;
  userCourse?: UserCourse;
  mode: 'card' | 'list' | 'compact';
  showEnrollmentInfo?: boolean;
  showLecturerInfo?: boolean;
  showDescription?: boolean;
  className?: string;
  onClick?: () => void;
}

const CourseDisplay: React.FC<CourseDisplayProps> = ({
  course,
  userCourse,
  mode = 'card',
  showEnrollmentInfo = true,
  showLecturerInfo = true,
  showDescription = true,
  className = '',
  onClick
}) => {
  const displayCourse = course || userCourse?.course;
  
  if (!displayCourse) {
    return (
      <div className={`course-display-empty ${className}`}>
        <div className="text-center p-3 text-muted">
          <BookOpen size={24} />
          <div>No course data available</div>
        </div>
      </div>
    );
  }

  const isFull = courseUtils.isCourseFullyEnrolled(displayCourse);
  const enrollmentPercentage = displayCourse.maxEnrollment 
    ? Math.round(((displayCourse.enrollmentCount || 0) / displayCourse.maxEnrollment) * 100)
    : 0;

  // Card Mode
  if (mode === 'card') {
    return (
      <div 
        className={`card course-display-card ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="card-title mb-1">{displayCourse.code}</h6>
              <h6 className="card-subtitle text-muted">{displayCourse.name}</h6>
            </div>
            <div className="text-end">
              <span className="badge bg-primary">{displayCourse.credits} Credits</span>
              {userCourse?.status && (
                <div className="mt-1">
                  <span className={`badge ${
                    userCourse.status === 'enrolled' ? 'bg-success' :
                    userCourse.status === 'completed' ? 'bg-info' :
                    userCourse.status === 'dropped' ? 'bg-secondary' :
                    'bg-warning'
                  }`}>
                    {userCourse.status.charAt(0).toUpperCase() + userCourse.status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {showDescription && displayCourse.description && (
            <p className="card-text small text-muted mb-3">{displayCourse.description}</p>
          )}

          <div className="row g-2 small">
            <div className="col-6">
              <div className="d-flex align-items-center gap-1">
                <MapPin size={12} />
                <span>{displayCourse.department}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center gap-1">
                <Calendar size={12} />
                <span>{displayCourse.semester} {displayCourse.year}</span>
              </div>
            </div>
            {showLecturerInfo && displayCourse.lecturer && (
              <div className="col-12">
                <div className="d-flex align-items-center gap-1">
                  <User size={12} />
                  <span>{displayCourse.lecturer.name}</span>
                </div>
              </div>
            )}
            {showEnrollmentInfo && displayCourse.maxEnrollment && (
              <div className="col-12">
                <div className="d-flex align-items-center gap-1">
                  <Users size={12} />
                  <span>
                    {displayCourse.enrollmentCount || 0}/{displayCourse.maxEnrollment} enrolled
                    {isFull && <span className="text-danger ms-1">(Full)</span>}
                  </span>
                </div>
                <div className="progress mt-1" style={{ height: '4px' }}>
                  <div 
                    className={`progress-bar ${enrollmentPercentage >= 90 ? 'bg-danger' : enrollmentPercentage >= 70 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${enrollmentPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {userCourse?.grade && (
            <div className="mt-2 pt-2 border-top">
              <div className="d-flex align-items-center gap-1">
                <Award size={12} />
                <span className="fw-semibold">Grade: {userCourse.grade}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List Mode
  if (mode === 'list') {
    return (
      <div 
        className={`list-group-item course-display-list ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <BookOpen size={16} className="text-primary" />
              <h6 className="mb-0">{courseUtils.formatCourseDisplayName(displayCourse)}</h6>
              <span className="badge bg-primary">{displayCourse.credits} Credits</span>
              {userCourse?.status && (
                <span className={`badge ${
                  userCourse.status === 'enrolled' ? 'bg-success' :
                  userCourse.status === 'completed' ? 'bg-info' :
                  userCourse.status === 'dropped' ? 'bg-secondary' :
                  'bg-warning'
                }`}>
                  {userCourse.status.charAt(0).toUpperCase() + userCourse.status.slice(1)}
                </span>
              )}
            </div>
            
            {showDescription && displayCourse.description && (
              <p className="text-muted mb-2 small">{displayCourse.description}</p>
            )}

            <div className="d-flex flex-wrap gap-3 small text-muted">
              <span><MapPin size={12} className="me-1" />{displayCourse.department}</span>
              <span><Calendar size={12} className="me-1" />{displayCourse.semester} {displayCourse.year}</span>
              {showLecturerInfo && displayCourse.lecturer && (
                <span><User size={12} className="me-1" />{displayCourse.lecturer.name}</span>
              )}
              {showEnrollmentInfo && displayCourse.maxEnrollment && (
                <span>
                  <Users size={12} className="me-1" />
                  {displayCourse.enrollmentCount || 0}/{displayCourse.maxEnrollment}
                  {isFull && <span className="text-danger ms-1">(Full)</span>}
                </span>
              )}
            </div>
          </div>

          {userCourse?.grade && (
            <div className="text-end">
              <div className="d-flex align-items-center gap-1">
                <Award size={12} />
                <span className="fw-semibold">{userCourse.grade}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact Mode
  return (
    <div 
      className={`course-display-compact d-flex align-items-center gap-2 p-2 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <BookOpen size={16} className="text-primary" />
      <div className="flex-grow-1">
        <span className="fw-semibold">{displayCourse.code}</span>
        <span className="text-muted ms-2">{displayCourse.name}</span>
      </div>
      <span className="badge bg-primary">{displayCourse.credits}</span>
      {userCourse?.status && (
        <span className={`badge ${
          userCourse.status === 'enrolled' ? 'bg-success' :
          userCourse.status === 'completed' ? 'bg-info' :
          userCourse.status === 'dropped' ? 'bg-secondary' :
          'bg-warning'
        }`}>
          {userCourse.status.charAt(0).toUpperCase() + userCourse.status.slice(1)}
        </span>
      )}
    </div>
  );
};

export default CourseDisplay;