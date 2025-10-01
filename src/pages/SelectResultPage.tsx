import React, { useState } from "react";
// import AcademicYearSelect from "../components/Results/AcademicYearSelect";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

const ResultsPage: React.FC = () => {
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");
    const [block, setBlock] = useState("");
    const navigate = useNavigate();
    // Use useLocation for correct state typing
    // import { useLocation } from "react-router-dom"; at top if not present
    // const location = useLocation();
    // const showCurrent = (location.state && (location.state as any).showCurrent) || false;
    const showCurrent = false; // Default to false for now, update as needed

    const handleDisplay = () => {
        if (!year || !semester || (!showCurrent && !block)) {
            alert("Please select academic year, semester" + (!showCurrent ? " and block" : ""));
            return;
        }
        navigate("/display-result", { state: { year, semester, block, showCurrent } });
    };

    return (
        <DashboardLayout maxWidth={800}>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: '40px 32px', position: 'relative' }}>
                        <h2 className="fw-bold text-center mb-4" style={{ color: '#222', fontSize: '2.2rem' }}>Check Grade</h2>
                        <div className="d-flex flex-column align-items-center" style={{ gap: '32px' }}>
                            <div style={{ width: '100%' }}>
                                <div style={{ fontWeight: 500, textAlign: 'center', marginBottom: '10px', fontSize: '1.15rem' }}>Select Academic Year</div>
                                    <select
                                        className="form-select rounded-3"
                                        value={year}
                                        onChange={e => setYear(e.target.value)}
                                    >
                                        <option value="">----</option>
                                        <option value="2023-2024">2023-2024</option>
                                        <option value="2024-2025">2024-2025</option>
                                    </select>
                            </div>
                            <div style={{ width: '100%' }}>
                                <div style={{ fontWeight: 500, textAlign: 'center', marginBottom: '10px', fontSize: '1.15rem' }}>Select Semester</div>
                                    <select
                                        className="form-select rounded-3"
                                        value={semester}
                                        onChange={e => setSemester(e.target.value)}
                                    >
                                        <option value="">----</option>
                                        <option value="First Semester">First Semester</option>
                                        <option value="Second Semester">Second Semester</option>
                                    </select>
                            </div>
                            <div style={{ width: '100%' }}>
                                <div style={{ fontWeight: 500, textAlign: 'center', marginBottom: '10px', fontSize: '1.15rem' }}>Select Block</div>
                                <select
                                    id="block"
                                    className="form-select"
                                    value={block}
                                    onChange={e => setBlock(e.target.value)}
                                    style={{ fontWeight: 500, fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #d1d5db', padding: '8px 12px', marginTop: '4px' }}
                                >
                                        <option value="">----</option>
                                    <option value="Block 1">Block 1</option>
                                    <option value="Block 2">Block 2</option>
                                    <option value="Block 3">Block 3</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-5">
                            <button
                                style={{
                                    background: '#22c55e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '18px 0',
                                    fontWeight: 600,
                                    fontSize: '1.25rem',
                                    cursor: 'pointer',
                                    width: '100%',
                                    boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
                                    transition: 'background 0.2s, transform 0.2s',
                                }}
                                onClick={handleDisplay}
                                onMouseOver={e => (e.currentTarget.style.background = '#16a34a')}
                                onMouseOut={e => (e.currentTarget.style.background = '#22c55e')}
                            >
                                Display Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ResultsPage;
