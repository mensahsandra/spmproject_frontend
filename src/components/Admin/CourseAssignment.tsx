import React, { useState } from 'react';

interface CourseAssignmentProps {
  onAssignmentComplete?: () => void;
}

const CourseAssignment: React.FC<CourseAssignmentProps> = ({ onAssignmentComplete }) => {
  const [lecturerEmail, setLecturerEmail] = useState('kwabena@knust.edu.gh');
  const [courseCode, setCourseCode] = useState('BIT');
  const [courseName, setCourseName] = useState('BSc in Information Technology');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAssignCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/assign-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          lecturerEmail,
          courseCode,
          courseName
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Course ${courseCode} successfully assigned to ${lecturerEmail}`);
        if (onAssignmentComplete) {
          onAssignmentComplete();
        }
      } else {
        setError(data.message || 'Failed to assign course');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Assign Course to Lecturer</h5>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleAssignCourse}>
          <div className="mb-3">
            <label className="form-label">Lecturer Email</label>
            <input
              type="email"
              className="form-control"
              value={lecturerEmail}
              onChange={(e) => setLecturerEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Course Code</label>
            <input
              type="text"
              className="form-control"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Course Name</label>
            <input
              type="text"
              className="form-control"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Assigning...' : 'Assign Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseAssignment;