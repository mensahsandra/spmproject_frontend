import React from "react";

interface AcademicYearSelectProps {
  year: string;
  setYear: (year: string) => void;
}

const AcademicYearSelect: React.FC<AcademicYearSelectProps> = ({ year, setYear }) => {
  // IDL recent 2 years (4 semesters)
  const academicYears = [
    "2023-2024",
    "2024-2025",
  ];

  return (
    <select
      className="form-select rounded-3"
      value={year}
      onChange={(e) => setYear(e.target.value)}
    >
      <option value="">Select Academic Year</option>
      {academicYears.map((yr) => (
        <option key={yr} value={yr}>
          {yr}
        </option>
      ))}
    </select>
  );
};

export default AcademicYearSelect;