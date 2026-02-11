import styles from "../css/UserPage.module.css";
import { useNavigate } from "react-router";
import { useState } from "react";

export function UserPage() {

  const navigate=useNavigate()
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please upload a PDF");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    const response = await fetch("http://localhost:8000/agent/extract-skills", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setSkills(data.skills || {});
    setLoading(false);
  };


  return (
    <div className={styles.page}>
      <h3 className={styles.header}>
        Welcome, ChatGPT Certified Senior Developer 🧠
      </h3>

      <h4 className={styles.subHeader}>
        Ah yes… another “self-taught” AI-assisted engineer.
        <br />
        Don't worry — we respect the Ctrl+C / Ctrl+V grind.
      </h4>

      <div className={styles.card}>
        <form onSubmit={handleUpload}>
          <label className={styles.label}>
            Upload your resume (prompt engineering counts as experience)
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
          {loading ? "Analyzing…" : "Extract Skills"}
        </button>

        <button
        type="button"
        onClick={() => {
          navigate('/TasksPage')
        }}
        className={styles.secondaryButton}
        >
        View Tasks
        </button>

        </form>


          {Object.entries(skills).length > 0 && (
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
)}

        
        
      </div>


    </div>
  );
}
