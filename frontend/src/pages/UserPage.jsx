import styles from "../css/UserPage.module.css";
import { useState } from "react";

export function UserPage() {

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
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Extract Skills"}
          </button>
        </form>

        {Object.entries(skills).map(([category, items]) => (
          items.length > 0 && (
            <div key={category}>
              <h5>{category.toUpperCase()}</h5>
              <ul>
                {items.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          )
        ))}
        
      </div>


    </div>
  );
}
