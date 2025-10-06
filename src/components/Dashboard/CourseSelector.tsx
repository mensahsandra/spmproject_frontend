import type { Course } from "../../types/grade";
import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  courses: Course[];
  selectedCourseId?: string;
  onSelectCourse: (courseId: string) => void;
}

export default function CourseSelector({
  courses,
  selectedCourseId,
  onSelectCourse
}: Props) {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <div className="d-flex flex-wrap align-items-end gap-3">
          <div className="flex-grow-1">
            <label className="form-label fw-semibold">Select Course</label>
            <select
              className="form-select"
              value={selectedCourseId ?? ""}
              onChange={(e) => onSelectCourse(e.target.value)}
            >
              <option value="" disabled>Select a course you teach</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="text-muted small">
            You can only update grades for courses you’re assigned to.
          </div>
        </div>
      </div>
    </div>
  );
}
