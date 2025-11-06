import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm() {
  const [mode, setMode] = useState('register');
  const [name, setName] = useState('');
  const [facialData, setFacialData] = useState('');
  const [fingerprintData, setFingerprintData] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const { data } = await axios.post(`http://localhost:3001${endpoint}`, {
        name,
        facialData,
        fingerprintData,
      });
      setResult(data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || 'Something went wrong' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{mode === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Facial Data (base64)"
          className="w-full p-2 border rounded"
          value={facialData}
          onChange={(e) => setFacialData(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Fingerprint Data (base64)"
          className="w-full p-2 border rounded"
          value={fingerprintData}
          onChange={(e) => setFingerprintData(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="text-blue-500 hover:underline">
          {mode === 'register' ? 'Login' : 'Register'}
        </button>
      </p>
      {result && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
