import React from 'react';
import './StatusFlag.css';

interface StatusFlagProps {
    isCheckedIn: boolean;
    onClick?: () => void;
}

const StatusFlag: React.FC<StatusFlagProps> = ({ isCheckedIn, onClick }) => {
    return (
        <div className="status-flag" onClick={onClick}>
            <div className={`half top ${isCheckedIn ? 'dark-green' : 'gray'}`} />
            <div className={`half bottom ${isCheckedIn ? 'bright-green' : 'light-gray'}`} />
        </div>
    );
};

export default StatusFlag;