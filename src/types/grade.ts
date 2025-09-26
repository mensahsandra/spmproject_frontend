export type Course = {
  id: string;       // unique id (e.g., course code or DB id)
  code: string;     // e.g., BIT364
  title: string;    // e.g., Distributed Systems
  semester?: string | number; // e.g., 1 | 2 or "First"
};

export type EnrolledStudent = {
  id: string;        // DB id if available
  studentId: string; // index number
  name: string;
  currentGrade?: string | number | null;
};

export type GradeChangeLog = {
  id: string;
  changedAt: string | number | Date;
  studentName: string;
  studentId: string;
  courseCode: string;
  oldGrade?: string | number | null;
  newGrade: string | number;
  changedBy: string;
};
