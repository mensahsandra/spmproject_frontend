
import type { IconType } from "react-icons";

type InfoCardProps = {
    title: string;
    description: string;
    Icon: IconType;
    topColor: string;
    bottomColor: string;
    hoverEffect?: boolean;
    onClick?: () => void;
};

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    Icon,
    topColor,
    bottomColor,
    hoverEffect = true,
    onClick,
}) => {
    return (
        <div
            className={`card mb-4 shadow-sm border-0 rounded-4 ${hoverEffect ? "hover-shadow" : ""
                }`}
            onClick={onClick}
            style={{
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.3s ease-in-out",
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            <div className="d-flex h-100">
                {/* Side Color Bar */}
                <div
                    className="rounded-start-4"
                    style={{
                        width: "24px",
                        background: `linear-gradient(to bottom, ${topColor}, ${bottomColor})`,
                    }}
                ></div>

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