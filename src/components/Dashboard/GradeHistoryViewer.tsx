import type { GradeChangeLog } from "../../types/grade";

interface Props {
  history: GradeChangeLog[];
  loading?: boolean;
  title?: string;
}

export default function GradeHistoryViewer({ history, loading, title = "Grade Change History" }: Props) {
  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3">{title}</h5>
        <div className="table-responsive">
          <table className="table table-sm table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Course</th>
                <th>Old → New</th>
                <th>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}>Loading history…</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={5} className="text-muted">No changes recorded.</td></tr>
              ) : (
                history.map(h => (
                  <tr key={h.id}>
                    <td>{new Date(h.changedAt).toLocaleString()}</td>
                    <td>{h.studentName} ({h.studentId})</td>
                    <td>{h.courseCode}</td>
                    <td>
                      <span className="text-muted">{h.oldGrade ?? "—"}</span>
                      {" "}→{" "}
                      <span className="fw-semibold">{h.newGrade}</span>
                    </td>
                    <td>{h.changedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
