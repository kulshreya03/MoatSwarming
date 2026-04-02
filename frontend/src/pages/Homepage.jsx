import styles from "../css/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function HomePage() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  function redirectStudent() {
    navigate("/UserLogin");
  }

  function redirectAdmin() {
    navigate("/AdminLogin");
  }

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className={styles.page}>   {/* ✅ IMPORTANT FIX */}

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <h2 className={styles.logo}>Moat Swarming</h2>

        <div className={styles.navActions}>
          <button
            onClick={() => setDark(!dark)}
            className={styles.toggle}
            aria-label="Toggle Theme"
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>

          <button className={styles.navBtn} onClick={redirectStudent}>
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.blob}></div>

        <motion.h1
          className={styles.title}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
        >
          Build Startups Like a Swarm 🧠
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
        >
          AI-powered collaboration meets fair equity distribution.
          Deconstruct, rebuild, and own innovation—together.
        </motion.p>

        <motion.div
          className={styles.ctaRow}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
        >
          <button className={styles.primaryBtn} onClick={redirectStudent}>
            Start Contributing
          </button>

          <button className={styles.secondaryBtn} onClick={redirectAdmin}>
            Explore Projects
          </button>
        </motion.div>

        <div className={styles.searchBar}>
          <input placeholder="Search skills, tasks, projects..." />
          <input placeholder="Location / Remote" />
          <button className={styles.searchBtn}>Search</button>
        </div>
      </section>

      {/* WHY */}
      <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible">
        <h2>Why This Platform Matters</h2>

        <div className={styles.grid3}>
          <div className={styles.card}>
            <h3>🚀 Open Innovation</h3>
            <p>Anyone can contribute to real startups globally.</p>
          </div>

          <div className={styles.card}>
            <h3>🧠 AI Matching</h3>
            <p>Smart skill-task alignment using AI intelligence.</p>
          </div>

          <div className={styles.card}>
            <h3>💰 Fair Equity</h3>
            <p>Earn ownership based on actual contribution.</p>
          </div>
        </div>
      </motion.section>

      {/* SLICING PIE */}
      <motion.section className={styles.sectionAlt} variants={fadeUp} initial="hidden" whileInView="visible">
        <h2>Slicing Pie Equity Model 💡</h2>

        <div className={styles.pieContainer}>
          <div className={styles.pie}></div>

          <div className={styles.pieText}>
            <p>
              We use the <strong>Slicing Pie model</strong> to dynamically split
              equity based on real-time contributions.
            </p>

            <ul>
              <li>⏱ Time invested → slices earned</li>
              <li>💻 Code contributions → weighted impact</li>
              <li>📈 Risk & effort → higher equity share</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible">
        <h2>Platform Capabilities</h2>

        <div className={styles.grid3}>
          <div className={styles.card}>
            <h3>🤖 AI Agents</h3>
            <p>Automated skill extraction & task decomposition.</p>
          </div>

          <div className={styles.card}>
            <h3>📊 Real-Time Metrics</h3>
            <p>Track contributions via GitHub commits.</p>
          </div>

          <div className={styles.card}>
            <h3>⚡ Scalable Collaboration</h3>
            <p>Work with hundreds of contributors seamlessly.</p>
          </div>
        </div>
      </motion.section>

      {/* WORKFLOW */}
      <section className={styles.sectionAlt}>
        <h2>How It Works</h2>

        <div className={styles.workflow}>
          {[
            { title: "Resume Upload", desc: "AI analyzes resumes to identify skills and expertise." },
            { title: "Skill Extraction", desc: "Skills converted into structured skill matrix." },
            { title: "Task Matching", desc: "AI matches skills with project tasks." },
            { title: "Project Contribution", desc: "Work pushed via GitHub and tracked." },
            { title: "Admin Monitoring", desc: "Admins track metrics and performance." },
            { title: "Equity Distribution", desc: "Fair equity based on contributions." },
          ].map((step, i) => (
            <motion.div key={i} className={styles.step} variants={fadeUp} initial="hidden" whileInView="visible">
              <div className={styles.stepNumber}>{i + 1}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <h3>Join the Future of Building 🚀</h3>
        <p>Collaborate. Contribute. Own.</p>
      </footer>

    </div>
  );
}