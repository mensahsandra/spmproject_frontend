import React from "react";

interface SemesterSelectProps {
    semester: string;
    setSemester: (semester: string) => void;
}

const SemesterSelect: React.FC<SemesterSelectProps> = ({ semester, setSemester }) => {
    const semesters = ["First Semester", "Second Semester"];

    return (
        <select
            className="form-select rounded-3"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
        >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
                <option key={sem} value={sem}>
                    {sem}
                </option>
            ))}
        </select>
    );
};

export default SemesterSelect;
