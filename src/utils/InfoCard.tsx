import type { IconType } from "react-icons";

type InfoCardProps = {
    title: string;
    description: string;
    Icon: IconType;
    topColor: string;
    bottomColor: string;
    hoverEffect?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties; // Accept extra style prop for custom layout control
};

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    Icon,
    topColor,
    bottomColor,
    hoverEffect = true,
    onClick,
    style,
}) => {
    return (
        <div
            className={`card mb-4 shadow-sm border-0 rounded-4 ${hoverEffect ? "hover-shadow" : ""}`}
            onClick={onClick}
            style={{
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                width: "100%",       // full width controlled by parent container
                margin: 0,           // no horizontal margin for flush edges
                userSelect: onClick ? "none" : "auto",
                ...style,            // allow override from parent
            }}
            onMouseEnter={(e) => {
                if (hoverEffect && onClick) {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.12)";
                }
            }}
            onMouseLeave={(e) => {
                if (hoverEffect && onClick) {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
                }
            }}
        >
            <div className="d-flex h-100">
                {/* Side Color Bar */}
                <div
                    className="rounded-start-4"
                    style={{
                        width: 24,
                        background: `linear-gradient(to bottom, ${topColor}, ${bottomColor})`,
                    }}
                />

                {/* Card Content */}
                <div className="p-4 d-flex flex-column justify-content-center w-100">
                    <h5 className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                        <Icon size={18} />
                        {title}
                    </h5>
                    <p className="text-muted small mb-0" style={{ maxWidth: "90%" }}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
