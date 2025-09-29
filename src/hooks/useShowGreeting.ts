import { useLocation } from 'react-router-dom';

export const useShowGreeting = () => {
  const location = useLocation();
  
  // Show greeting card only on dashboard and home routes
  const dashboardRoutes = [
    '/student/dashboard',
    '/lecturer/dashboard',
    '/student/home',
    '/lecturer/home'
  ];
  
  return dashboardRoutes.includes(location.pathname);
};
