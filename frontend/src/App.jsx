import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure icons are loaded if available, or rely on CDN

// Import Pages
import AdminPage from './pages/AdminPage';
import SecretaryPage from './pages/SecretaryPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container-fluid py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/secretary" element={<SecretaryPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active text-white' : 'text-white-50';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-shield-lock-fill text-primary"></i> 
          CyberLaw System
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin')}`} to="/admin">
                <i className="bi bi-gear me-1"></i> Admin
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/secretary')}`} to="/secretary">
                <i className="bi bi-inbox me-1"></i> Secretary
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/test')}`} to="/test">
                <i className="bi bi-phone me-1"></i> Simulator
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Home = () => (
  <div className="container mt-5 text-center">
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h1 className="display-4 fw-bold mb-3 text-dark">Legal Triage Automation</h1>
        <p className="lead text-muted mb-5">
          A centralized platform for managing legal inquiries, AI-driven triage, and lawyer assignments.
        </p>
        
        <div className="row g-4">
          <div className="col-md-4">
            <Link to="/admin" className="text-decoration-none">
              <div className="card h-100 p-4 border-0 shadow-sm hover-effect">
                <div className="display-4 text-primary mb-3"><i className="bi bi-gear"></i></div>
                <h5 className="text-dark">Configuration</h5>
                <p className="text-muted small">Manage AI personas and legal topics.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/secretary" className="text-decoration-none">
              <div className="card h-100 p-4 border-0 shadow-sm hover-effect">
                <div className="display-4 text-warning mb-3"><i className="bi bi-inbox"></i></div>
                <h5 className="text-dark">Leads</h5>
                <p className="text-muted small">Review and assign incoming cases.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/test" className="text-decoration-none">
              <div className="card h-100 p-4 border-0 shadow-sm hover-effect">
                <div className="display-4 text-success mb-3"><i className="bi bi-whatsapp"></i></div>
                <h5 className="text-dark">Simulator</h5>
                <p className="text-muted small">Test the chatbot flow.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default App;
