import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ExactDashboardCardProps {
  title: string;
  description: string;
  icon: string;
  color: 'green' | 'red';
  navigateTo: string;
}

const ExactDashboardCard: React.FC<ExactDashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  navigateTo 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <div 
      className="exact-dashboard-card" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={`exact-card-left-bar ${color}`}></div>
      <div className="exact-card-content">
        <div className="exact-card-header">
          <span className="exact-card-icon">{icon}</span>
          <h3 className="exact-card-title">{title}</h3>
        </div>
        <hr className="exact-card-divider" />
        <p className="exact-card-description">{description}</p>
      </div>
    </div>
  );
};

export default ExactDashboardCard;