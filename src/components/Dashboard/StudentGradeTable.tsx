import type { EnrolledStudent } from "../../types/grade";
import { isValidGrade, normalizeGrade } from "../../utils/gradeUtils";

interface Props {
  students: EnrolledStudent[];
  editedGrades: Record<string, string>; // studentId -> input
  onGradeChange: (studentId: string, grade: string) => void;
  loading?: boolean;
}

export default function StudentGradeTable({
  students,
  editedGrades,
  onGradeChange,
  loading
}: Props) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Current Grade</th>
                <th>New Grade</th>
                <th>Validity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">Loading students…</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No enrolled students found for this course.
                  </td>
                </tr>
              ) : (
                students.map((s, idx) => {
                  const input = editedGrades[s.studentId] ?? "";
                  const valid = input ? isValidGrade(input) : true;
                  return (
                    <tr key={s.id}>
                      <td>{idx + 1}</td>
                      <td>{s.studentId}</td>
                      <td>{s.name}</td>
                      <td>{s.currentGrade ?? <span className="text-muted">—</span>}</td>
                      <td style={{ minWidth: 160 }}>
                        <input
                          className={`form-control ${input && !valid ? "is-invalid" : ""}`}
                          placeholder="A, B+, 86"
                          value={input}
                          onChange={(e) => onGradeChange(s.studentId, normalizeGrade(e.target.value))}
                        />
                      </td>
                      <td>
                        {input ? (
                          valid ? <span className="badge bg-success">Valid</span>
                            : <span className="badge bg-danger">Invalid</span>
                        ) : <span className="text-muted small">—</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer text-muted small">
        Allowed formats: Letter grades (A+, A, A-, …, F) or numeric 0–100.
      </div>
    </div>
  );
}
