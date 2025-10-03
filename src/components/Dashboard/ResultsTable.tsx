// React import removed - not needed in this component

interface ResultsTableProps {
  data: { courseCode: string; courseTitle: string; grade: string }[];
}

export default function ResultsTable({ data }: ResultsTableProps) {
  if (!data.length) return <p className="text-muted text-center mt-4">No results available.</p>;

  return (
    <table className="table table-bordered mt-4">
      <thead className="table-light">
        <tr>
          <th>Course Code</th>
          <th>Course Title</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ courseCode, courseTitle, grade }, idx) => (
          <tr key={idx}>
            <td>{courseCode}</td>
            <td>{courseTitle}</td>
            <td>{grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}