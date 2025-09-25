import React from "react";
import { FaQrcode, FaChartBar, FaCalendarCheck } from "react-icons/fa";
import InfoCard from "../../utils/InfoCard";

type DashboardCardsProps = {
    active: string;
    setActive: (section: string) => void;
};

const DashboardCards: React.FC<DashboardCardsProps> = ({ active, setActive }) => {
    const cards = [
        {
            title: "Attendance",
            description: "Check in to mark your attendance for today’s class.",
            Icon: FaQrcode,
            topColor: "#065f46",
            bottomColor: "#10b981",
        },
        {
            title: "Performance",
            description: "View your grades, milestones, and learning progress.",
            Icon: FaChartBar,
            topColor: "#1e3a8a",
            bottomColor: "#3b82f6",
        },
        {
            title: "Deadlines",
            description: "Review upcoming assignments, quizzes, and tasks.",
            Icon: FaCalendarCheck,
            topColor: "#92400e",
            bottomColor: "#facc15",
        },
    ];

    return (
        <div style={{ padding: "10px 20px" }}>
            <div style={{ width: "100%", maxWidth: "700px" }}>
                {cards.map(({ title, description, Icon, topColor, bottomColor }) => (
                    <InfoCard
                        key={title}
                        title={title}
                        description={description}
                        Icon={Icon}
                        topColor={topColor}
                        bottomColor={bottomColor}
                        onClick={() => setActive(title)}
                        hoverEffect={active !== title}
                    // Optionally add cursor pointer style inside InfoCard or here:
                    // style={{ cursor: active !== title ? 'pointer' : 'default' }}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardCards;
