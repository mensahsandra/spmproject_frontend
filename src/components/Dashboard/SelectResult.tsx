import React from 'react';
import Sidebar from './Sidebar';
import '../../css/selectresult.css';

const SelectResult: React.FC = () => {
    return (
        <div className="select-result-container">
            <Sidebar />
            <div className="select-result-content">
                {/* Existing content */}
            </div>
        </div>
    );
};

export default SelectResult;
