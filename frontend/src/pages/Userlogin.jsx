import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/Userlogin.module.css";

export function UserLogin() {
  const navigate=useNavigate()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const[error,setError]=useState("")  
  //const BACKEND_URL = "http://localhost:8000";

  function handleEmail(event)
  {
    setEmail(event.target.value)
  }

  function handlePassword(event)
  {
    setPassword(event.target.value)
  }

  async function handleSubmit(event)
  {
    event.preventDefault();
    //Api Call Here to fetch database and validate 
    setError("");

    if(!email || !password) 
    {
      setError("Please fill all the fields");
      return;
    }

    try
    {
      const response = await fetch("http://localhost:8000" + "/auth/login", {
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

      const user = await response.json(); //User id
      localStorage.setItem("user", JSON.stringify(user)); //Token
      
      navigate("/UserPage");
    }
    catch (error)
    {
      setError(error.message);
    }
  }


  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Welcome Back</div>

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


        <button className={styles.button} onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}
