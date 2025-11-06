import React, { useState, useRef, useEffect } from "react";

function TopRightMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu if you click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "absolute", top: "15px", right: "20px" }} ref={menuRef}>
      {/* Button to toggle menu */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#3b82f6",
          border: "none",
          color: "white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        L
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "10px",
            background: "#2d2d2d",
            color: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            width: "200px",
            padding: "10px 0",
            zIndex: 100,
          }}
        >
          <button
            onClick={onLogout}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 15px",
              textAlign: "left",
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onMouseOver={(e) => (e.target.style.background = "#444")}
            onMouseOut={(e) => (e.target.style.background = "transparent")}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default TopRightMenu;
