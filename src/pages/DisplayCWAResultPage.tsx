import React from "react";
import { useNavigate } from "react-router-dom";

const DisplayCWAResultPage: React.FC = () => {
    // Example data, replace with real API or props
    const cwa = {
        semester: 75.3,
        cumulative: 73.8,
    };
    const credits = {
        registered: { semester: 18, cumulative: 48 },
        obtained: { semester: 18, cumulative: 48 },
    };
    const navigate = useNavigate();

    return (
        <div className="container py-4" style={{ background: "#f0f8f5" }}>
            <div className="p-4 rounded-4 shadow-sm" style={{ background: "#fff", maxWidth: 500, margin: "0 auto", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                <h2 className="fw-bold text-center mb-4" style={{ color: "#22c55e" }}>Current CWA</h2>
                <div className="mb-3 text-center">
                    <span style={{ fontSize: "1.2rem", fontWeight: 500 }}>Semester CWA:</span>
                    <span style={{ fontSize: "2.2rem", fontWeight: 700, color: "#16a34a", marginLeft: 8 }}> {cwa.semester}</span>
                </div>
                <div className="mb-3 text-center">
                    <span style={{ fontSize: "1.2rem", fontWeight: 500 }}>Cumulative CWA:</span>
                    <span style={{ fontSize: "2.2rem", fontWeight: 700, color: "#0e7490", marginLeft: 8 }}> {cwa.cumulative}</span>
                </div>
                <div className="mb-4 text-center">
                    <span style={{ fontWeight: 500 }}>Credits Registered:</span> {credits.registered.semester} (Semester), {credits.registered.cumulative} (Cumulative)
                    <br />
                    <span style={{ fontWeight: 500 }}>Credits Obtained:</span> {credits.obtained.semester} (Semester), {credits.obtained.cumulative} (Cumulative)
                </div>
                <div className="d-flex justify-content-center gap-2 mt-4">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default DisplayCWAResultPage;
