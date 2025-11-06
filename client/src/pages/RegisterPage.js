// src/pages/RegisterPage.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-cpu";
import { startRegistration } from "@simplewebauthn/browser";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [fingerprintRegistered, setFingerprintRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);

  // Load face recognition models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.setBackend("cpu");
        await tf.ready();
        const MODEL_URL = process.env.PUBLIC_URL + "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        console.log("✅ Face-api models loaded");
      } catch (err) {
        console.error("Model load error:", err);
        setMessage("Error loading facial recognition models.");
      }
    };
    loadModels();
  }, []);

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Camera error:", error);
      setMessage("Unable to access camera");
    }
  };

  // Capture face descriptor
  const captureFace = async () => {
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setFaceDescriptor(Array.from(detection.descriptor));
        setMessage("✅ Face captured successfully!");
      } else {
        setMessage("❌ No face detected. Try again.");
      }
    } catch (err) {
      console.error("Face capture error:", err);
      setMessage("Error capturing face.");
    }
  };

  // Fingerprint registration via WebAuthn
  const handleFingerprintRegistration = async () => {
    try {
      const { data: options } = await axios.post(
        "http://localhost:3001/api/webauthn/register",
        { username: email }
      );

      const attResp = await startRegistration(options);

      const verifyRes = await axios.post(
        "http://localhost:3001/api/webauthn/verify-registration",
        { username: email, attResp }
      );

      if (verifyRes.data.verified) {
        setFingerprintRegistered(true);
        setMessage("✅ Fingerprint registered successfully!");
      } else {
        setMessage("❌ Fingerprint registration failed.");
      }
    } catch (err) {
      console.error("Fingerprint error:", err);
      setMessage("⚠️ Fingerprint registration failed or canceled.");
    }
  };

  // Submit registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!faceDescriptor) return setMessage("Please capture your face first.");
    if (!fingerprintRegistered) return setMessage("Please register your fingerprint first.");

    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        name: fullName,
        email,
        password,
        faceDescriptor,
      });

      setMessage(res.data.message || "✅ Registration complete!");
      setFullName("");
      setEmail("");
      setPassword("");
      setFaceDescriptor(null);
      setFingerprintRegistered(false);
    } catch (err) {
      console.error("Registration error:", err);
      setMessage(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Facial Recognition (Camera):</label>
          <video ref={videoRef} autoPlay muted width="280" height="180" style={styles.video}></video>
          <div>
            <button type="button" onClick={startCamera} style={styles.btn}>
               Start Camera
            </button>
            <button type="button" onClick={captureFace} style={styles.btn}>
              Capture Face
            </button>
          </div>

          <label style={styles.label}>Fingerprint Scan:</label>
          <button
            type="button"
            onClick={handleFingerprintRegistration}
            style={{
              ...styles.btn,
              backgroundColor: fingerprintRegistered ? "#22c55e" : "#3b82f6",
              color: "#fff",
            }}
          >
            {fingerprintRegistered ? "✅ Fingerprint Registered" : " Register Fingerprint"}
          </button>

          <button type="submit" style={styles.registerBtn}>
            Register
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    background: "linear-gradient(135deg, #3b82f6, #9333ea)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    width: "380px",
    textAlign: "center",
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    margin: "8px 0",
    outline: "none",
  },
  btn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    margin: "6px 5px",
    cursor: "pointer",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "600",
  },
  registerBtn: {
    width: "100%",
    marginTop: "15px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  label: {
    display: "block",
    marginTop: "15px",
    textAlign: "left",
    fontWeight: "600",
  },
  video: {
    borderRadius: "8px",
    border: "2px solid #fff",
    margin: "10px 0",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};
