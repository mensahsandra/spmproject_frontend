
import React from "react";

interface DisplayButtonProps {
    onClick: () => void;
}

const DisplayButton: React.FC<DisplayButtonProps> = ({ onClick }) => {
    return (
        <button
            className="rounded-3 px-4"
            onClick={onClick}
            style={{ 
                fontWeight: 700,
                backgroundColor: '#22c55e', // bright green
                border: 'none',
                color: '#fff',
                padding: '12px 24px',
                boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
                transition: 'background 0.2s, transform 0.2s',
                cursor: 'pointer'
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#16a34a')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#22c55e')}
        >
            Display Results
        </button>
    );
};

export default DisplayButton;
