import React from "react";

interface ResultHeaderProps {
  semester: number;
  academicYear: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ semester, academicYear }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="fw-bold">KNUST – Kwame Nkrumah University of Science and Technology</h2>
      <p className="text-muted">Report for Semester {semester}, {academicYear} Academic Year</p>
    </div>
  );
};

export default ResultHeader;