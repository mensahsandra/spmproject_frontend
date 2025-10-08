import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import type { Course, UserCourse } from '../utils/courseApi';
import { courseApi, courseUtils, mockCourses } from '../utils/courseApi';
import { getUser } from '../utils/auth';
import { User, BookOpen, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  department?: string;
  year?: string;
  semester?: string;
}

const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<UserCourse[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'courses'>('profile');

  useEffect(() => {
    loadProfileData();
    loadCourseData();
  }, []);

  const loadProfileData = () => {
    try {
      const user = getUser();
      if (user) {
        setProfileData({
          id: user.id || user.studentId || '',
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email || '',
          studentId: user.studentId || user.id || '',
          department: user.department || 'Computer Science',
          year: user.year || '2024',
          semester: user.semester || 'Fall'
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    }
  };

  const loadCourseData = async () => {
    setLoading(true);
    try {
      // Load available courses
      const availableResponse = await courseApi.getAvailableCourses();
      if (availableResponse.success && availableResponse.data) {
        setAvailableCourses(availableResponse.data);
      } else {
        // Fallback to mock data
        setAvailableCourses(mockCourses || []);
      }

      // Load enrolled courses
      const enrolledResponse = await courseApi.getUserCourses();
      if (enrolledResponse.success && enrolledResponse.data) {
        setEnrolledCourses(enrolledResponse.data);
        const enrolledIds = new Set(enrolledResponse.data.map(uc => uc.courseId));
        setSelectedCourseIds(enrolledIds);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      setMessage({ type: 'error', text: 'Failed to load course data' });
      // Fallback to mock data
      setAvailableCourses(mockCourses || []);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelection = (courseId: string, selected: boolean) => {
    const newSelection = new Set(selectedCourseIds);
    if (selected) {
      newSelection.add(courseId);
    } else {
      newSelection.delete(courseId);
    }
    setSelectedCourseIds(newSelection);
  };

  const handleSaveCourses = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const currentEnrolledIds = new Set(enrolledCourses.map(uc => uc.courseId));
      const toEnroll = Array.from(selectedCourseIds).filter(id => !currentEnrolledIds.has(id));
      const toDrop = Array.from(currentEnrolledIds).filter(id => !selectedCourseIds.has(id));

      // Enroll in new courses
      for (const courseId of toEnroll) {
        await courseApi.updateCourseEnrollment(courseId, 'enroll');
      }

      // Drop courses
      for (const courseId of toDrop) {
        await courseApi.updateCourseEnrollment(courseId, 'drop');
      }

      // Reload course data
      await loadCourseData();
      
      setMessage({ 
        type: 'success', 
        text: `Successfully updated course enrollment. ${toEnroll.length} courses added, ${toDrop.length} courses dropped.` 
      });
    } catch (error) {
      console.error('Error saving courses:', error);
      setMessage({ type: 'error', text: 'Failed to update course enrollment' });
    } finally {
      setSaving(false);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading profile settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalCredits = courseUtils.calculateTotalCredits(
    availableCourses.filter(course => selectedCourseIds.has(course.id))
  );

  return (
    <DashboardLayout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1 d-flex align-items-center gap-2">
              <User size={24} className="text-primary" />
              Profile Settings
            </h2>
            <p className="text-muted mb-0">Manage your profile and course enrollment</p>
          </div>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
            <div className="d-flex align-items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message.text}
            </div>
            <button type="button" className="btn-close" onClick={clearMessage}></button>
          </div>
        )}

        {/* Tabs */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-3">
            <div className="btn-group w-100" role="group">
              <input 
                type="radio" 
                className="btn-check" 
                name="settingsTab" 
                id="profile" 
                checked={activeTab === 'profile'}
                onChange={() => setActiveTab('profile')}
              />
              <label className="btn btn-outline-primary" htmlFor="profile">
                <User size={16} className="me-1" />
                Profile Information
              </label>

              <input 
                type="radio" 
                className="btn-check" 
                name="settingsTab" 
                id="courses" 
                checked={activeTab === 'courses'}
                onChange={() => setActiveTab('courses')}
              />
              <label className="btn btn-outline-primary" htmlFor="courses">
                <BookOpen size={16} className="me-1" />
                Course Enrollment ({selectedCourseIds.size})
              </label>
            </div>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">Profile Information</h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileData?.name || ''} 
                    readOnly 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Student ID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileData?.studentId || ''} 
                    readOnly 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={profileData?.email || ''} 
                    readOnly 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileData?.department || ''} 
                    readOnly 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Academic Year</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileData?.year || ''} 
                    readOnly 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Current Semester</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileData?.semester || ''} 
                    readOnly 
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <AlertCircle size={14} className="me-1" />
                  Profile information is managed by the academic office. Contact administration to update these details.
                </small>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title mb-1">Course Enrollment</h5>
                  <p className="text-muted mb-0">
                    Select courses for {profileData?.semester} {profileData?.year} semester
                  </p>
                </div>
                <div className="text-end">
                  <div className="badge bg-primary fs-6 mb-2">
                    Total Credits: {totalCredits}
                  </div>
                  <br />
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={handleSaveCourses}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={14} className="me-1 spinner-border spinner-border-sm" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} className="me-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Course List */}
              <div className="row g-3">
                {availableCourses.map((course) => {
                  const isSelected = selectedCourseIds.has(course.id);
                  const isFull = courseUtils.isCourseFullyEnrolled(course);
                  const isEnrolled = enrolledCourses.some(uc => uc.courseId === course.id);

                  return (
                    <div key={course.id} className="col-12">
                      <div className={`card h-100 ${isSelected ? 'border-success' : ''}`}>
                        <div className="card-body">
                          <div className="d-flex align-items-start gap-3">
                            <div className="form-check mt-1">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`course-${course.id}`}
                                checked={isSelected}
                                onChange={(e) => handleCourseSelection(course.id, e.target.checked)}
                                disabled={!isSelected && isFull}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">
                                    {courseUtils.formatCourseDisplayName(course)}
                                    {isEnrolled && (
                                      <span className="badge bg-success ms-2">Currently Enrolled</span>
                                    )}
                                    {isFull && !isSelected && (
                                      <span className="badge bg-danger ms-2">Full</span>
                                    )}
                                  </h6>
                                  <p className="text-muted mb-1 small">{course.description}</p>
                                </div>
                                <div className="text-end">
                                  <div className="badge bg-secondary">{course.credits} Credits</div>
                                </div>
                              </div>
                              <div className="row g-2 small text-muted">
                                <div className="col-sm-4">
                                  <strong>Department:</strong> {course.department}
                                </div>
                                <div className="col-sm-4">
                                  <strong>Lecturer:</strong> {course.lecturer?.name || 'TBA'}
                                </div>
                                <div className="col-sm-4">
                                  <strong>Enrollment:</strong> {course.enrollmentCount || 0}/{course.maxEnrollment || 'Unlimited'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {availableCourses.length === 0 && (
                <div className="text-center py-5">
                  <BookOpen size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No courses available</h5>
                  <p className="text-muted">
                    No courses are currently available for enrollment. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettingsPage;