import { useState, useEffect } from "react";
import styles from "../css/Homepage.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function HomePage() {

  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");

    if (saved) return saved === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {

    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }

  }, [dark]);

  function redirectStudent() {
    navigate("/UserLogin");
  }

  function redirectAdmin() {
    navigate("/AdminLogin");
  }

  return (
    <div className={styles.pageWrapper}>

      {/* Navigation */}
      <nav className={styles.navbar}>

        <div className={styles.navContainer}>

          <div className={styles.logo}>
            Moat Swarming
          </div>

          <ul className={styles.navLinks}>
            <li>
              <a href="#features">Features</a>
            </li>

            <li>
              <a href="#equity">Equity</a>
            </li>

            <li>
              <a href="#platform">Platform</a>
            </li>

            <li>
              <a href="#workflow">Workflow</a>
            </li>
          </ul>

          <div className={styles.navActions}>

            {/* Theme Toggle */}
            <button
              className={styles.themeToggle}
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
            >
              <span className="material-icons-outlined">
                {dark ? "light_mode" : "dark_mode"}
              </span>
            </button>

            {/* Login Redirect */}
            <button
              className={styles.btnLogin}
              onClick={redirectStudent}
            >
              Login
            </button>

            {/* Get Started Redirect */}
            <button
              className={styles.btnPrimary}
              onClick={redirectStudent}
            >
              Get Started
            </button>

          </div>

        </div>

      </nav>

      <main>

        {/* Hero Section */}
        <section className={styles.hero}>

          <div className={styles.heroAtmosphere}>

            <div className={`${styles.blob} ${styles.blobRose}`}></div>

            <div className={`${styles.blob} ${styles.blobBlue}`}></div>

          </div>

          <div className={styles.heroContent}>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Build Startups Like a{" "}
              <span className={styles.highlight}>
                Swarm 🧠
              </span>
            </motion.h1>

            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              AI-powered collaboration meets fair equity
              distribution. <br />
              Deconstruct, rebuild, and own
              innovation—together.
            </motion.p>

            <div className={styles.heroActions}>

              <button
                className={`${styles.btnPrimary} ${styles.btnLg}`}
                onClick={redirectStudent}
              >
                Start Contributing
              </button>

              <button
                className={`${styles.btnOutline} ${styles.btnLg}`}
                onClick={redirectAdmin}
              >
                Explore Projects
              </button>

            </div>

            {/* Search Bar */}
            <div
              className={`${styles.searchBar} ${styles.glass}`}
            >

              <div className={styles.searchField}>

                <span className="material-icons-outlined">
                  search
                </span>

                <input
                  type="text"
                  placeholder="Skills/Tasks (e.g., React, AI, Design)"
                />

              </div>

              <div className={styles.searchDivider}></div>

              <div className={styles.searchField}>

                <span className="material-icons-outlined">
                  location_on
                </span>

                <input
                  type="text"
                  placeholder="Location (Global/Remote)"
                />

              </div>

              <button className={styles.btnSearch}>

                <span className="material-icons-outlined">
                  arrow_forward
                </span>

              </button>

            </div>

          </div>

        </section>

        {/* Why This Matters */}
        <section
          className={styles.section}
          id="features"
        >

          <div className={styles.container}>

            <h2 className={styles.sectionTitle}>
              Why This Platform Matters
            </h2>

            <div className={styles.featuresGrid}>

              <div
                className={`${styles.featureCard} ${styles.glass}`}
              >

                <div className={styles.cardIcon}>

                  <span className="material-icons-outlined">
                    rocket_launch
                  </span>

                </div>

                <h3>Open Innovation</h3>

                <p>
                  Anyone can contribute to real startups
                  globally. We bridge the gap between brilliant
                  ideas and global talent.
                </p>

              </div>

              <div
                className={`${styles.featureCard} ${styles.glass}`}
              >

                <div className={styles.cardIcon}>

                  <span className="material-icons-outlined">
                    psychology
                  </span>

                </div>

                <h3>AI Matching</h3>

                <p>
                  Smart skill-task alignment using AI
                  intelligence. The swarm knows exactly where
                  your skills are needed most.
                </p>

              </div>

              <div
                className={`${styles.featureCard} ${styles.glass}`}
              >

                <div className={styles.cardIcon}>

                  <span className="material-icons-outlined">
                    payments
                  </span>

                </div>

                <h3>Fair Equity</h3>

                <p>
                  Earn ownership based on actual contribution.
                  No more opaque cap tables—equity is a living,
                  breathing metric.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* Equity Section */}
        <section
          className={`${styles.section} ${styles.altBg}`}
          id="equity"
        >

          <div
            className={`${styles.container} ${styles.equityContainer}`}
          >

            <div className={styles.equityVisual}>

              <div className={styles.pieWrapper}>

                <div
                  className={`${styles.badgeOptimized} ${styles.glass}`}
                >
                  <span className={styles.pulseDot}></span>
                  AI Optimized
                </div>

                <div
                  className={`${styles.donutSegment} ${styles.segmentEmerald}`}
                ></div>

                <div
                  className={`${styles.donutSegment} ${styles.segmentRose}`}
                ></div>

                <div
                  className={`${styles.donutSegment} ${styles.segmentBlue}`}
                ></div>

                <div className={styles.pieCenter}>

                  <span className={styles.pieTitle}>
                    Equity
                  </span>

                  <span className={styles.pieSubtitle}>
                    Real-time split
                  </span>

                </div>

              </div>

            </div>

            <div className={styles.equityInfo}>

              <div className={styles.badgeInline}>
                AI Optimized
              </div>

              <h2
                className={`${styles.sectionTitle} ${styles.left}`}
              >
                Slicing Pie Equity Model 💡
              </h2>

              <p className={styles.sectionDesc}>
                The dynamic split ensures everyone gets exactly
                what they deserve. Equity isn't fixed; it's
                earned through tangible risk and contribution.
              </p>

              <ul className={styles.equityList}>

                <li>

                  <div className={styles.listIcon}>

                    <span className="material-icons-outlined">
                      schedule
                    </span>

                  </div>

                  <div className={styles.listContent}>

                    <h4>Time as Investment</h4>

                    <p>
                      Hours contributed are valued at a
                      standard fair-market rate, multiplied by
                      risk factors.
                    </p>

                  </div>

                </li>

                <li>

                  <div className={styles.listIcon}>

                    <span className="material-icons-outlined">
                      code
                    </span>

                  </div>

                  <div className={styles.listContent}>

                    <h4>Code & Deliverables</h4>

                    <p>
                      Automated GitHub syncing validates commits
                      and pull requests against project
                      milestones.
                    </p>

                  </div>

                </li>

                <li>

                  <div className={styles.listIcon}>

                    <span className="material-icons-outlined">
                      insights
                    </span>

                  </div>

                  <div className={styles.listContent}>

                    <h4>Risk Multipliers</h4>

                    <p>
                      Early contributors take more risk and
                      receive higher weightings in the pie.
                    </p>

                  </div>

                </li>

              </ul>

            </div>

          </div>

        </section>

        {/* Workflow */}
        <section
          className={styles.section}
          id="workflow"
        >

          <div className={styles.container}>

            <h2 className={styles.sectionTitle}>
              The Swarm Workflow
            </h2>

            <div className={styles.workflowGrid}>

              {[
                {
                  id: "01",
                  title: "Resume Upload",
                  desc: "Drop your CV or LinkedIn profile into our secure AI parser."
                },
                {
                  id: "02",
                  title: "Skill Extraction",
                  desc: "Our neural network maps your professional DNA to requirements."
                },
                {
                  id: "03",
                  title: "Task Matching",
                  desc: "Receive personalized suggestions where you matter most."
                },
                {
                  id: "04",
                  title: "Project Contribution",
                  desc: "Sync your tools and start building. Every line is tracked."
                },
                {
                  id: "05",
                  title: "Admin Monitoring",
                  desc: "AI managers provide real-time feedback and alignment."
                },
                {
                  id: "06",
                  title: "Equity Distribution",
                  desc: "Watch your ownership grow as tasks are completed."
                }
              ].map((step, idx) => (

                <div
                  key={idx}
                  className={styles.workflowStep}
                >

                  <span className={styles.stepNumberBg}>
                    {step.id}
                  </span>

                  <div className={styles.stepHeader}>

                    <div className={styles.stepDot}>
                      {idx + 1}
                    </div>

                    <h4>{step.title}</h4>

                  </div>

                  <p>{step.desc}</p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className={styles.ctaSection} id="platform">

          <div className={styles.ctaGlow}></div>

          <h2 className={styles.ctaTitle}>
            Join the Future of Building 🚀
          </h2>

          <p className={styles.ctaSubtitle}>
            Collaborate. Contribute. Own.
          </p>

          <button
            className={`${styles.btnPrimary} ${styles.btnXl}`}
            onClick={redirectStudent}
          >
            Start Contributing
          </button>

        </section>

      </main>

      {/* Footer */}
      <footer className={styles.mainFooter}>

        <div
          className={`${styles.container} ${styles.footerContainer}`}
        >

          <div className={styles.footerBrand}>

            <div
              className={`${styles.logo} ${styles.logoLg}`}
            >
              Moat Swarming
            </div>

            <p className={styles.copyright}>
              © 2026 Moat Swarming. AI-Synchronized Equity &
              Workflow.
            </p>

          </div>

          <div className={styles.footerLinks}>

            <a href="#">Documentation</a>

            <a href="#">Privacy Policy</a>

            <a href="#">Terms of Service</a>

            <a href="#">Investors</a>

            <a href="#">Contact</a>

          </div>

        </div>

      </footer>

    </div>
  );
}