import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AttendancePanelProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

const AttendancePanel: React.FC<AttendancePanelProps> = ({ title, description, icon }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePanelClick = async () => {
        setIsLoading(true);
        navigate('/record-attendance');
        setIsLoading(false);
    };

    return (
        <div className={`new-panel green ${isLoading ? 'loading' : ''}`} onClick={handlePanelClick}>
            <div className="panel-accent green"></div>
            <div className="panel-main">
                <div className="panel-header">
                    {icon && <div className="panel-icon">{icon}</div>}
                    <h2>{title}</h2>
                </div>
                <div className="panel-divider"></div>
                <p className="panel-description">
                    {isLoading ? 'Processing attendance...' : description}
                </p>
            </div>
        </div>
    );
};

export default AttendancePanel;