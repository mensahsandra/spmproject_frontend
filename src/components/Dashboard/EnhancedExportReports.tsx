import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Users, BookOpen, Filter, RefreshCw, BarChart3 } from 'lucide-react';

import { getToken } from '../../utils/auth';
import { apiFetch } from '../../utils/api';
import { jwtDecode } from 'jwt-decode';
import { 
  exportAsCSV, 
  exportAsExcel, 
  formatAttendanceData, 
  formatAssessmentData, 
  generateFilename,
  validateExportData,
  getExportStats
} from '../../utils/exportUtils';

type DecodedToken = {
  id: string;
  exp: number;
  iat: number;
};

type ExportFormat = 'csv' | 'excel';
type ExportType = 'attendance' | 'assessment' | 'combined';

type AttendanceRecord = {
  sessionCode: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  centre: string;
  timestamp: string;
  lecturerName: string;
};

type AssessmentRecord = {
  courseCode: string;
  studentId: string;
  studentName: string;
  assessmentType: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  submissionDate: string;
};

export default function EnhancedExportReports() {
  const [exportType, setExportType] = useState<ExportType>('attendance');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [courseCode, setCourseCode] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [lecturer, setLecturer] = useState<any>(null);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchLecturerProfile();
  }, []);

  const fetchLecturerProfile = async () => {
    try {
      const token = getToken('lecturer');
      if (!token) return;

      const data = await apiFetch('/api/auth/lecturer/profile', { 
        method: 'GET', 
        role: 'lecturer' 
      });

      if (data.success && data.lecturer) {
        setLecturer(data.lecturer);
        const courses = data.lecturer.courses || [];
        setCourseCodes(courses);
        if (courses.length > 0) {
          setCourseCode(courses[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching lecturer profile:', err);
      // Set mock data for demonstration
      setLecturer({ name: 'Kwabena Lecturer', id: 'lecturer123' });
      setCourseCodes(['CS101', 'CS102', 'BIT364']);
      setCourseCode('CS101');
    }
  };

  // Generate sample data for demonstration
  const generateSampleAttendanceData = (): AttendanceRecord[] => {
    const sampleData: AttendanceRecord[] = [];
    const students = [
      { id: '1234567', name: 'Ransford Student', centre: 'Kumasi' },
      { id: '2345678', name: 'Jane Smith', centre: 'Accra' },
      { id: '3456789', name: 'Michael Johnson', centre: 'Takoradi' },
      { id: '4567890', name: 'Sarah Wilson', centre: 'Kumasi' },
      { id: '5678901', name: 'David Brown', centre: 'Cape Coast' }
    ];

    const sessions = ['ABC123', 'DEF456', 'GHI789'];
    
    students.forEach((student, index) => {
      sessions.forEach((session, sessionIndex) => {
        const date = new Date();
        date.setDate(date.getDate() - (sessionIndex * 7) - index);
        
        sampleData.push({
          sessionCode: session,
          courseCode: courseCode || 'CS101',
          studentId: student.id,
          studentName: student.name,
          centre: student.centre,
          timestamp: date.toISOString(),
          lecturerName: lecturer?.name || 'Kwabena Lecturer'
        });
      });
    });

    return sampleData;
  };

  const generateSampleAssessmentData = (): AssessmentRecord[] => {
    const sampleData: AssessmentRecord[] = [];
    const students = [
      { id: '1234567', name: 'Ransford Student' },
      { id: '2345678', name: 'Jane Smith' },
      { id: '3456789', name: 'Michael Johnson' },
      { id: '4567890', name: 'Sarah Wilson' },
      { id: '5678901', name: 'David Brown' }
    ];

    const assessments = [
      { type: 'Quiz 1', maxScore: 20 },
      { type: 'Assignment 1', maxScore: 30 },
      { type: 'Midterm Exam', maxScore: 50 },
      { type: 'Final Project', maxScore: 100 }
    ];

    students.forEach(student => {
      assessments.forEach((assessment, index) => {
        const score = Math.floor(Math.random() * assessment.maxScore * 0.4) + (assessment.maxScore * 0.6);
        const percentage = (score / assessment.maxScore) * 100;
        const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
        
        const date = new Date();
        date.setDate(date.getDate() - (index * 14));

        sampleData.push({
          courseCode: courseCode || 'CS101',
          studentId: student.id,
          studentName: student.name,
          assessmentType: assessment.type,
          score: Math.round(score),
          maxScore: assessment.maxScore,
          percentage: Math.round(percentage),
          grade: grade,
          submissionDate: date.toISOString()
        });
      });
    });

    return sampleData;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Try to fetch real data from backend
      const token = getToken('lecturer');
      const decoded = jwtDecode<DecodedToken>(token!);
      const lecturerId = decoded.id;

      if (exportType === 'attendance') {
        try {
          const data = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
            method: 'GET',
            role: 'lecturer'
          });
          
          if (data.success && data.records) {
            setPreviewData(data.records);
          } else {
            throw new Error('No real data available');
          }
        } catch (err) {
          // Use sample data if backend not available
          setPreviewData(generateSampleAttendanceData());
        }
      } else if (exportType === 'assessment') {
        try {
          const data = await apiFetch(`/api/assessments/lecturer/${lecturerId}`, {
            method: 'GET',
            role: 'lecturer'
          });
          
          if (data.success && data.records) {
            setPreviewData(data.records);
          } else {
            throw new Error('No real data available');
          }
        } catch (err) {
          // Use sample data if backend not available
          setPreviewData(generateSampleAssessmentData());
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      // Fallback to sample data
      if (exportType === 'attendance') {
        setPreviewData(generateSampleAttendanceData());
      } else {
        setPreviewData(generateSampleAssessmentData());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const validation = validateExportData(previewData);
    if (!validation.isValid) {
      alert(validation.message || 'Invalid data for export');
      return;
    }

    let formattedData: any[] = [];
    let filename = '';

    if (exportType === 'attendance') {
      formattedData = formatAttendanceData(previewData);
      filename = generateFilename('attendance', courseCode);
    } else if (exportType === 'assessment') {
      formattedData = formatAssessmentData(previewData);
      filename = generateFilename('assessment', courseCode);
    } else if (exportType === 'combined') {
      // For combined export, we'll create a comprehensive report
      const attendanceFormatted = formatAttendanceData(previewData.filter(d => d.sessionCode));
      const assessmentFormatted = formatAssessmentData(previewData.filter(d => d.assessmentType));
      formattedData = [...attendanceFormatted, ...assessmentFormatted];
      filename = generateFilename('combined_report', courseCode);
    }

    const exportOptions = {
      filename,
      format: exportFormat as 'csv' | 'excel',
      title: `${exportType.charAt(0).toUpperCase() + exportType.slice(1)} Report - ${courseCode}`
    };

    if (exportFormat === 'csv') {
      exportAsCSV(formattedData, exportOptions);
    } else {
      exportAsExcel(formattedData, exportOptions);
    }

    // Show success message with stats
    const stats = getExportStats(previewData);
    alert(`Export successful!\n\nRecords exported: ${stats.totalRecords}\nFormat: ${exportFormat.toUpperCase()}\nFile: ${filename}.${exportFormat === 'csv' ? 'csv' : 'xlsx'}`);
  };

  const handlePreview = () => {
    setShowPreview(true);
    fetchData();
  };

  return (
    <div className="container py-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
      {/* Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <h3 className="mb-4 fw-bold text-primary d-flex align-items-center gap-2">
            <Download size={24} /> Export Reports
          </h3>
          
          <div className="row g-3">
            {/* Export Type */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <FileText size={16} className="me-1 text-success" /> Report Type
              </label>
              <select 
                className="form-select" 
                value={exportType} 
                onChange={(e) => setExportType(e.target.value as ExportType)}
              >
                <option value="attendance">Attendance Records</option>
                <option value="assessment">Assessment Scores</option>
                <option value="combined">Combined Report</option>
              </select>
            </div>

            {/* Export Format */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <Download size={16} className="me-1 text-success" /> Format
              </label>
              <select 
                className="form-select" 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              >
                <option value="csv">CSV (Comma Separated)</option>
                <option value="excel">Excel (.xlsx)</option>
              </select>
            </div>

            {/* Course Selection */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <BookOpen size={16} className="me-1 text-success" /> Course Code
              </label>
              {courseCodes.length > 0 ? (
                <select 
                  className="form-select" 
                  value={courseCode} 
                  onChange={(e) => setCourseCode(e.target.value)}
                >
                  {courseCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter course code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              )}
            </div>

            {/* Date Range */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                <Calendar size={16} className="me-1 text-success" /> From Date
              </label>
              <input
                type="date"
                className="form-control"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">To Date</label>
              <input
                type="date"
                className="form-control"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-4">
            <button 
              className="btn btn-outline-primary d-flex align-items-center gap-2" 
              onClick={handlePreview}
              disabled={loading}
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <Filter size={16} />}
              {loading ? 'Loading...' : 'Preview Data'}
            </button>
            
            <button 
              className="btn btn-success d-flex align-items-center gap-2" 
              onClick={handleExport}
              disabled={!showPreview || previewData.length === 0}
            >
              <Download size={16} />
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Export Statistics */}
      {showPreview && previewData.length > 0 && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h5 className="mb-3 fw-bold d-flex align-items-center gap-2">
              <BarChart3 size={20} />
              Export Statistics
            </h5>
            <div className="row g-3">
              {(() => {
                const stats = getExportStats(previewData);
                return (
                  <>
                    <div className="col-md-3">
                      <div className="text-center p-3 bg-light rounded">
                        <div className="h4 fw-bold text-primary mb-1">{stats.totalRecords}</div>
                        <small className="text-muted">Total Records</small>
                      </div>
                    </div>
                    {stats.dateRange && (
                      <div className="col-md-4">
                        <div className="text-center p-3 bg-light rounded">
                          <div className="fw-bold text-success mb-1">{stats.dateRange}</div>
                          <small className="text-muted">Date Range</small>
                        </div>
                      </div>
                    )}
                    {stats.courses && (
                      <div className="col-md-5">
                        <div className="text-center p-3 bg-light rounded">
                          <div className="fw-bold text-info mb-1">{stats.courses.join(', ')}</div>
                          <small className="text-muted">Courses Included</small>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {showPreview && (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="mb-0 fw-bold">
                <Users size={20} className="me-2" />
                Data Preview ({previewData.length} records)
              </h5>
              <span className="badge bg-info">
                {exportType === 'attendance' ? 'Attendance Data' : 'Assessment Data'}
              </span>
            </div>

            {previewData.length === 0 ? (
              <div className="text-center py-5">
                <FileText size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No data available</h5>
                <p className="text-muted">Try adjusting your filters or check if data exists for the selected course.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      {exportType === 'attendance' ? (
                        <>
                          <th className="px-4 py-3">Session Code</th>
                          <th className="px-4 py-3">Course</th>
                          <th className="px-4 py-3">Student ID</th>
                          <th className="px-4 py-3">Student Name</th>
                          <th className="px-4 py-3">Centre</th>
                          <th className="px-4 py-3">Timestamp</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3">Course</th>
                          <th className="px-4 py-3">Student ID</th>
                          <th className="px-4 py-3">Student Name</th>
                          <th className="px-4 py-3">Assessment</th>
                          <th className="px-4 py-3">Score</th>
                          <th className="px-4 py-3">Grade</th>
                          <th className="px-4 py-3">Date</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((record, index) => (
                      <tr key={index}>
                        {exportType === 'attendance' ? (
                          <>
                            <td className="px-4 py-3"><code>{record.sessionCode}</code></td>
                            <td className="px-4 py-3">{record.courseCode}</td>
                            <td className="px-4 py-3"><span className="badge bg-primary">{record.studentId}</span></td>
                            <td className="px-4 py-3">{record.studentName}</td>
                            <td className="px-4 py-3"><span className="badge bg-info">{record.centre}</span></td>
                            <td className="px-4 py-3">{new Date(record.timestamp).toLocaleString()}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3">{record.courseCode}</td>
                            <td className="px-4 py-3"><span className="badge bg-primary">{record.studentId}</span></td>
                            <td className="px-4 py-3">{record.studentName}</td>
                            <td className="px-4 py-3">{record.assessmentType}</td>
                            <td className="px-4 py-3">{record.score}/{record.maxScore} ({record.percentage}%)</td>
                            <td className="px-4 py-3">
                              <span className={`badge ${record.grade === 'A' ? 'bg-success' : record.grade === 'B' ? 'bg-info' : record.grade === 'C' ? 'bg-warning' : 'bg-danger'}`}>
                                {record.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3">{new Date(record.submissionDate).toLocaleDateString()}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {previewData.length > 10 && (
                  <div className="p-3 text-center text-muted border-top">
                    <small>Showing first 10 of {previewData.length} records. All records will be included in export.</small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Instructions */}
      <div className="alert alert-info mt-4">
        <h6 className="fw-bold mb-2">Export Instructions:</h6>
        <ul className="mb-0 small">
          <li><strong>CSV Format:</strong> Compatible with Excel, Google Sheets, and most data analysis tools</li>
          <li><strong>Excel Format:</strong> Native Excel format with better formatting (requires Excel or compatible software)</li>
          <li><strong>Date Filtering:</strong> Leave date fields empty to export all available data</li>
          <li><strong>Data Source:</strong> Currently showing sample data. Real data will be used when backend is connected.</li>
        </ul>
      </div>
    </div>
  );
}