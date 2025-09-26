interface Props {
  onSave: () => void;
  onReset: () => void;
  disabled?: boolean;
  dirtyCount: number;
}

export default function GradeSubmissionActions({
  onSave,
  onReset,
  disabled,
  dirtyCount
}: Props) {
  return (
    <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
      <div className="text-muted">
        {dirtyCount > 0 ? `${dirtyCount} unsaved change(s)` : "No pending changes"}
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-secondary" onClick={onReset} disabled={disabled}>
          Reset
        </button>
        <button className="btn btn-primary" onClick={onSave} disabled={disabled || dirtyCount === 0}>
          Save Grades
        </button>
      </div>
    </div>
  );
}
