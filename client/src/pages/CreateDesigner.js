// src/pages/CreateDesigner.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Rnd } from "react-rnd";
import "./CreateDesigner.css";

const CreateDesigner = () => {
  // 🔹 States
  const [title] = useState("CERTIFICATE OF COMPLETION");
  const [recipient, setRecipient] = useState("John Doe");
  const [course, setCourse] = useState("Blockchain Basics");
  const [date, setDate] = useState("2024-04-27");
  const [template, setTemplate] = useState(
    parseInt(localStorage.getItem("selectedTemplate"), 10) || 1
  );
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [logoProps, setLogoProps] = useState({ x: 20, y: 20, width: 100, height: 100 });
  const [sigProps, setSigProps] = useState({ x: 550, y: 400, width: 150, height: 80 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [toast, setToast] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  const certificateRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Effects
  useEffect(() => {
    localStorage.setItem("selectedTemplate", template);
  }, [template]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 🔹 Helpers
  const showToast = (msg, type = "success") => setToast({ msg, type });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSignature(URL.createObjectURL(file));
  };

  const handleDownloadPDF = async () => {
    const certificateElement = document.getElementById("certificate-preview");
    if (!certificateElement) return;
    try {
      const canvas = await html2canvas(certificateElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${recipient}_certificate.pdf`);
      showToast("Certificate downloaded as PDF! ✅");
      setShowDropdown(false);
    } catch (err) {
      console.error("Error generating PDF:", err);
      showToast("Failed to create PDF ❌", "error");
    }
  };

  const handleDownloadPNG = async () => {
    const certificateElement = document.getElementById("certificate-preview");
    if (!certificateElement) return;
    try {
      const canvas = await html2canvas(certificateElement, { scale: 2 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${recipient}_certificate.png`;
      link.click();
      showToast("Certificate downloaded as PNG! ✅");
      setShowDropdown(false);
    } catch (err) {
      console.error("Error generating PNG:", err);
      showToast("Failed to create PNG ❌", "error");
    }
  };

  // 🔹 Render Template
  const renderTemplate = (isThumbnail = false, t = template) => {
    const baseClass = isThumbnail ? "template-thumbnail" : "template-full";
    const content = (
      <>
        {logo && !isThumbnail && (
          <Rnd
            size={{ width: logoProps.width, height: logoProps.height }}
            position={{ x: logoProps.x, y: logoProps.y }}
            onDragStop={(e, d) => setLogoProps({ ...logoProps, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, pos) =>
              setLogoProps({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: pos.x,
                y: pos.y,
              })
            }
            bounds="parent"
          >
            <img src={logo} alt="Logo" className="logo" />
          </Rnd>
        )}

        <h1 className="title">{title}</h1>
        <h2 className="recipient">{recipient}</h2>

        {!isThumbnail && (
          <>
            <h3 className="course">{course}</h3>
            <p className="date">{date}</p>
          </>
        )}

        {signature && !isThumbnail && (
          <Rnd
            size={{ width: sigProps.width, height: sigProps.height }}
            position={{ x: sigProps.x, y: sigProps.y }}
            onDragStop={(e, d) => setSigProps({ ...sigProps, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, pos) =>
              setSigProps({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: pos.x,
                y: pos.y,
              })
            }
            bounds="parent"
          >
            <img src={signature} alt="Signature" className="signature" />
          </Rnd>
        )}
      </>
    );

    return (
      <div className={`certificate template-${t} ${baseClass}`}>
        {content}
      </div>
    );
  };

  // 🔹 Single return for everything
  return (
    <>
      {/* Navbar (only inside CreateDesigner) */}
      <nav className="designer-navbar">
        <div className="nav-left">
          <span className="nav-logo">🎓</span>
          <span className="nav-title">Certificate Designer</span>
        </div>
        <div className="nav-right">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/register" className="nav-link">Register</NavLink>
          <NavLink to="/login" className="nav-link">Login</NavLink>
          <NavLink to="/issuer" className="nav-link">Issuer Dashboard</NavLink>
          <NavLink to="/verifier" className="nav-link">Verifier</NavLink>
        </div>
      </nav>

      {/* Designer Page */}
      <main className="designer-container">
        <div className="designer-grid">
          {/* Certificate Preview or Template Selector */}
          <div className="designer-preview">
            {isPreviewMode ? (
              <div id="certificate-preview" ref={certificateRef}>
                {renderTemplate(false)}
              </div>
            ) : (
              <div className="template-selector">
                {[1, 2, 3, 4, 5].map((t) => (
                  <div
                    key={t}
                    className={`template-option ${
                      hoveredTemplate === t ? "hovered" : ""
                    }`}
                    onClick={() => setTemplate(t)}
                    onMouseEnter={() => setHoveredTemplate(t)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    {/* click-wrapper prevents child stealing the click */}
                    <div className="click-wrapper">{renderTemplate(true, t)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="designer-settings">
            <label>Recipient</label>
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} />

            <label>Course</label>
            <input value={course} onChange={(e) => setCourse(e.target.value)} />

            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <label>Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />

            <label>Upload Signature</label>
            <input type="file" accept="image/*" onChange={handleSignatureUpload} />

            <button className="btn" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              {isPreviewMode ? "Choose Template" : "Back to Preview"}
            </button>

            <div className="dropdown" ref={dropdownRef}>
              <button className="btn" onClick={() => setShowDropdown(!showDropdown)}>
                Download
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleDownloadPDF}>Download PDF</button>
                  <button onClick={handleDownloadPNG}>Download PNG</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </main>
    </>
  );
};

export default CreateDesigner;
