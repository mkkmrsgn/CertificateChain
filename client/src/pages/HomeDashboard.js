import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Users,
  Zap,
  ArrowRight,
  Fingerprint,
  Box,
} from "lucide-react";

const HomePage = () => {
  // Features array
  const features = [
    {
      icon: Shield,
      title: "Secure Identity Verification",
      description:
        "Advanced biometric authentication using fingerprint and facial recognition technology.",
    },
    {
      icon: Lock,
      title: "Blockchain Security",
      description:
        "Immutable identity records stored securely on blockchain infrastructure.",
    },
    {
      icon: Users,
      title: "Multi-Role Support",
      description:
        "Comprehensive platform supporting issuers, verifiers, and identity holders.",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description:
        "Real-time identity verification with instant results and notifications.",
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContainer}>
          {/* Logo */}
          <div style={styles.logoWrapper}>
            <Shield size={160} color="#fff" fill="#2563eb" strokeWidth={1.5} />
            <div style={styles.logoOverlay}>
              <Fingerprint size={40} color="#fff" />
              <div style={styles.logoIcons}>
                <Box size={24} color="#fff" />
                <Box size={18} color="#fff" />
              </div>
            </div>
          </div>

          <h1 style={styles.title}>BLOCK ID</h1>
          <p style={styles.subtitle}>
            The next generation of digital identity verification powered by
            blockchain technology and advanced biometric authentication systems.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/register" style={styles.linkStyle}>
              <button style={styles.primaryBtn}>
                Get Started <ArrowRight size={18} style={styles.buttonIcon} />
              </button>
            </Link>
            <Link to="/login" style={styles.linkStyle}>
              <button style={styles.secondaryBtn}>Sign In</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose Block ID?</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <feature.icon size={40} color="#2563eb" />
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaBox}>
          <h2 style={styles.ctaTitle}>Ready to Secure Your Digital Identity?</h2>
          <p style={styles.ctaText}>
            Join thousands of users who trust Block ID for secure, verified
            digital identities.
          </p>
          <Link to="/register" style={styles.linkStyle}>
            <button style={styles.primaryBtn}>
              Create Your Block ID <Shield size={18} style={styles.buttonIcon} />
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 Block ID. Securing digital identities with blockchain technology.
        </p>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#fff",
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #374151 100%)",
    backgroundAttachment: "fixed",
    margin: 0,
    padding: 0,
  },
  hero: {
    width: "100%",
    minHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "80px 20px",
  },
  heroContainer: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
  },
  logoWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "30px",
  },
  logoOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoIcons: {
    display: "flex",
    gap: "6px",
    marginTop: "6px",
  },
  title: {
    fontSize: "4rem",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "30px",
    letterSpacing: "0.1em",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#e2e8f0",
    marginBottom: "40px",
    lineHeight: "1.6",
    maxWidth: "800px",
    margin: "0 auto 40px auto",
  },
  heroButtons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginTop: "30px",
    flexWrap: "wrap",
  },
  linkStyle: {
    textDecoration: "none",
  },
  buttonIcon: {
    marginLeft: "8px",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    border: "2px solid #2563eb",
    color: "#2563eb",
    padding: "12px 26px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  featuresSection: {
    padding: "80px 20px",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "50px",
    color: "#fff",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  featureCard: {
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "15px",
    padding: "30px",
    textAlign: "center",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  featureTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "15px",
    color: "#fff",
  },
  featureDesc: {
    fontSize: "0.95rem",
    color: "#cbd5e1",
    marginTop: "10px",
    lineHeight: "1.6",
  },
  ctaSection: {
    padding: "80px 20px",
    textAlign: "center",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  ctaBox: {
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(147,51,234,0.15) 100%)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "20px",
    padding: "50px 40px",
    maxWidth: "700px",
    margin: "0 auto",
    backdropFilter: "blur(10px)",
  },
  ctaTitle: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#fff",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  },
  ctaText: {
    fontSize: "1.1rem",
    color: "#e2e8f0",
    marginBottom: "35px",
    lineHeight: "1.6",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center",
    padding: "30px 20px",
    marginTop: "60px",
    background: "rgba(0,0,0,0.2)",
  },
  footerText: {
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
};

export default HomePage;
