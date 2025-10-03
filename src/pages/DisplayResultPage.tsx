import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

const DisplayResultPage: React.FC = () => {
    const userDataRaw = localStorage.getItem("user");
    const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
    const studentInfo = {
        name: (userData.name || '').trim() || 'Ransford Yeboah',
        indexNo: userData.indexNo || '9444114',
        studentId: userData.studentId || "21058161",
        email: userData.email || "yransford178",
        programme: userData.programme || "BSc. Information Technology IDL - TOPUP",
        year: userData.year || "2025",
        option: userData.option || "General",
    };
    const now = new Date();
    const dateString = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get parameters from URL
    const urlParams = new URLSearchParams(location.search);
    const selectedYear = urlParams.get('year') || "2024-2025";
    const selectedSemester = urlParams.get('semester') || "First Semester";
    const selectedBlock = urlParams.get('block') || "Block 1";

    // Block-specific course data
    const blockData: Record<string, any[]> = {
        "Block 1": [
            {
                code: "BIT 364",
                name: "ENTREPRENEURSHIP",
                rows: [
                    { type: "Assignment", option: "-", marks: "-" },
                    { type: "Mid Semester", option: "Graded", marks: 15 },
                    { type: "Final Examination", option: "Graded", marks: 60 },
                ],
            },
            {
                code: "BIT 364",
                name: "COMPUTER GRAPHICS & IMAGE PROCESSING",
                rows: [
                    { type: "Assignment", option: "Graded", marks: 5 },
                    { type: "Mid Semester", option: "Graded", marks: 10 },
                    { type: "Final Examination", option: "-", marks: "-" },
                ],
            },
        ],
        "Block 2": [
            {
                code: "BIT 365",
                name: "WEB DEVELOPMENT",
                rows: [
                    { type: "Assignment", option: "Graded", marks: 8 },
                    { type: "Mid Semester", option: "Graded", marks: 12 },
                    { type: "Final Examination", option: "Graded", marks: 55 },
                ],
            },
        ],
        "Block 3": [
            {
                code: "BIT 366",
                name: "DATABASE MANAGEMENT",
                rows: [
                    { type: "Assignment", option: "Graded", marks: 10 },
                    { type: "Mid Semester", option: "Graded", marks: 14 },
                    { type: "Final Examination", option: "Graded", marks: 58 },
                ],
            },
            {
                code: "BIT 367",
                name: "NETWORK SECURITY",
                rows: [
                    { type: "Assignment", option: "Graded", marks: 7 },
                    { type: "Mid Semester", option: "Graded", marks: 11 },
                    { type: "Final Examination", option: "Graded", marks: 52 },
                ],
            },
            {
                code: "BIT 368",
                name: "MOBILE APP DEVELOPMENT",
                rows: [
                    { type: "Assignment", option: "Graded", marks: 9 },
                    { type: "Mid Semester", option: "Graded", marks: 13 },
                    { type: "Final Examination", option: "Graded", marks: 60 },
                ],
            },
        ],
    };

    const blocks = blockData[selectedBlock] || [];

    // State for collapsible insight cards
    const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({});

    const toggleInsight = (courseCode: string) => {
        setExpandedInsights(prev => ({
            ...prev,
            [courseCode]: !prev[courseCode]
        }));
    };

    // AI Insight generator function
    const generateInsight = (course: any) => {
        const totalMarks = course.rows.reduce((sum: number, row: any) => {
            const marks = typeof row.marks === 'number' ? row.marks : 0;
            return sum + marks;
        }, 0);

        const hasAssignment = course.rows.some((row: any) => row.type === "Assignment" && row.marks !== "-");
        const hasMidSem = course.rows.some((row: any) => row.type === "Mid Semester" && row.marks !== "-");
        const hasFinal = course.rows.some((row: any) => row.type === "Final Examination" && row.marks !== "-");

        let insight = "";
        let recommendation = "";
        let performance = "";

        if (totalMarks >= 70) {
            performance = "Excellent";
            insight = "Outstanding performance! You're excelling in this course.";
            recommendation = "Keep up the great work and consider helping peers who might be struggling.";
        } else if (totalMarks >= 60) {
            performance = "Good";
            insight = "Solid performance with room for improvement.";
            recommendation = "Focus on strengthening weaker areas to reach excellence.";
        } else if (totalMarks >= 50) {
            performance = "Average";
            insight = "You're meeting basic requirements but have significant potential.";
            recommendation = "Consider additional study time and seek help from instructors.";
        } else {
            performance = "Needs Improvement";
            insight = "This course requires immediate attention and focused effort.";
            recommendation = "Schedule regular study sessions and utilize all available resources.";
        }

        let assessmentFeedback = "";
        if (!hasAssignment && hasMidSem && hasFinal) {
            assessmentFeedback = "Missing assignment scores - ensure all coursework is submitted.";
        } else if (hasAssignment && !hasFinal) {
            assessmentFeedback = "Strong continuous assessment - prepare well for final examination.";
        } else if (hasAssignment && hasMidSem && hasFinal) {
            assessmentFeedback = "Complete assessment profile - good engagement across all components.";
        }

        return {
            performance,
            insight,
            recommendation,
            assessmentFeedback,
            totalMarks,
            trend: totalMarks >= 65 ? "↗️ Trending Up" : totalMarks >= 50 ? "→ Stable" : "↘️ Needs Attention"
        };
    };

    return (
        <>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <DashboardLayout showGreeting={true}>
            {/* Green banner */}
            <div style={{ width: '100%', height: '70px', background: '#d9f5e6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: '18px', borderTopRightRadius: '18px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.35rem', color: '#222' }}>KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY, KUMASI</div>
                    <div style={{ fontWeight: 500, fontSize: '1.1rem', color: '#16a34a' }}>GRADES FOR {selectedSemester.toUpperCase()}, {selectedBlock.toUpperCase()}, {selectedYear}</div>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
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
                        {/* Block/Course Tables with AI Insights */}
                        {blocks.map((block, blockIndex) => {
                            const insight = generateInsight(block);
                            const courseKey = `${block.code}-${blockIndex}`;
                            const isExpanded = expandedInsights[courseKey];

                            return (
                                <div key={courseKey} style={{ marginBottom: '32px' }}>
                                    {/* Course Results Table */}
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
                                                block.rows.map((row: any, i: number) => (
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

                                    {/* AI Insight Card */}
                                    <div style={{
                                        marginTop: '16px',
                                        border: '1px solid #e0f2fe',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)'
                                    }}>
                                        {/* Insight Header - Always Visible */}
                                        <div 
                                            style={{
                                                padding: '16px 20px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                borderBottom: isExpanded ? '1px solid #bae6fd' : 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => toggleInsight(courseKey)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '16px'
                                                }}>
                                                    🤖
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#0c4a6e', fontSize: '14px' }}>
                                                        AI Performance Insight
                                                    </div>
                                                    <div style={{ color: '#0369a1', fontSize: '13px', marginTop: '2px' }}>
                                                        {insight.performance} • {insight.trend}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#0369a1'
                                            }}>
                                                <span style={{ fontSize: '12px', fontWeight: 500 }}>
                                                    {isExpanded ? 'Hide Details' : 'View Details'}
                                                </span>
                                                <span style={{
                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.2s ease',
                                                    fontSize: '14px'
                                                }}>
                                                    ▼
                                                </span>
                                            </div>
                                        </div>

                                        {/* Expandable Content */}
                                        {isExpanded && (
                                            <div style={{
                                                padding: '20px',
                                                background: 'rgba(255, 255, 255, 0.7)',
                                                animation: 'fadeIn 0.3s ease'
                                            }}>
                                                <div style={{ display: 'grid', gap: '16px' }}>
                                                    {/* Quick Stats */}
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                                        gap: '12px',
                                                        marginBottom: '16px'
                                                    }}>
                                                        <div style={{
                                                            background: 'white',
                                                            padding: '12px',
                                                            borderRadius: '8px',
                                                            textAlign: 'center',
                                                            border: '1px solid #e0f2fe'
                                                        }}>
                                                            <div style={{ fontSize: '18px', fontWeight: 600, color: '#0c4a6e' }}>
                                                                {insight.totalMarks}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '2px' }}>
                                                                Total Score
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            background: 'white',
                                                            padding: '12px',
                                                            borderRadius: '8px',
                                                            textAlign: 'center',
                                                            border: '1px solid #e0f2fe'
                                                        }}>
                                                            <div style={{ fontSize: '18px', fontWeight: 600, color: '#0c4a6e' }}>
                                                                {insight.performance}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '2px' }}>
                                                                Grade Level
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Analysis */}
                                                    <div>
                                                        <h4 style={{ 
                                                            margin: '0 0 8px 0', 
                                                            fontSize: '14px', 
                                                            fontWeight: 600, 
                                                            color: '#0c4a6e' 
                                                        }}>
                                                            📊 Performance Analysis
                                                        </h4>
                                                        <p style={{ 
                                                            margin: '0 0 12px 0', 
                                                            fontSize: '13px', 
                                                            color: '#0369a1', 
                                                            lineHeight: '1.5' 
                                                        }}>
                                                            {insight.insight}
                                                        </p>
                                                        {insight.assessmentFeedback && (
                                                            <p style={{ 
                                                                margin: '0', 
                                                                fontSize: '13px', 
                                                                color: '#0369a1', 
                                                                lineHeight: '1.5',
                                                                fontStyle: 'italic'
                                                            }}>
                                                                {insight.assessmentFeedback}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Recommendations */}
                                                    <div>
                                                        <h4 style={{ 
                                                            margin: '0 0 8px 0', 
                                                            fontSize: '14px', 
                                                            fontWeight: 600, 
                                                            color: '#0c4a6e' 
                                                        }}>
                                                            💡 Recommendations
                                                        </h4>
                                                        <p style={{ 
                                                            margin: '0', 
                                                            fontSize: '13px', 
                                                            color: '#0369a1', 
                                                            lineHeight: '1.5' 
                                                        }}>
                                                            {insight.recommendation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
        </DashboardLayout>
        </>
    );
};

export default DisplayResultPage;
