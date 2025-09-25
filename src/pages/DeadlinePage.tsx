// DeadlinesPage.tsx
import React from "react";
import { FaCalendarCheck, FaClipboardList, FaFileUpload, FaBookOpen } from "react-icons/fa";
import InfoCard from "../utils/InfoCard";


const DeadlinesPage: React.FC = () => {
    const deadlines = [
        {
            title: "Registration Deadline",
            description: "All students must complete course registration by 15th September 2025.",
            Icon: FaClipboardList,
            topColor: "#dc2626", // red-600
            bottomColor: "#b91c1c", // red-700
        },
        {
            title: "Project Submission",
            description: "Final year students must submit their project work by 20th November 2025.",
            Icon: FaFileUpload,
            topColor: "#f87171", // red-400
            bottomColor: "#ef4444", // red-500
        },
        {
            title: "Mid-Semester Exams",
            description: "Mid-semester examinations start on 10th October 2025.",
            Icon: FaBookOpen,
            topColor: "#fca5a5", // red-300
            bottomColor: "#f87171", // red-400
        },
        {
            title: "Graduation Application",
            description: "Deadline for graduation application is 1st December 2025.",
            Icon: FaCalendarCheck,
            topColor: "#b91c1c", // red-700
            bottomColor: "#991b1b", // red-800
        },
    ];

    return (
        <div
            className="container py-5"
            style={{ background: "#fff5f5", minHeight: "100vh" }}
        >
            <h2 className="fw-bold mb-4 text-center text-danger">Important Academic Deadlines</h2>
            <div className="d-flex flex-column gap-4">
                {deadlines.map((item, idx) => (
                    <InfoCard
                        key={idx}
                        title={item.title}
                        description={item.description}
                        Icon={item.Icon}
                        topColor={item.topColor}
                        bottomColor={item.bottomColor}
                        hoverEffect
                    />
                ))}
            </div>
        </div>
    );
};

export default DeadlinesPage;
