import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // this includes Popper
// Import CSS in correct order - Tailwind should be last to override everything
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './styles/dashboard.css'
import RoutePage from './routes/RoutePage';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <RoutePage />
      </NotificationProvider>
    </Router>
  );
}

export default App;
