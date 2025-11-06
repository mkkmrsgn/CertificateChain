// client/src/pages/IssuerDashboard.js
import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopRightMenu from "./TopRightMenu";

// 📊 Import Recharts
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend
} from "recharts";

const ISSUER_PASSWORD = "issuer123";

export default function IssuerDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔹 Upload states
  const [studentName, setStudentName] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [uploadedCertificates, setUploadedCertificates] = useState([]);

  // 🔹 Floating boxes
  const [showCreate, setShowCreate] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  // ✅ New floating panels
  const [showUsers, setShowUsers] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showReports, setShowReports] = useState(false);

  // 🔹 Logout confirm
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🔹 Security states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, name: "Alice Johnson", role: "Student" },
    { id: 2, name: "Mark Lee", role: "Staff" },
  ]);
  const [approvedUsers, setApprovedUsers] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // 🔹 Login
  const handleLogin = () => {
    if (!email || !password) {
      alert("Email and password are required.");
      setFailedAttempts((prev) => prev + 1);
      return;
    }
    if (password !== ISSUER_PASSWORD) {
      alert("Invalid password.");
      setFailedAttempts((prev) => prev + 1);
      return;
    }
    localStorage.setItem("issuerEmail", email);
    setLoggedIn(true);
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("issuerEmail");
    setEmail("");
    setPassword("");
    setLoggedIn(false);
    setShowLogoutConfirm(false);
  };

  // 🔹 Upload
  const handleUpload = async () => {
    if (!studentName || !file) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("certificate", file);

    try {
      const res = await axios.post("http://localhost:3001/api/issuer/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      setMessageType("success");

      setUploadedCertificates((prev) => [
        ...prev,
        { name: studentName, fileName: file.name, date: new Date().toLocaleString() },
      ]);

      setStudentName("");
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "Upload failed");
      setMessageType("error");
    }
  };

  // 🔹 Approve/Reject
  const handleApprove = (id) => {
    const user = pendingApprovals.find((u) => u.id === id);
    if (user) setApprovedUsers((prev) => [...prev, user]);
    setPendingApprovals((prev) => prev.filter((u) => u.id !== id));
    alert("User approved!");
  };

  const handleReject = (id) => {
    setPendingApprovals((prev) => prev.filter((u) => u.id !== id));
    alert("User rejected!");
  };

  // 🔹 Stats
  const stats = useMemo(() => {
    const total = uploadedCertificates.length;
    const uniqueStudents = new Set(uploadedCertificates.map((c) => c.name)).size;
    const lastUpload = total > 0 ? uploadedCertificates[uploadedCertificates.length - 1].date : "N/A";
    return { total, uniqueStudents, lastUpload };
  }, [uploadedCertificates]);

  // 🔹 Pagination
  const totalItems = uploadedCertificates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = uploadedCertificates.slice(startIndex, endIndex);

  // 🔹 Chart Data
  const userDistribution = [
    { name: "Admin", value: 5 },
    { name: "Staff", value: 15 },
    { name: "Students", value: 60 },
    { name: "Visitors", value: 20 },
  ];

  const certsPerMonth = [
    { month: "Jan", certs: 20 },
    { month: "Feb", certs: 35 },
    { month: "Mar", certs: 50 },
    { month: "Apr", certs: 30 },
  ];

  const verificationTrends = [
    { day: "Mon", verifications: 5 },
    { day: "Tue", verifications: 12 },
    { day: "Wed", verifications: 8 },
    { day: "Thu", verifications: 15 },
    { day: "Fri", verifications: 20 },
  ];

  // 🔹 Login screen
  if (!loggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.card}>
          <h2>Issuer Login</h2>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
          <button onClick={handleLogin} style={styles.primaryBtn}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardWrapper}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <button style={styles.sidebarButton} onClick={() => {setShowCreate(!showCreate); setShowStats(false); setShowSecurity(false);}}>Create</button>
        <button style={styles.sidebarButton} onClick={() => {setShowStats(!showStats); setShowCreate(false); setShowSecurity(false);}}>Statistics</button>
        <button style={styles.sidebarButton} onClick={() => {setShowSecurity(!showSecurity); setShowCreate(false); setShowStats(false);}}>Security Notifications</button>

        {/* New Sidebar Buttons */}
        <button style={styles.sidebarButton} onClick={() => {setShowUsers(!showUsers); setShowActive(false); setShowManage(false); setShowReports(false);}}>Total Registered Users</button>
        <button style={styles.sidebarButton} onClick={() => {setShowActive(!showActive); setShowUsers(false); setShowManage(false); setShowReports(false);}}>Active Verifications Today</button>
        <button style={styles.sidebarButton} onClick={() => {setShowManage(!showManage); setShowUsers(false); setShowActive(false); setShowReports(false);}}>Manage Users</button>
        <button style={styles.sidebarButton} onClick={() => {setShowReports(!showReports); setShowUsers(false); setShowActive(false); setShowManage(false);}}>View Reports</button>
      </div>

      {/* Main Area */}
      <div style={styles.mainContent}>
        <TopRightMenu onLogout={() => setShowLogoutConfirm(true)} />

        {/* History */}
        <div style={styles.historyWrapper}>
          <div style={styles.historyBox}>
            <div style={styles.historyHeader}>
              <h4>Upload History</h4>
              <div>
                <span>{totalItems === 0 ? "0–0 of 0" : `${startIndex + 1}–${endIndex} of ${totalItems}`}</span>
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={styles.pageBtn}>◀</button>
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalItems === 0} style={styles.pageBtn}>▶</button>
              </div>
            </div>

            <div>
              {totalItems > 0 ? (
                currentItems.map((cert, idx) => (
                  <div key={idx} style={styles.historyRow}>
                    <span style={{ flex: 2, fontWeight: "500" }}>{cert.name}</span>
                    <span style={{ flex: 3, color: "#ddd" }}>{cert.fileName}</span>
                    <span style={{ flex: 2, textAlign: "right", color: "#bbb" }}>{cert.date}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "15px", color: "#777", textAlign: "center" }}>No uploads yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Boxes */}
      {showCreate && (
        <FloatingBox title="Create Certificate" onClose={() => setShowCreate(false)} width="350px">
          <input type="text" placeholder="Enter Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} style={styles.input} />
          <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => setFile(e.target.files[0])} style={styles.input} />
          <button onClick={handleUpload} style={styles.secondaryBtn}>Upload Certificate</button>
          <button onClick={() => navigate("/create")} style={styles.primaryBtn}>Create Certificate</button>
        </FloatingBox>
      )}

      {showStats && (
        <FloatingBox title="Statistics" onClose={() => setShowStats(false)} width="420px" height="520px" scrollable>
          <div style={styles.statsBox}>
            <p><strong>Total Certificates:</strong> {stats.total}</p>
            <p><strong>Unique Students:</strong> {stats.uniqueStudents}</p>
            <p><strong>Last Upload:</strong> {stats.lastUpload}</p>
          </div>
          <div style={styles.chartsContainer}>
            <div style={styles.chartBox}>
              <h4>User Distribution</h4>
              <PieChart width={280} height={200}>
                <Pie data={userDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {["#3b82f6", "#9333ea", "#22c55e", "#f59e0b"].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <ReTooltip />
              </PieChart>
            </div>
            <div style={styles.chartBox}>
              <h4>Certificates per Month</h4>
              <BarChart width={300} height={200} data={certsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="certs" fill="#3b82f6" />
              </BarChart>
            </div>
            <div style={styles.chartBox}>
              <h4>Verification Trends</h4>
              <LineChart width={300} height={200} data={verificationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="verifications" stroke="#9333ea" strokeWidth={2} />
              </LineChart>
            </div>
          </div>
        </FloatingBox>
      )}

      {showSecurity && (
        <FloatingBox title="Security Notifications" onClose={() => setShowSecurity(false)} width="350px">
          <div style={styles.statsBox}>
            <p><strong>Failed Login Attempts:</strong> {failedAttempts}</p>
          </div>
          <div style={styles.statsBox}>
            <h4>Pending Account Approvals</h4>
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((user) => (
                <div key={user.id} style={{ marginBottom: "8px" }}>
                  {user.name} – <span style={{ color: "#ddd" }}>{user.role}</span>
                  <button style={{ marginLeft: "10px", ...styles.secondaryBtn }} onClick={() => handleApprove(user.id)}>Approve</button>
                  <button style={{ marginLeft: "5px", ...styles.logoutBtn }} onClick={() => handleReject(user.id)}>Reject</button>
                </div>
              ))
            ) : (
              <p>No pending approvals</p>
            )}
          </div>
          <div style={styles.statsBox}>
            <h4>✅ Approved Users</h4>
            {approvedUsers.length > 0 ? (
              approvedUsers.map((user) => (
                <div key={user.id} style={{ marginBottom: "6px" }}>
                  {user.name} – <span style={{ color: "#9f9" }}>{user.role}</span>
                </div>
              ))
            ) : (
              <p>No approved users yet</p>
            )}
          </div>
        </FloatingBox>
      )}

      {/* ✅ New Floating Boxes */}
      {showUsers && (
        <FloatingBox title="Total Registered Users" onClose={() => setShowUsers(false)} width="320px">
          <p>👥 Total Users: <strong>120</strong></p>
        </FloatingBox>
      )}
      {showActive && (
        <FloatingBox title="Active Verifications Today" onClose={() => setShowActive(false)} width="320px">
          <p>✅ Active Verifications: <strong>8</strong></p>
        </FloatingBox>
      )}
      {showManage && (
        <FloatingBox title="Manage Users" onClose={() => setShowManage(false)} width="400px">
          <p>⚙️ User management panel will be built here.</p>
        </FloatingBox>
      )}
      {showReports && (
        <FloatingBox title="View Reports" onClose={() => setShowReports(false)} width="400px">
          <p>📑 Reports and logs will be shown here.</p>
        </FloatingBox>
      )}

      {showLogoutConfirm && (
        <FloatingBox title="Confirm Logout" onClose={() => setShowLogoutConfirm(false)} width="300px">
          <p>Are you sure you want to log out?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
            <button onClick={() => setShowLogoutConfirm(false)} style={styles.secondaryBtn}>Cancel</button>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </FloatingBox>
      )}
    </div>
  );
}

/* 🔹 FloatingBox Component */
const FloatingBox = ({ title, children, onClose, width = "500px", height = "auto", top = "100px", right = "100px", scrollable = false }) => (
  <div style={{ ...styles.floatingBox, width, height, top, right, overflowY: scrollable ? "auto" : "visible" }}>
    <div style={styles.floatingHeader}>
      <span>{title}</span>
      <button onClick={onClose} style={styles.headerBtn}>✕</button>
    </div>
    <div>{children}</div>
  </div>
);

const styles = {
  loginContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #3b82f6, #9333ea)", fontFamily: "Poppins, sans-serif" },
  card: { background: "linear-gradient(135deg, #3b82f6, #9333ea)", padding: "2rem", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.2)", width: "100%", maxWidth: "400px", textAlign: "center", color: "#fff" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "15px" },
  primaryBtn: { padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#fff", cursor: "pointer", marginTop: "12px", width: "100%", fontWeight: "600" },
  secondaryBtn: { padding: "10px", borderRadius: "6px", border: "none", backgroundColor: "#6c757d", color: "#fff", cursor: "pointer", marginTop: "10px" },
  logoutBtn: { padding: "10px", borderRadius: "6px", border: "none", backgroundColor: "#dc2626", color: "#fff", cursor: "pointer", marginTop: "10px" },
  dashboardWrapper: { display: "flex", minHeight: "100vh", fontFamily: "Poppins, sans-serif", background: "linear-gradient(to bottom right, #3b82f6, #9333ea)" },
  sidebar: { width: "220px", background: "rgba(30,41,59,0.85)", backdropFilter: "blur(10px)", padding: "20px", display: "flex", flexDirection: "column", gap: "15px", color: "#fff" },
  sidebarButton: { padding: "12px 15px", border: "none", borderRadius: "8px", background: "rgba(255, 255, 255, 0.15)", color: "#fff", fontWeight: "600", cursor: "pointer", textAlign: "left", transition: "background 0.3s ease" },
  mainContent: { flex: 1, padding: "20px" },
  historyWrapper: { flex: 1, padding: "20px", display: "flex", justifyContent: "center" },
  historyBox: { width: "80%", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "12px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)", paddingBottom: "15px" },
  floatingBox: { position: "fixed", background: "rgba(255, 255, 255, 0.15)", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", backdropFilter: "blur(12px)", padding: "20px", zIndex: 1000, color: "#fff" },
  floatingHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "8px", marginBottom: "12px", fontWeight: "600" },
  headerBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#fff" },
  historyHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 15px", borderBottom: "1px solid rgba(255,255,255,0.2)", color: "#fff" },
  historyRow: { display: "flex", padding: "12px 15px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#fff" },
  pageBtn: { border: "none", background: "transparent", color: "#fff", cursor: "pointer", marginLeft: "8px" },
  statsBox: { background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "8px", marginBottom: "15px" },
  chartsContainer: { display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" },
  chartBox: { background: "rgba(0,0,0,0.25)", borderRadius: "8px", padding: "10px", textAlign: "center", color: "#fff" }
};
