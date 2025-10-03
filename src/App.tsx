import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // this includes Popper
// Import CSS in correct order - Tailwind should be last to override everything
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './styles/dashboard.css'
import RoutePage from './routes/RoutePage';

function App() {
  return (
    <Router>
      <RoutePage />
    </Router>
  );
}

export default App;
