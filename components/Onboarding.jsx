import { useState } from "react";
import { STORAGE_KEYS } from "../src/api/utils/storage";
import ActEarlyLogo from "../components/ActEarlyLogo";


export default function Onboarding({ onComplete }) {

  const [workBreak, setWorkBreak] = useState("50-10");
  const [workspace, setWorkspace] = useState("Office");
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const handleStart = () => {

    const workMinutes = parseInt(workBreak.split("-")[0]);
    const intervalSeconds = workMinutes * 60;

    try {
      localStorage.setItem(STORAGE_KEYS.REMINDER_FREQUENCY, intervalSeconds);
      localStorage.setItem("actearly_workspace", workspace);
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, "true");
    } catch (e) {
      console.error("localStorage failed", e);
    }

    onComplete();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "32px 16px 48px",
boxSizing: "border-box"
      }}
    >
      <div
        style={{
          padding: "40px",
          maxWidth: "480px",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          lineHeight: "1.5"
        }}
      >

        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px"
  }}
>
  <ActEarlyLogo className="w-7 h-7" />

  <h2
    style={{
      margin: 0,
      fontSize: "24px",
      fontWeight: "600",
      color: "#000000"
    }}
  >
    ActEarly
  </h2>
</div>
        

        <h1
          style={{
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "1.2"
          }}
        >
          Protect your body while you work.
        </h1>

        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          ActEarly prompts short guided movement breaks so stiffness never builds up during long desk sessions.
        Reduce strain from long hours of sitting.
        </p>

        <hr style={{ margin: "25px 0" }} />

        <h3 style={{ marginTop: "24px", fontSize: "16px" }}>
          Work / Break Rhythm
        </h3>

        <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
          Choose how long you focus before a short guided movement break.
        </p>

        <select
  value={workBreak}
  onChange={(e) => setWorkBreak(e.target.value)}
  onFocus={(e) => e.currentTarget.style.border = "1px solid #14b8a6"}
  onBlur={(e) => e.currentTarget.style.border = "1px solid #e2e8f0"}

  style={{
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "15px",
    cursor: "pointer"
  }}
>
          <option value="25-5">25 min work • 5 min movement break</option>
          <option value="50-10">50 min work • 10 min movement break (Recommended)</option>
          <option value="90-10">90 min work • 10 min movement break</option>
        </select>

        <h3 style={{ marginTop: "25px", fontSize: "16px"  }}>Workspace</h3>

        <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
          This helps ActEarly suggest movements suited for your environment.
        </p>

        <select
          value={workspace}
          onChange={(e) => setWorkspace(e.target.value)}
          onFocus={(e) => e.currentTarget.style.border = "1px solid #14b8a6"}
  onBlur={(e) => e.currentTarget.style.border = "1px solid #e2e8f0"}

          style={{
  width: "100%",
  padding: "10px 12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: "15px",
  cursor: "pointer"
}}
        >
          <option value="Office">Office — subtle desk movements</option>
          <option value="Home">Home — full range of motion</option>
        </select>

        <p style={{ fontSize: "13px", color: "#777", marginTop: "20px" }}>
          More configuration is available later in <b>Settings</b>.
        </p>

        <div style={{ marginTop: "25px" }}>
          <label style={{ fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={acceptedDisclaimer}
              onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            I understand this app provides general wellness guidance and is not medical advice.
          </label>
        </div>

        <button
          onClick={handleStart}
          disabled={!acceptedDisclaimer}
          onMouseOver={(e) => (e.currentTarget.style.background = "#0f9f8c")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#14b8a6")}
          style={{
            marginTop: "30px",
            padding: "14px",
            width: "100%",
            fontSize: "16px",
            fontWeight: "600",
            background: "#14b8a6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: acceptedDisclaimer ? "pointer" : "not-allowed",
            opacity: acceptedDisclaimer ? 1 : 0.5,
            transition: "all 0.15s ease"
          }}
        >
          Let's ActEarly
        </button>

      </div>
    </div>
  );
}