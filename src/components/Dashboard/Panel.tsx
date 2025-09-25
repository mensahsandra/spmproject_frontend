import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { getActiveRole } from '../../utils/auth';

interface PanelProps {
    title: string;
    description: string;
    endpoint: string;
    icon?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, description, endpoint, icon }) => {
    const navigate = useNavigate();
    
    const handleClick = async () => {
        // Special handling for deadlines - navigate to notifications page
        if (title === 'Upcoming Deadlines') {
            navigate('/notifications', { state: { from: 'deadlines' } });
            return;
        }

        // Special handling for attendance - check in and navigate
        if (title === 'Attendance') {
            // Navigate directly to attendance page (no alerts)
            navigate('/record-attendance');
            return;
        }

        // Special handling for performance - navigate to selection page
        if (title === 'Check Performance' || title === 'Performance') {
            navigate('/select-result', { state: { showCurrent: true } });
            return;
        }

        // Special handling for CWA - navigate to CWA summary page
        if (title === 'Current CWA') {
            navigate('/display-cwa');
            return;
        }

        // Default API call for other panels
        try {
            const role = getActiveRole() || 'student';
            const data: any = await apiFetch(endpoint, { method: 'GET', role });
            alert(JSON.stringify(data, null, 2));
        } catch (err: any) {
            alert('Error fetching data: ' + (err?.message || err));
        }
    };

    const getAccentClass = () => {
        switch (title) {
            case 'Attendance':
                return 'attendance-accent';
            case 'Check Performance':
                return 'performance-accent';
            case 'Current CWA':
                return 'cwa-accent';
            case 'Upcoming Deadlines':
                return 'deadlines-accent';
            default:
                return '';
        }
    };

    return (
        <div className="panel-card" onClick={handleClick}>
            <div className={`panel-accent ${getAccentClass()}`}></div>
            <div className="panel-content panel-center">
                <div className="panel-title-row">
                    {icon && <span className="panel-icon">{icon}</span>}
                    <h2 className="panel-title">{title}</h2>
                </div>
                <div className={`panel-underline ${getAccentClass()}`}></div>
                <p className="panel-description">{description}</p>
            </div>
        </div>
    );
};

export default Panel;