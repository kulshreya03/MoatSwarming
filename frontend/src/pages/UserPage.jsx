import styles from "../css/UserPage.module.css";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export function UserPage() {

  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id"); // assuming saved after login

  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState({});
  const [existingSkills, setExistingSkills] = useState(null);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("choose"); 
  const [editText, setEditText] = useState("");

  const [equityData, setEquityData] = useState([]);


  /* ---- LOGOUT --- */
  function handleLogout() 
  {

    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    // Clear all stored user data
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    // localStorage.clear();

    navigate("/UserLogin"); // redirect to login page
  }



  /* ---------------- FETCH EXISTING SKILLS ---------------- */

  useEffect(() => {

    const fetchSkills = async () => {

      const res = await fetch(`http://localhost:8000/agent/user/skills/${userId}`);
      const data = await res.json();

      if (data.skills) {
        setExistingSkills(data.skills);
        setSkills(data.skills);
      }

    };

    fetchSkills();

  }, [userId]);



  /* ---------------- FILE HANDLING ---------------- */

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };



  /* ---------------- RESUME UPLOAD ---------------- */

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("user_id", userId);

    setLoading(true);

    const response = await fetch(
      "http://localhost:8000/agent/extract-skills",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    setSkills(data.skills || {});
    setExistingSkills(data.skills || {});
    setLoading(false);
    setMode("view");
  };



  /* ---------------- SAVE MANUAL EDIT ---------------- */

  const saveEditedSkills = async () => {

    let parsed;

    try {
      parsed = JSON.parse(editText);
    } catch {
      alert("Invalid JSON format");
      return;
    }

    const response = await fetch(
      "http://localhost:8000/agent/user/skills",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          skills: parsed
        })
      }
    );

    if (response.ok) {
      setSkills(parsed);
      setExistingSkills(parsed);
      setMode("view");
    }

  };



  /* ---------------- SKILLS DISPLAY ---------------- */

  const renderSkills = () => {

    if (!skills || Object.keys(skills).length === 0) return null;

    return (
      <div className={styles.skillsGrid}>
        {Object.entries(skills).map(([category, items]) =>
          items.length > 0 ? (
            <div key={category} className={styles.skillCard}>
              <h5 className={styles.skillTitle}>
                {category.replace("_", " ").toUpperCase()}
              </h5>

              <div className={styles.skillPills}>
                {items.map((skill, i) => (
                  <span key={i} className={styles.skillPill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    );
  };



  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <h3 className={styles.header}>
        Welcome, ChatGPT Certified Senior Developer 🧠
      </h3>

      <h4 className={styles.subHeader}>
        Ah yes… another “self-taught” AI-assisted engineer. <br /> Don't worry — we respect the Ctrl+C / Ctrl+V grind. <br />
        Extract your skills, contribute to tasks, and swarm innovation.
      </h4>



      {/* -------- ACTION BUTTONS -------- */}

      <div className={styles.actions}>

        {existingSkills && (
          <button
            onClick={() => setMode("view")}
            className={styles.secondaryButton}
          >
            Use Previous Skills
          </button>
        )}

        <button
          onClick={() => setMode("upload")}
          className={styles.secondaryButton}
        >
          Upload Resume
        </button>

        <button
          onClick={() => {
            setMode("edit");
            setEditText(JSON.stringify(skills, null, 2));
          }}
          className={styles.secondaryButton}
        >
          Edit Skills
        </button>

        <button
          onClick={() => window.open("/TasksPage", "_blank", "noopener,noreferrer")}
          className={styles.secondaryButton}
        >
          View Tasks
        </button>

        <button
          onClick={async () => {
            setMode("equity");

            const res = await fetch(
              `http://localhost:8000/user/equity/${userId}`
            );

            const data = await res.json();
            setEquityData(data);
          }}
          className={styles.secondaryButton}
        >
          💰 View My Equity
        </button>

      </div>



      {/* -------- UPLOAD MODE -------- */}

      {mode === "upload" && (
        <div className={styles.card}>

          <form onSubmit={handleUpload}>

            <label className={styles.label}>
              Upload Resume (PDF)
            </label>

            <input
              type="file"
              accept="application/pdf"
              className={styles.inputFile}
              onChange={handleFileChange}
            />

            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Analyzing Resume..." : "Extract Skills"}
            </button>

          </form>

        </div>
      )}



      {/* -------- EDIT MODE -------- */}

      {mode === "edit" && (
        <div className={styles.card}>

          <label className={styles.label}>
            Edit Skills (JSON format)
          </label>

          <textarea
            className={styles.textArea}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <button
            onClick={saveEditedSkills}
            className={styles.button}
          >
            Save Skills
          </button>

        </div>
      )}



      {/* -------- VIEW MODE -------- */}

      {mode === "view" && renderSkills()}

      {/* EQUITY MODE */}

      {mode === "equity" && (
      <div className={styles.equitySection}>

        <h2 className={styles.equityTitle}>
          💰 Your Equity Across Projects
        </h2>

        {equityData.length === 0 && (
          <p className={styles.noEquity}>
            No contributions yet. Start building 🚀
          </p>
        )}

        <div className={styles.equityGrid}>
          {equityData.map((item, index) => (

            <div key={index} className={styles.equityCard}>

              <h3 className={styles.projectName}>
                {item.project_name}
              </h3>

              <div className={styles.equityStats}>

                <div>
                  <span className={styles.labelSmall}>Units</span>
                  <p>{item.units}</p>
                </div>

                <div>
                  <span className={styles.labelSmall}>Equity</span>
                  <p className={styles.equityValue}>
                    {item.equity}%
                  </p>
                </div>

              </div>

              {/* Progress bar */}
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${item.equity}%` }}
                ></div>
              </div>

            </div>

          ))}
        </div>

      </div>
    )}

    </div>
  );
}