// Export utilities for CSV and Excel formats

export interface ExportData {
  [key: string]: any;
}

export interface ExportOptions {
  filename: string;
  format: 'csv' | 'excel';
  headers?: string[];
  title?: string;
}

/**
 * Convert array of objects to CSV format
 */
export const convertToCSV = (data: ExportData[], headers?: string[]): string => {
  if (data.length === 0) return '';
  
  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const dataRows = data.map(row => 
    csvHeaders.map(header => {
      let value = row[header] || '';
      
      // Handle different data types
      if (value instanceof Date) {
        value = value.toISOString();
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else {
        value = String(value);
      }
      
      // Escape commas and quotes in CSV
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Convert array of objects to Excel-compatible CSV with BOM
 */
export const convertToExcelCSV = (data: ExportData[], headers?: string[]): string => {
  const csv = convertToCSV(data, headers);
  // Add BOM for proper Excel UTF-8 handling
  return '\uFEFF' + csv;
};

/**
 * Download file to user's computer
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Export data as CSV file
 */
export const exportAsCSV = (data: ExportData[], options: ExportOptions): void => {
  const csv = convertToCSV(data, options.headers);
  const filename = options.filename.endsWith('.csv') ? options.filename : `${options.filename}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
};

/**
 * Export data as Excel-compatible CSV file
 */
export const exportAsExcel = (data: ExportData[], options: ExportOptions): void => {
  const csv = convertToExcelCSV(data, options.headers);
  const filename = options.filename.endsWith('.xlsx') ? options.filename : `${options.filename}.xlsx`;
  downloadFile(csv, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

/**
 * Format data for attendance export
 */
export const formatAttendanceData = (records: any[]): ExportData[] => {
  return records.map(record => ({
    'Session Code': record.sessionCode || record.session_code,
    'Course Code': record.courseCode || record.course_code,
    'Student ID': record.studentId || record.student_id,
    'Student Name': record.studentName || record.student_name,
    'Centre': record.centre || record.center,
    'Date': new Date(record.timestamp || record.created_at).toLocaleDateString(),
    'Time': new Date(record.timestamp || record.created_at).toLocaleTimeString(),
    'Lecturer': record.lecturerName || record.lecturer_name,
    'Status': 'Present'
  }));
};

/**
 * Format data for assessment export
 */
export const formatAssessmentData = (records: any[]): ExportData[] => {
  return records.map(record => ({
    'Course Code': record.courseCode || record.course_code,
    'Student ID': record.studentId || record.student_id,
    'Student Name': record.studentName || record.student_name,
    'Assessment Type': record.assessmentType || record.assessment_type,
    'Score': record.score,
    'Max Score': record.maxScore || record.max_score,
    'Percentage': record.percentage || Math.round((record.score / (record.maxScore || record.max_score)) * 100),
    'Grade': record.grade,
    'Submission Date': new Date(record.submissionDate || record.submission_date).toLocaleDateString(),
    'Feedback': record.feedback || ''
  }));
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (prefix: string, courseCode?: string): string => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const course = courseCode ? `_${courseCode}` : '';
  return `${prefix}${course}_${timestamp}`;
};

/**
 * Validate export data
 */
export const validateExportData = (data: any[]): { isValid: boolean; message?: string } => {
  if (!Array.isArray(data)) {
    return { isValid: false, message: 'Data must be an array' };
  }
  
  if (data.length === 0) {
    return { isValid: false, message: 'No data to export' };
  }
  
  if (data.some(item => typeof item !== 'object' || item === null)) {
    return { isValid: false, message: 'All data items must be objects' };
  }
  
  return { isValid: true };
};

/**
 * Get export statistics
 */
export const getExportStats = (data: any[]): { totalRecords: number; dateRange?: string; courses?: string[] } => {
  const stats = {
    totalRecords: data.length
  };
  
  // Get date range if timestamp field exists
  const timestamps = data
    .map(item => item.timestamp || item.created_at || item.submissionDate || item.submission_date)
    .filter(Boolean)
    .map(ts => new Date(ts))
    .sort((a, b) => a.getTime() - b.getTime());
  
  if (timestamps.length > 0) {
    const earliest = timestamps[0].toLocaleDateString();
    const latest = timestamps[timestamps.length - 1].toLocaleDateString();
    (stats as any).dateRange = earliest === latest ? earliest : `${earliest} - ${latest}`;
  }
  
  // Get unique courses
  const courses = [...new Set(data.map(item => item.courseCode || item.course_code).filter(Boolean))];
  if (courses.length > 0) {
    (stats as any).courses = courses;
  }
  
  return stats;
};