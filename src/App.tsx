import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // this includes Popper
// Import CSS in correct order - Tailwind should be last to override everything
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './styles/dashboard.css'

function App() {
  return (
    <Router>
      <div style={{ padding: '50px', backgroundColor: '#e0f2e7', textAlign: 'center' }}>
        <h1 style={{ color: 'green', fontSize: '32px' }}>🚀 APP.TSX WORKING!</h1>
        <p>React app is loading successfully.</p>
        <p>Testing without providers...</p>
      </div>
    </Router>
  );
}

export default App;
