import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/Userlogin.module.css";

export function UserLogin() {
  const navigate=useNavigate()

  const [gmail,setGmail]=useState("")
  const [password,setPassword]=useState("")  

  function handleGmail(event)
  {
    setGmail(event.target.value)
  }

  function handlePassword(event)
  {
    setPassword(event.target.value)
  }

  function handleSubmit(event)
  {
    event.preventDefault();
    //Api Call Here to fetch database and validate 
    if(password=="Ansh" && gmail=="Ansh")
    {
        navigate("/UserPage")
    }
  }


  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Welcome Back</div>

        <input
          type="text"
          placeholder="Enter your Gmail"
          className={styles.input}
          value={gmail}
          onChange={handleGmail}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className={styles.input}
          value={password}
          onChange={handlePassword}
        />

        <button className={styles.button} onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}
