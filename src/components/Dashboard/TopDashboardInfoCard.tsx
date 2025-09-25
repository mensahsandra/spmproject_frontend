import React from "react";

//this component is used to display a top dashboard info card with a date and an icon
interface TopInfoCardProps {
    title: string;
    description: string;
    Icon: React.ComponentType<{ size: number }>;
    hoverEffect?: boolean;
    onClick?: () => void;
}

const TopInfoCard: React.FC<TopInfoCardProps> = ({
    title,
    description,
    Icon,
    hoverEffect = true,
    onClick,
}) => {
    const today = new Date().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div
            className={`card mb-4 shadow-sm border-0 rounded-4 overflow-hidden ${hoverEffect ? "hover-shadow" : ""
                }`}
            onClick={onClick}
            style={{
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.3s ease-in-out",
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                backgroundColor: "white",
            }}
        >
            {/* Top Green Bar */}
            <div
                style={{
                    backgroundColor: "green",
                    padding: "8px 16px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <span style={{ color: "white", fontWeight: "bold", fontSize: "0.85rem" }}>
                    {today}
                </span>
            </div>

            {/* Card Content */}
            <div className="p-4">
                <h5 className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                    <Icon size={18} />
                    {title}
                </h5>
                <p className="text-muted small mb-0" style={{ maxWidth: "90%" }}>
                    {description}
                </p>
            </div>
        </div>
    );
};

export default TopInfoCard;
