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

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {tasks.map((task, index) => (
          <div key={index}>{task.name}</div>
        ))}
      </div>
    </div>
  );
}