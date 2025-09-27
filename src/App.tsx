import './App.css'
import './styles/dashboard.css'
import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from './routes/RoutePage';
import RouteDebug from './components/Debug/RouteDebug';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // this includes Popper

function App() {
  console.log('App component rendering...');
  
  try {
    return (
      <Router>
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          background: 'blue', 
          color: 'white', 
          padding: '5px', 
          zIndex: 10000 
        }}>
          App Loaded
        </div>
        <RouteDebug />
        <RoutePage />
      </Router>
    );
  } catch (error) {
    console.error('App render error:', error);
    return (
      <div style={{ padding: '20px', background: 'red', color: 'white' }}>
        <h1>App Error</h1>
        <p>Error: {String(error)}</p>
      </div>
    );
  }
}

export default App;
