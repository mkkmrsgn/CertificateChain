import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import HomeDashboard from "./pages/HomeDashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import IssuerDashboard from "./pages/IssuerDashboard";
import VerifierLoginDashboard from "./pages/VerifierLoginDashboard";
import CreateDesigner from "./pages/CreateDesigner";

function AppWrapper() {
  const location = useLocation();
  const isDesignerPage = location.pathname === "/create";

  return (
    <div style={styles.container}>
      {/* Hide navbar on CreateDesigner */}
      {!isDesignerPage && (
        <nav style={styles.navbar}>
          <NavLink to="/" style={styles.link}>
            Home
          </NavLink>
          <NavLink to="/register" style={styles.link}>
            Register
          </NavLink>
          <NavLink to="/login" style={styles.link}>
            Login
          </NavLink>
          <NavLink to="/issuer" style={styles.link}>
            Issuer Dashboard
          </NavLink>
          <NavLink to="/verifier" style={styles.link}>
            Verifier
          </NavLink>
        </nav>
      )}

      {/* Full width for /create, centered wrapper for others */}
      <div style={isDesignerPage ? {} : styles.content}>
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/issuer" element={<IssuerDashboard />} />
          <Route path="/verifier" element={<VerifierLoginDashboard />} />
          <Route path="/create" element={<CreateDesigner />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#121d24",
    minHeight: "100vh",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
    padding: "15px 0",
    backgroundColor: "#004080",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  link: {
    margin: "0 20px",
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  active: {
    borderBottom: "2px solid #fff",
  },
  content: {
    padding: "30px",
    maxWidth: "900px",
    margin: "0 auto",
  },
};

export default App;
