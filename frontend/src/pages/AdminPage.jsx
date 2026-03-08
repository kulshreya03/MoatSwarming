import { useState, useEffect } from "react";
import styles from "../css/AdminPage.module.css";

export function AdminPage() {

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTasks: 0,
    ongoingTasks: 0,
    totalCommits: 0
  });

  const fetchTasks = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await fetch(
        "http://localhost:8000/agent/view-ongoing-tasks"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);

      const totalCommits = data.reduce(
        (sum, t) => sum + t.commit_count,
        0
      );

      setStats({
        totalTasks: data.length,
        ongoingTasks: data.filter(
          (t) => t.status === "assigned"
        ).length,
        totalCommits
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <div className={styles.title}>
          Admin Dashboard
        </div>

        {/* Stats Section */}
        <div className={styles.statsGrid}>

          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {stats.totalTasks}
            </span>
            <span className={styles.statLabel}>
              Total Tasks
            </span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {stats.ongoingTasks}
            </span>
            <span className={styles.statLabel}>
              Ongoing Tasks
            </span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {stats.totalCommits}
            </span>
            <span className={styles.statLabel}>
              Total Commits
            </span>
          </div>

        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <button
            className={styles.refreshButton}
            onClick={fetchTasks}
          >
            Fetch Ongoing Tasks
          </button>
        </div>

        {loading && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Fetching ongoing tasks...</p>
          </div>
        )}

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

        {tasks.length === 0 && !loading && (
          <p className={styles.empty}>
            No ongoing tasks found
          </p>
        )}

        {/* Task List */}
        {tasks.map((task) => (

          <div
            key={task.task_id}
            className={styles.taskCard}
          >

            <div className={styles.taskHeader}>

              <span className={styles.taskId}>
                Task #{task.task_id}
              </span>

              <span className={styles.status}>
                {task.status}
              </span>

            </div>

            <div className={styles.projectSection}>
              <span className={styles.projectLabel}>
                Project
              </span>

              <span className={styles.projectId}>
                {task.project_id}
              </span>
            </div>

            <p className={styles.description}>
              {task.task_description}
            </p>

            <div className={styles.commitSection}>

              <span className={styles.commitLabel}>
                Commits
              </span>

              <span
                className={`${styles.commitCount} ${
                  task.commit_count === 0
                    ? styles.noCommits
                    : ""
                }`}
              >
                {task.commit_count}
              </span>

            </div>

            <div className={styles.activityIndicator}>
              {task.commit_count === 0
                ? "⚠ No development activity yet"
                : "🔥 Active development"}
            </div>

            <a
              href={task.github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoButton}
            >
              View Repository
            </a>

          </div>

        ))}

      </div>

    </div>
  );
}