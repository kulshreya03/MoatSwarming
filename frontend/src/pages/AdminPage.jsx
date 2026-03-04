import { useState, useEffect } from "react";
import styles from "../css/AdminPage.module.css";

export function AdminPage() {

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/agent/view-ongoing-tasks"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!adminId || !organization || !password) {
      alert("Please fill all fields");
      return;
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Admin Dashboard</div>

        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {tasks.length === 0 && !loading && (
  <p>No assigned tasks found.</p>
)}

{tasks.map((task) => (
  <div key={task.task_id} className={styles.taskCard}>
    <div className={styles.taskHeader}>
      <span className={styles.taskId}>Task #{task.task_id}</span>
      <span className={styles.status}>{task.status}</span>
    </div>

    <p>{task.task_description}</p>

    <a
      href={task.github_repo}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Repository
    </a>
    </div>
  ))}

      </div>
    </div>
  );
}