import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/AdminLogin.module.css";

export function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Login failed");
      }

      const admin = await response.json();

      // Store admin details
      localStorage.setItem("admin_id", admin.admin_id);
      localStorage.setItem("admin_name", admin.admin_name);
      localStorage.setItem("admin_email", admin.admin_email);
      localStorage.setItem("project_id", admin.project_id);

      navigate("/AdminDashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Admin Portal</div>

        <input
          type="text"
          placeholder="Enter your Email"
          className={styles.input}
          value={email}
          onChange={handleEmail}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className={styles.input}
          value={password}
          onChange={handlePassword}
        />

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.button} onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
}