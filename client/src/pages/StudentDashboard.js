import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState(localStorage.getItem('studentName') || '');
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (studentName) loadRequests();
  }, [studentName]);

  const loadRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/requests/pending?studentName=${studentName}`);
      setRequests(res.data);
    } catch (err) {
      setMessage('Failed to load requests.');
    }
  };

  const handleResponse = async (verifierEmail, action) => {
    try {
      const res = await axios.post('http://localhost:3001/api/requests/respond', {
        studentName,
        verifierEmail,
        action
      });
      setMessage(res.data.message);
      loadRequests(); // Refresh
    } catch (err) {
      setMessage('Failed to respond.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentName');
    setStudentName('');
    setRequests([]);
    setMessage('');
    window.location.href = '/'; // Or redirect to login page
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎓 Student Dashboard</h2>
        <div style={styles.userInfo}>
          <span>{studentName}</span>
          <button onClick={handleLogout} style={styles.logout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h3>Pending Access Requests</h3>

        {message && <p style={styles.message}>{message}</p>}

        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          requests.map((req, i) => (
            <div key={i} style={styles.card}>
              <p><strong>Verifier:</strong> {req.verifierEmail}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <button style={styles.approve} onClick={() => handleResponse(req.verifierEmail, 'approved')}>Approve</button>
              <button style={styles.reject} onClick={() => handleResponse(req.verifierEmail, 'rejected')}>Reject</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    backgroundColor: '#fefefe',
    fontFamily: 'Arial'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px'
  },
  title: {
    margin: 0
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logout: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  content: {
    textAlign: 'left'
  },
  message: {
    marginBottom: '15px',
    color: 'darkgreen'
  },
  card: {
    padding: '15px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  },
  approve: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    marginRight: '10px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  reject: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
