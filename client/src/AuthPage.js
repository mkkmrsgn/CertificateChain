import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [facialFile, setFacialFile] = useState(null);
  const [fingerprintFile, setFingerprintFile] = useState(null);
  const [message, setMessage] = useState('');

  // Convert image to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // strip data:image/...;base64,
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!facialFile || !fingerprintFile) {
      setMessage("Please upload both facial and fingerprint images.");
      return;
    }

    try {
      const facialData = await toBase64(facialFile);
      const fingerprintData = await toBase64(fingerprintFile);

      const endpoint = isLogin ? 'login' : 'register';

      const res = await axios.post(
        `http://localhost:3001/api/auth/${endpoint}`,
        {
          name,
          facialData,
          fingerprintData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(res.data.message || 'Success!');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <label>Facial Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFacialFile(e.target.files[0])}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <label>Fingerprint Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFingerprintFile(e.target.files[0])}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: 10 }}>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: 10 }}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}
