import styles from "../css/UserPage.module.css";

export function UserPage() {
  return (
    <div className={styles.page}>
      <h3 className={styles.header}>
        Welcome, ChatGPT Certified Senior Developer 🧠
      </h3>

      <h4 className={styles.subHeader}>
        Ah yes… another “self-taught” AI-assisted engineer.
        <br />
        Don’t worry — we respect the Ctrl+C / Ctrl+V grind.
      </h4>

      <div className={styles.card}>
        <form>
          <label className={styles.label}>
            Upload your resume (prompt engineering counts as experience)
          </label>
          <input type="file" className={styles.inputFile} />
        </form>
      </div>
    </div>
  );
}
