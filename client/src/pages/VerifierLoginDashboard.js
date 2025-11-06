// client/src/pages/VerifierLoginDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  LogOut,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Shield,
  FileText,
  Activity,
  Eye,
  RefreshCw,
} from "lucide-react";

import "./VerifierLoginDashboard.css"; // ✅ Import CSS

const VERIFIER_PASSWORD = "verify123";

export default function VerifierLoginDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("verifierEmail")
  );
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const [certificateURL, setCertificateURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("requests"); // ✅ NEW: tab state
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (loggedIn) loadDashboardData();
  }, [loggedIn]);

  const loadDashboardData = async () => {
    const mockRequests = [
      { id: 1, studentName: "John Doe", status: "approved", date: "2024-01-15" },
      { id: 2, studentName: "Jane Smith", status: "pending", date: "2024-01-14" },
      { id: 3, studentName: "Mike Johnson", status: "approved", date: "2024-01-13" },
      { id: 4, studentName: "Sarah Williams", status: "rejected", date: "2024-01-12" },
    ];
    setRequests(mockRequests);
    setStats({
      total: mockRequests.length,
      approved: mockRequests.filter((r) => r.status === "approved").length,
      pending: mockRequests.filter((r) => r.status === "pending").length,
      rejected: mockRequests.filter((r) => r.status === "rejected").length,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return setMessage("Email and password required.");
    if (password !== VERIFIER_PASSWORD) return setMessage("Invalid password.");
    localStorage.setItem("verifierEmail", email);
    setLoggedIn(true);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("verifierEmail");
    setEmail("");
    setPassword("");
    setLoggedIn(false);
  };

  const handleRequestAccess = async () => {
    if (!studentName.trim()) return setMessage("Please enter a student name.");
    setLoading(true);
    setTimeout(() => {
      setMessage(`Request sent for ${studentName}`);
      setLoading(false);
    }, 1000);
  };

  const handleCheckStatus = async () => {
    if (!studentName.trim()) return setMessage("Please enter a student name.");
    setLoading(true);
    setTimeout(() => {
      setMessage(`Checked status for ${studentName}`);
      setCertificateURL("https://via.placeholder.com/600x400.png?text=Certificate+Sample");
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const badgeClass = `badge ${status}`;
    return (
      <span className={badgeClass}>
        {status === "approved" && <CheckCircle size={14} />}
        {status === "pending" && <Clock size={14} />}
        {status === "rejected" && <XCircle size={14} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredRequests = requests.filter((r) =>
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================
  // LOGIN SCREEN
  // ======================
  if (!loggedIn) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-icon">
            <Shield size={32} />
          </div>
          <h1 className="login-title">Verifier Portal</h1>
          <p className="login-subtitle">Access your verification dashboard</p>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
          </form>

          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
    );
  }

  // ======================
  // DASHBOARD
  // ======================
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="left">
          <Shield size={20} />
          <h1>Verifier Dashboard</h1>
        </div>
        <div className="right">
          <span className="user-chip">{email}</span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Requests</p>
          <h2>{stats.total}</h2>
        </div>
        <div className="stat-card approved">
          <p>Approved</p>
          <h2>{stats.approved}</h2>
        </div>
        <div className="stat-card pending">
          <p>Pending</p>
          <h2>{stats.pending}</h2>
        </div>
        <div className="stat-card rejected">
          <p>Rejected</p>
          <h2>{stats.rejected}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
  <button
    className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
    onClick={() => setActiveTab("requests")}
  >
    All Requests
  </button>
  <button
    className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
    onClick={() => setActiveTab("new")}
  >
    New Verification
  </button>
</div>

      {/* Tab Content */}
      {activeTab === "requests" && (
        <div className="table-card">
          <h2 className="table-title">
            <Activity size={18} /> Verification Management
          </h2>

          <div className="table-actions">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="refresh-btn" onClick={loadDashboardData}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r) => (
                <tr key={r.id}>
                  <td>{r.studentName}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>{r.date}</td>
                  <td>
                    <button className="view-btn">
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "new" && (
        <div className="table-card">
          <h2 className="table-title">
            <FileText size={18} /> Request New Verification
          </h2>

          <div className="verification-form">
            <input
              type="text"
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <div className="form-actions">
              <button onClick={handleRequestAccess} disabled={loading}>
                {loading ? "Sending..." : "Request Access"}
              </button>
              <button onClick={handleCheckStatus} disabled={loading}>
                Check Status
              </button>
            </div>
            {message && <p className="form-message">{message}</p>}

            {certificateURL && (
              <div className="certificate-preview">
                <img src={certificateURL} alt="Verified Certificate" />
                <button className="download-btn">
                  <Download size={16} /> Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
