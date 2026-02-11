import { useEffect, useState } from "react";

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/view-tasks");

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

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Available Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.task_id}
            style={{
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#1e293b",
              color: "white"
            }}
          >
            <h3>{task.task_description}</h3>

            <p><strong>Project ID:</strong> {task.project_id}</p>
            <p><strong>Status:</strong> {task.status}</p>

            <p>
              <strong>Repo:</strong>{" "}
              <a
                href={task.github_repo}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#3b82f6" }}
              >
                {task.github_repo}
              </a>
            </p>

            <div>
              <strong>Matched Skills:</strong>
              <div style={{ marginTop: "8px" }}>
                {task.matched_skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      marginRight: "8px",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: "#2563eb",
                      fontSize: "13px"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
