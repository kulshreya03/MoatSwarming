import styles from "../css/TasksPage.module.css";
import { useEffect, useState } from "react";

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingTasks, setSubmittingTasks] = useState(new Set());

  const userId = localStorage.getItem("user_id");

  
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/agent/view-tasks/${userId}`
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

    useEffect(() => {

    fetchTasks();
  }, []);

  const handleSubmit = async (taskId) => {

    // mark this task as submitting
    setSubmittingTasks(prev => new Set(prev).add(taskId));

    try {
      const response = await fetch(
        `http://localhost:8000/tasks/update-status?task_id=${taskId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to update");
      }

      const data = await response.json();
      console.log("Task status updated:", data);

      // update task status locally
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.task_id === taskId
            ? { ...task, status: "Submitted" }
            : task
        )
      );

    } catch (err) {
      setError(err.message);
    } finally {

      // remove submitting state
      setSubmittingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });

    }
  };

  if (loading)
  return (
    <div className={styles.centerMessage}>Loading Tasks... 
      <div className={styles.loader}></div>
    </div>
  );

  if (error)
    return (
      <div className={styles.centerMessage}>
        Error: {error}
      </div>
    );

  return (
    <div className={styles.page}>
      <h2 className={styles.header}>Available Tasks</h2>

      {tasks.length === 0 ? (
        <p className={styles.empty}>No tasks available</p>
      ) : (
        <div className={styles.tasksGrid}>
          {tasks.map((task) => (
            <div key={task.task_id} className={styles.card}>
              
              {/* Content Wrapper */}
              <div>
                <h3 className={styles.title}>
                  {task.task_description}
                </h3>

                <p className={styles.meta}>
                  <strong>Project ID:</strong> {task.project_id}
                </p>

                <p className={styles.meta}>
                  <strong>Status:</strong> {task.status}
                </p>

                <p className={styles.meta}>
                  <strong>Repo:</strong>{" "}
                  <a
                    href={task.github_repo}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.repoLink}
                  >
                    {task.github_repo}
                  </a>
                </p>

                <div className={styles.skillsSection}>
                  <div className={styles.skillsTitle}>
                    MATCHED SKILLS
                  </div>

                  <div className={styles.skillPills}>
                    {task.matched_skills.map((skill, i) => (
                      <span key={i} className={styles.skillPill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className={`${styles.submitButton} ${
                  task.status === "Submitted" ? styles.submittedButton : ""
                }`}
                onClick={() => handleSubmit(task.task_id)}
                disabled={
                  submittingTasks.has(task.task_id) || task.status === "Submitted"
                }
              >
                {submittingTasks.has(task.task_id)
                  ? "Submitting..."
                  : task.status === "Submitted"
                  ? "Submitted ✓"
                  : "Submit"}
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
