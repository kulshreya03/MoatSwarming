import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/AdminLogin.module.css";

export function AdminLogin() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!adminId || !organization || !password) {
      alert("Please fill all fields");
      return;
    }

    // Temporary navigation (replace with API call later)
    navigate("/AdminDashboard");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Admin Portal</div>

        <input
          type="text"
          placeholder="Enter Admin ID"
          className={styles.input}
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Organization"
          className={styles.input}
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
}