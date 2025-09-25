import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DisplayResultPage: React.FC = () => {
    const userDataRaw = localStorage.getItem("user");
    const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
    const studentInfo = {
        name: (userData.name || '').trim() || 'Ransford Yeboah',
        indexNo: userData.indexNo || '9123456',
        studentId: userData.studentId || "21058161",
        email: userData.email || "yransford178",
        programme: userData.programme || "BSc. Information Technology IDL - TOPUP",
        year: userData.year || "2025",
        option: userData.option || "General",
    };
    const now = new Date();
    const dateString = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    const blocks = [
        {
            code: "BIT 364",
            name: "Entrepreneurship",
            rows: [
                { type: "Assignment", option: "Graded", marks: 10 },
                { type: "Project Work", option: "-", marks: "-" },
                { type: "Mid- Semester", option: "Graded", marks: 10 },
            ],
        },
        {
            code: "BIT 366",
            name: "Computer Graphics & Image Processing",
            rows: [
                { type: "Assignment", option: "-", marks: "-" },
                { type: "Project Work", option: "-", marks: "-" },
                { type: "Mid- Semester", option: "-", marks: 15 },
            ],
        },
    ];
    const navigate = useNavigate();
    const location = useLocation();
    const { year = "2024/2025", block = "Block 1" } = (location.state as any) || {};

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Green banner */}
            <div style={{ width: '100%', height: '70px', background: '#d9f5e6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.35rem', color: '#222' }}>KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY, KUMASI</div>
                    <div style={{ fontWeight: 500, fontSize: '1.1rem', color: '#16a34a' }}>GRADES FOR  SEMESTER 1, {block.toUpperCase()}, {year}</div>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: '40px 32px', position: 'relative' }}>
                        {/* Student Info Card */}
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '0', marginBottom: '32px', background: '#f8fafc' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f3f6f9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                <tbody>
                                    <tr style={{ background: '#f3f6f9' }}>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', width: '180px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>Name:</td>
                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>{studentInfo.name}</td>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', width: '180px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>Year:</td>
                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5' }}>{studentInfo.year}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>Index No:</td>
                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>{studentInfo.indexNo}</td>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>Programme:</td>
                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5' }}>{studentInfo.programme}</td>
                                    </tr>
                                    <tr style={{ background: '#f3f6f9' }}>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>Student ID:</td>
                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>{studentInfo.studentId}</td>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #f0f2f5', borderRight: '2px solid #d1d5db' }}>Date:</td>
                                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5' }}>{dateString}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', borderRight: '2px solid #d1d5db' }}>Email:</td>
                                        <td style={{ padding: '12px 16px', borderRight: '2px solid #d1d5db' }}>{studentInfo.email}</td>
                                        <td style={{ fontWeight: 'bold', padding: '12px 16px', borderRight: '2px solid #d1d5db' }}>Option:</td>
                                        <td style={{ padding: '12px 16px' }}>{studentInfo.option}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Block/Course Tables */}
                        {blocks.map((block) => (
                            <div key={block.code} style={{ marginBottom: '32px' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc' }}>
                                            <th style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', borderRight: '2px solid #d1d5db', textAlign: 'left' }}>Course Code</th>
                                            <th style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', borderRight: '2px solid #d1d5db', textAlign: 'left' }}>Course Name</th>
                                            <th style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', borderRight: '2px solid #d1d5db', textAlign: 'left' }}>Type</th>
                                            <th style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', borderRight: '2px solid #d1d5db', textAlign: 'left' }}>Option</th>
                                            <th style={{ fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Total Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(block.rows) && block.rows.length > 0 ? (
                                            block.rows.map((row, i) => (
                                                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                                    {i === 0 && (
                                                        <td rowSpan={block.rows.length} style={{ padding: '12px 16px', borderBottom: '1px solid #f3f6f9', borderRight: '2px solid #d1d5db', verticalAlign: 'middle', fontWeight: 'bold' }}>{block.code}</td>
                                                    )}
                                                    {i === 0 && (
                                                        <td rowSpan={block.rows.length} style={{ padding: '12px 16px', borderBottom: '1px solid #f3f6f9', borderRight: '2px solid #d1d5db', verticalAlign: 'middle', fontWeight: 'bold' }}>{block.name}</td>
                                                    )}
                                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f6f9', borderRight: '2px solid #d1d5db' }}>{row.type}</td>
                                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f6f9', borderRight: '2px solid #d1d5db' }}>{row.option}</td>
                                                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f3f6f9' }}>{row.marks}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '12px' }}>No data available</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                        {/* Back Button */}
                        <div className="d-flex justify-content-center mt-4">
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
                                onClick={() => navigate(-1)}
                                onMouseOver={e => (e.currentTarget.style.background = '#16a34a')}
                                onMouseOut={e => (e.currentTarget.style.background = '#22c55e')}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayResultPage;
