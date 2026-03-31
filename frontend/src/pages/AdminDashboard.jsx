import { useEffect, useState } from "react";
import styles from "../css/AdminDashboard.module.css";

export function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("dashboard");

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalCommits: 0,
    productivity: 0
  });

  // 🔹 Fetch dashboard stats
  const fetchDashboardData = async () => {

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/admin/dashboard"
      );

      const data = await response.json();

      setStats(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch tasks
  const fetchTasks = async () => {

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/agent/view-ongoing-tasks"
      );

      const data = await response.json();
      setTasks(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users data
  const fetchUsers = async () => {

    setLoading(true);

    try {
        const response = await fetch(
        "http://localhost:8000/admin/users-with-tasks"
        );

        const data = await response.json();
        setUsers(data);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className={styles.page}>

      {/* Sidebar */}
      <div className={styles.sidebar}>

        <h2 className={styles.logo}>Admin Panel</h2>

        <button onClick={() => {
          setActiveTab("dashboard");
          fetchDashboardData();
        }}>
          📊 Dashboard
        </button>

        <button onClick={() => {
          setActiveTab("tasks");
          fetchTasks();
        }}>
          📋 View Tasks
        </button>

        <button onClick={() => setActiveTab("create")}>
          ➕ Create Project
        </button>

        <button onClick={() => {
            setActiveTab("users");
            fetchUsers();
            }}>
            👥 Manage Users
        </button>

      </div>

      {/* Main */}
      <div className={styles.main}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h1 className={styles.title}>
              Dashboard Overview
            </h1>

            <div className={styles.grid}>

              <div className={styles.card}>
                <h3>{stats.totalProjects}</h3>
                <p>Total Projects</p>
              </div>

              <div className={styles.card}>
                <h3>{stats.totalTasks}</h3>
                <p>Total Tasks</p>
              </div>

              <div className={styles.card}>
                <h3>{stats.activeTasks}</h3>
                <p>Active Tasks</p>
              </div>

              <div className={styles.card}>
                <h3>{stats.completedTasks}</h3>
                <p>Completed Tasks</p>
              </div>

              <div className={styles.card}>
                <h3>{stats.totalCommits}</h3>
                <p>Total Commits</p>
              </div>

              <div className={styles.card}>
                <h3>{stats.productivity}%</h3>
                <p>Productivity</p>
              </div>

            </div>

            <div className={styles.actions}>
              <button
                onClick={fetchDashboardData}
                className={styles.primaryBtn}
              >
                🔄 Refresh Data
              </button>
            </div>
          </>
        )}

        {/* TASKS */}
        {activeTab === "tasks" && (
          <>
            <h1 className={styles.title}>All Tasks</h1>

            {loading && (
              <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Loading tasks...</p>
              </div>
            )}

            {tasks.length === 0 && !loading && (
              <p className={styles.empty}>
                No tasks found
              </p>
            )}

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
          </>
        )}

        {/* CREATE PROJECT */}
        {activeTab === "create" && (
          <div className={styles.createSection}>
            <h1>Create Project</h1>
            <p>Upload project details and decompose into tasks 🚀</p>

            <button className={styles.primaryBtn}>
              Upload Project
            </button>
          </div>
        )}

        {/*USERS TAB*/}
        {activeTab === "users" && (
        <>
            <h1 className={styles.title}>User Management</h1>

            {loading && (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Loading users...</p>
            </div>
            )}

            {users.map((user) => (

            <div key={user.user_id} className={styles.userCard}>

                <div className={styles.userHeader}>
                <h3>{user.name}</h3>
                <span>{user.email}</span>
                </div>

                {user.tasks.length === 0 && (
                <p className={styles.noTask}>
                    No tasks assigned
                </p>
                )}

                {user.tasks.map((task) => (

                <div key={task.task_id} className={styles.userTask}>

                    <div className={styles.userTaskTop}>
                    <span>Task #{task.task_id}</span>
                    <span className={styles.status}>
                        {task.status}
                    </span>
                    </div>

                    <p>{task.description}</p>

                    <div className={styles.commitRow}>
                    Commits:
                    <span>{task.commits}</span>
                    </div>

                    <a
                    href={task.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.repoButton}
                    >
                    View Repo
                    </a>

                </div>

                ))}

            </div>

            ))}
        </>
        )}

      </div>

    </div>
  );
}