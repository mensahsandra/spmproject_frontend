import React from "react";

interface CreditSummary {
  creditsRegistered: { semester: number; cumulative: number };
  creditsObtained: { semester: number; cumulative: number };
  cwa: { semester: number; cumulative: number };
}

const CreditSummaryTable: React.FC<CreditSummary> = ({
  creditsRegistered,
  creditsObtained,
  cwa,
}) => {
  return (
    <table className="table table-bordered">
      <thead className="table-light">
        <tr>
          <th>Description</th>
          <th>Semester</th>
          <th>Cumulative</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Credits Registered</td>
          <td>{creditsRegistered.semester}</td>
          <td>{creditsRegistered.cumulative}</td>
        </tr>
        <tr>
          <td>Credits Obtained</td>
          <td>{creditsObtained.semester}</td>
          <td>{creditsObtained.cumulative}</td>
        </tr>
        <tr>
          <td>CWA</td>
          <td>{cwa.semester}</td>
          <td>{cwa.cumulative}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CreditSummaryTable;