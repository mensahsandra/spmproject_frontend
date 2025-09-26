import React from "react";
import endPoint from "../../utils/endpoint";

type Course = {
  id: string;
  name: string;
};

type ExportComponentProps = {
  courses: Course[];
  selectedCourse: string;
  setSelectedCourse: (value: string) => void;
};

const ExportComponent: React.FC<ExportComponentProps> = ({
  courses,
  selectedCourse,
  setSelectedCourse,
}) => {
  const handleExport = async () => {
    if (!selectedCourse) {
      alert("Please select a course before exporting.");
      return;
    }

    try {
      const response = await fetch(
        `${endPoint}/api/attendance-record/course/${selectedCourse}`
      );
      const data = await response.json();

      // backend in repo returns shape { status, data } or raw array per user sample
      const rows: any[] = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      if (!Array.isArray(rows) || rows.length === 0) {
        alert("No attendance data found for this course.");
        return;
      }

      const headers = Object.keys(rows[0] || {});
      const csvRows: string[] = [];
      csvRows.push(headers.join(","));
      rows.forEach((row) => {
        const values = headers.map((h) => JSON.stringify((row as any)[h] ?? ""));
        csvRows.push(values.join(","));
      });
      const csvString = csvRows.join("\n");

      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `course_${selectedCourse}_attendance.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        style={{
          flex: 1,
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      >
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleExport}
        style={{
          padding: "8px 16px",
          background: "#047857",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Export CSV
      </button>
    </div>
  );
};

export default ExportComponent;
