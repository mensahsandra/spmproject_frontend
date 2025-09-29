import './App.css'
import './styles/dashboard.css'
import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './routes/RoutePage';
import { SessionProvider } from './context/SessionContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // this includes Popper

function App() {
  return (
    <Router>
      <SessionProvider>
        <RoutePage />
      </SessionProvider>
    </Router>
  );
}

export default App;
