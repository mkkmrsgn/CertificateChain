import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

// ✅ TensorFlow CPU backend only
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-cpu";

import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

// 🚫 Disable WebGL backend
if (tf.engine().registryFactory && tf.engine().registryFactory["webgl"]) {
  delete tf.engine().registryFactory["webgl"];
  console.log("❌ WebGL backend completely removed");
}

export default function LoginPage() {
  const [name, setName] = useState(localStorage.getItem("studentName") || "");
  const [fingerprint, setFingerprint] = useState(null);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("studentName"));
  const [pendingRequests, setPendingRequests] = useState([]);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const videoRef = useRef(null);

  // 🧠 Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.setBackend("cpu");
        await tf.ready();
        console.log("✅ TensorFlow backend ready:", tf.getBackend());

        const MODEL_URL = process.env.PUBLIC_URL + "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        console.log("✅ Face-api.js models loaded");
      } catch (error) {
        console.error("Model loading error:", error);
        setMessage("Error loading face recognition models.");
      }
    };
    loadModels();
  }, []);

  // 🎥 Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access error:", err);
      setMessage("Unable to access camera");
    }
  };

  // 📸 Capture face
  const captureFace = async () => {
    try {
      if (tf.getBackend() !== "cpu") {
        await tf.setBackend("cpu");
        await tf.ready();
        console.log("⚙️ Switched to CPU backend");
      }

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setFaceDescriptor(Array.from(detection.descriptor));
        setMessage("✅ Face captured successfully!");
      } else {
        setMessage("❌ No face detected. Please try again.");
      }
    } catch (error) {
      console.error("Face capture error:", error);
      setMessage("Error during face detection. Try again.");
    }
  };

  // 🖐️ Register Fingerprint (first-time setup)
  const handleFingerprintRegister = async () => {
    try {
      if (!name) {
        setMessage("⚠️ Please enter your name first.");
        return;
      }

      const { data: options } = await axios.post(
        "http://localhost:3001/api/webauthn/register",
        { username: name }
      );

      const attResp = await startRegistration(options);

      const verifyRes = await axios.post(
        "http://localhost:3001/api/webauthn/verify-registration",
        { username: name, attResp }
      );

      if (verifyRes.data.verified) {
        setMessage("✅ Fingerprint registered successfully!");
      } else {
        setMessage("❌ Fingerprint registration failed.");
      }
    } catch (err) {
      console.error("Fingerprint registration error:", err);
      setMessage("❌ Fingerprint registration failed or canceled.");
    }
  };

  // 🔒 Fingerprint Login (after registration)
  const handleFingerprintLogin = async () => {
    try {
      if (!name) {
        setMessage("⚠️ Please enter your name first.");
        return;
      }

      const { data: options } = await axios.post(
        "http://localhost:3001/api/webauthn/login",
        { username: name }
      );

      const authResp = await startAuthentication(options);

      const verifyRes = await axios.post(
        "http://localhost:3001/api/webauthn/verify-login",
        { username: name, authResp }
      );

      if (verifyRes.data.verified) {
        setMessage("✅ Fingerprint login successful!");
        setLoggedIn(true);
        localStorage.setItem("studentName", name);
        fetchPendingRequests();
      } else {
        setMessage("❌ Fingerprint login failed.");
      }
    } catch (err) {
      console.error("Fingerprint login error:", err);
      setMessage("⚠️ Fingerprint authentication failed or canceled.");
    }
  };

  // 👤 Face login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!faceDescriptor) {
      setMessage("Please capture your face before logging in.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("faceDescriptor", JSON.stringify(faceDescriptor));
    if (fingerprint) formData.append("fingerprint", fingerprint);

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", formData);
      setMessage(res.data.message);
      setLoggedIn(true);
      localStorage.setItem("studentName", name);
      fetchPendingRequests();
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  // 📬 Fetch requests
  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/requests/pending?studentName=${name}`
      );
      setPendingRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setPendingRequests([]);
    }
  };

  // 🟩 Approve or reject requests
  const handleResponse = async (verifierEmail, action) => {
    try {
      const res = await axios.post("http://localhost:3001/api/requests/respond", {
        studentName: name,
        verifierEmail,
        action,
      });

      setMessage(res.data.message);
      setPendingRequests((prev) =>
        prev.filter((req) => req.verifierEmail !== verifierEmail)
      );
    } catch (err) {
      console.error("Failed to respond to request:", err);
      setMessage("Error responding to request");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("studentName");
    setLoggedIn(false);
    setName("");
    setFaceDescriptor(null);
    setFingerprint(null);
    setMessage("");
    setPendingRequests([]);
  };

  useEffect(() => {
    if (loggedIn) fetchPendingRequests();
  }, [loggedIn]);

  return (
    <div style={styles.loginContainer}>
      {!loggedIn ? (
        <div style={styles.card}>
          <h2>Login with Biometrics</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />

            <h4>Facial Recognition (Webcam)</h4>
            <video
              ref={videoRef}
              autoPlay
              muted
              width="300"
              height="200"
              style={styles.video}
            ></video>
            <div>
              <button type="button" onClick={startCamera} style={styles.btn}>
                Start Camera
              </button>
              <button type="button" onClick={captureFace} style={styles.btn}>
                Capture Face
              </button>
            </div>

    

            <button
              type="button"
              onClick={handleFingerprintLogin}
              style={{ ...styles.btn, background: "#8b5cf6", color: "#fff" }}
            >
              🔒 Login with Fingerprint
            </button>
            <button type="submit" style={{ ...styles.btn, ...styles.loginBtn }}>
              Login
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.card}>
          <h2>Welcome, {name}</h2>
          <button style={{ ...styles.btn, ...styles.logoutBtn }} onClick={handleLogout}>
            Logout
          </button>

          <h3>Pending Access Requests</h3>
          {pendingRequests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <ul style={styles.requestList}>
              {pendingRequests.map((req, index) => (
                <li key={index} style={styles.requestItem}>
                  <span>
                    Verifier: <strong>{req.verifierEmail}</strong>
                  </span>
                  <button
                    onClick={() => handleResponse(req.verifierEmail, "approved")}
                    style={{ ...styles.btn, ...styles.approveBtn }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleResponse(req.verifierEmail, "rejected")}
                    style={{ ...styles.btn, ...styles.rejectBtn }}
                  >
                    Reject
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {message && <p style={styles.statusMessage}>{message}</p>}
    </div>
  );
}

// 🎨 Styles
const styles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #3b82f6, #9333ea)",
    fontFamily: "Poppins, sans-serif",
    color: "#fff",
    flexDirection: "column",
    textAlign: "center",
  },
  card: {
    background: "linear-gradient(135deg, #3b82f6, #9333ea)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    padding: "2rem",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    color: "#fff",
  },
  video: {
    borderRadius: "8px",
    margin: "10px 0",
    border: "2px solid #fff",
  },
  input: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  btn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    margin: "5px",
    transition: "background 0.3s ease",
  },
  loginBtn: { background: "#3b82f6", color: "#fff" },
  logoutBtn: { background: "#dc2626", color: "#fff" },
  approveBtn: { background: "#22c55e", color: "#fff" },
  rejectBtn: { background: "#ef4444", color: "#fff" },
  requestList: { listStyle: "none", padding: 0 },
  requestItem: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  statusMessage: {
    marginTop: "20px",
    fontWeight: "bold",
    color: "#fff",
  },
};
