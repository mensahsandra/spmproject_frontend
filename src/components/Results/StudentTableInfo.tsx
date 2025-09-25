import React from "react";

interface StudentInfo {
    name: string;
    indexNo: string;
    studentId: string;
    email: string;
    programme: string;
    level: number;
}

const StudentInfoTable: React.FC<StudentInfo> = ({
    name,
    indexNo,
    studentId,
    email,
    programme,
    level,
}) => {
    return (
        <table className="table table-bordered mb-4">
            <tbody>
                <tr>
                    <td><strong>Name:</strong> {name}</td>
                    <td><strong>Index No.:</strong> {indexNo}</td>
                    <td><strong>Student ID:</strong> {studentId}</td>
                    <td><strong>Email:</strong> {email}</td>
                </tr>
                <tr>
                    <td colSpan={2}><strong>Programme:</strong> {programme}</td>
                    <td><strong>Level:</strong> {level}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
};

export default StudentInfoTable;
