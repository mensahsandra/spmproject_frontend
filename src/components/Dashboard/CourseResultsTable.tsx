import React from "react";

interface Course {
  code: string;
  title: string;
  credits: number;
  totalMark: number;
  grade: string;
}

interface CourseResultsTableProps {
  courses: Course[];
}

const CourseResultsTable: React.FC<CourseResultsTableProps> = ({ courses }) => {
  return (
    <table className="table table-striped table-bordered mb-4">
      <thead className="table-light">
        <tr>
          <th>Course Code</th>
          <th>Course Title</th>
          <th>Credits</th>
          <th>Total Mark</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, index) => (
          <tr key={index}>
            <td>{course.code}</td>
            <td>{course.title}</td>
            <td>{course.credits}</td>
            <td>{course.totalMark}</td>
            <td>{course.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CourseResultsTable;