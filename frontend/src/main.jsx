import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SmartShop Mobile App Runtime Error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#0f172a", color: "#ffffff", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px", color: "#38bdf8" }}>SmartShop AI Mobile App</h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "20px", maxWidth: "320px" }}>
            An unexpected initial state error occurred. Tap below to reset state and reload.
          </p>
          <button
            onClick={this.handleReset}
            style={{ backgroundColor: "#20c997", color: "#000000", fontWeight: "bold", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer" }}
          >
            Reset App State & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
