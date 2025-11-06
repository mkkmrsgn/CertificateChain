import React, { useState } from 'react';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';

export default function CertificateApp() {
  const [userAddress, setUserAddress] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:3001/register', { userAddress });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleIssue = async () => {
    if (!file) return setMessage('No file selected');

    const reader = new FileReader();
    reader.onload = async () => {
      const hash = SHA256(reader.result).toString();
      try {
        const res = await axios.post('http://localhost:3001/issue', { userAddress, certHash: hash });
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.error || 'Issuance failed');
      }
    };
    reader.readAsText(file);
  };

  const handleVerify = async () => {
    if (!file) return setMessage('No file selected');

    const reader = new FileReader();
    reader.onload = async () => {
      const uploadedHash = SHA256(reader.result).toString();
      try {
        const res = await axios.post('http://localhost:3001/verify', { userAddress, uploadedHash });
        setMessage(res.data.isValid ? '✅ Certificate is valid!' : '❌ Certificate is invalid or not issued');
      } catch (err) {
        setMessage(err.response?.data?.error || 'Verification failed');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎓 CertificateChain Frontend</h2>
      <input
        type="text"
        placeholder="User Wallet Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <br /><br />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleRegister}>Register User</button>
      <button onClick={handleIssue}>Issue Certificate</button>
      <button onClick={handleVerify}>Verify Certificate</button>
      <br /><br />
      <p>{message}</p>
    </div>
  );
}
