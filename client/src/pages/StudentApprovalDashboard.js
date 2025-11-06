import React, { useState } from 'react';
import axios from 'axios';

export default function StudentApprovalDashboard() {
  const [studentName, setStudentName] = useState('');
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  const fetchRequests = async () => {
  try {
    const res = await axios.get(`http://localhost:3001/api/requests/pending?studentName=${encodeURIComponent(studentName)}`);
    setRequests(res.data);
  } catch (err) {
    setMessage('Failed to load requests.');
  }
};


  const handleApprove = async (verifierEmail) => {
    try {
      await axios.post('http://localhost:3001/api/requests/respond', {
        studentName,
        verifierEmail,
        action: 'approved'
      });
      setMessage('Request approved.');
      fetchRequests(); // Refresh list
    } catch (err) {
      setMessage('Failed to approve request.');
    }
  };

  const handleReject = async (verifierEmail) => {
    try {
      await axios.post('http://localhost:3001/api/requests/respond', {
        studentName,
        verifierEmail,
        action: 'rejected'
      });
      setMessage('Request rejected.');
      fetchRequests(); // Refresh list
    } catch (err) {
      setMessage('Failed to reject request.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Student Approval Dashboard</h2>

      <input
        type="text"
        placeholder="Enter Your Name"
        value={studentName}
        onChange={e => setStudentName(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <button onClick={fetchRequests} style={{ width: '100%' }}>
        Load Access Requests
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      <div style={{ marginTop: 20 }}>
        {requests.length === 0 && <p>No pending requests.</p>}
        {requests.map(req => (
          <div key={req._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <p><strong>Verifier:</strong> {req.verifierEmail}</p>
            <p><strong>Status:</strong> {req.status}</p>
            {req.status === 'pending' && (
              <>
                <button onClick={() => handleApprove(req.verifierEmail)} style={{ marginRight: 10 }}>
                  Approve
                </button>
                <button onClick={() => handleReject(req.verifierEmail)}>
                  Reject
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
