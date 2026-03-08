import styles from "../css/HomePage.module.css";
import { useNavigate } from "react-router-dom";

export function HomePage() 
{

    const navigate=useNavigate()

    function redirectStudent()
    {
        navigate("/UserLogin")
    }

    function redirectAdmin()
    {
        navigate("/AdminLogin")
    }

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Moat Swarming Framework</h1>
        <p className={styles.subtitle}>
          A collaborative innovation platform that empowers people to analyze,
          deconstruct and replicate dominant market business models through
          collective intelligence, open collaboration and fair equity
          distribution.
        </p>

        <div className={styles.ctaRow}>
          <button className={styles.primaryBtn} onClick={redirectStudent}>Start Contributing</button>
          <button className={styles.secondaryBtn} onClick={redirectAdmin}>Explore Projects</button>
        </div>
      </section>

      {/* ABOUT */}
    <section className={styles.section}>
    <h2>About the Moat Swarming Framework</h2>

    <p>
        The <strong>Moat Swarming Framework</strong> is an AI-assisted collaborative
        innovation platform designed to democratize entrepreneurship and lower the
        barriers to building impactful ventures. Instead of individuals working in
        isolation, the platform enables communities to collectively analyze,
        deconstruct, and rebuild complex products and services through coordinated
        collaboration.
    </p>

    <p>
        At its core, the framework combines <strong>Agentic AI systems</strong>,
        skill-based task orchestration, and transparent contribution tracking to
        create a scalable environment where people with diverse backgrounds can
        contribute meaningfully to real-world projects.
    </p>

    <p>
        Contributors begin by uploading their resumes, which are processed by an
        <strong>AI Skill Extraction Agent</strong>. Using LLM-based document
        understanding and semantic analysis, the system converts unstructured
        resumes into structured skill profiles. These profiles are then used by the
        <strong>Skill Mapping Engine</strong> to match contributors with tasks that
        align with their capabilities.
    </p>

    <p>
        The platform uses an <strong>Agentic Task Decomposition Engine</strong> to
        break large projects into smaller actionable tasks. This allows contributors
        to participate in manageable work units while collectively building complex
        systems.
    </p>

    <p>
        Contribution tracking is handled through integration with the
        <strong> GitHub Model Context Protocol (MCP)</strong>. By analyzing commit
        histories and repository activity, the platform automatically measures
        participation levels and provides real-time contribution analytics.
    </p>

    <p>
        These metrics are processed by the <strong>Equity Distribution Engine</strong>,
        which ensures that contributors receive fair recognition and potential
        rewards based on the impact of their work.
    </p>

    <p>
        Through the combination of AI coordination, transparent contribution
        tracking, and collaborative development, the Moat Swarming Framework aims to
        enable large-scale cooperative innovation and challenge traditional barriers
        to entrepreneurship.
    </p>
    </section>

      {/* WHY IT MATTERS */}
      <section className={styles.sectionAlt}>
        <h2>Why This Platform Matters</h2>

        <div className={styles.grid3}>
          <div className={styles.card}>
            <h3>Economic Inclusion</h3>
            <p>
              Enables unemployed and underemployed individuals to contribute to
              meaningful projects and gain ownership in collaborative ventures.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Skill-Based Contribution</h3>
            <p>
              Contributors are matched with tasks based on their real skills
              extracted directly from resumes using AI.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Transparent Equity</h3>
            <p>
              Every contribution is tracked through GitHub commits and task
              completion metrics to enable fair equity distribution.
            </p>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className={styles.section}>
        <h2>How the Platform Works</h2>

        <div className={styles.workflow}>

          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h4>Resume Upload</h4>
            <p>
              Contributors upload their resumes. The AI skill extraction engine
              analyzes the document to identify technical and domain expertise.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h4>Skill Extraction</h4>
            <p>
              Skills are extracted using AI agents and converted into a
              structured skill matrix used by the platform.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h4>Task Matching</h4>
            <p>
              The Skill Mapper module matches contributor skills with project
              tasks generated by the AI project decomposition engine.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h4>Project Contribution</h4>
            <p>
              Contributors work on assigned tasks and push their work to GitHub.
              Commit data is tracked automatically.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>5</div>
            <h4>Admin Monitoring</h4>
            <p>
              Admins monitor project progress, contribution metrics, and task
              completion through a centralized dashboard.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>6</div>
            <h4>Equity Distribution</h4>
            <p>
              Contribution analytics determine fair equity allocation across
              contributors based on participation and impact.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.sectionAlt}>
        <h2>Core Platform Features</h2>

        <div className={styles.grid3}>
          <div className={styles.card}>
            <h3>AI Skill Extraction</h3>
            <p>
              Automatically extract skills from resumes using intelligent
              document analysis agents.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Semantic Task Matching</h3>
            <p>
              Match contributors to tasks using semantic skill analysis instead
              of simple keyword matching.
            </p>
          </div>

          <div className={styles.card}>
            <h3>GitHub Contribution Tracking</h3>
            <p>
              Monitor contributions using commit analytics integrated through
              the GitHub MCP service.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Project Decomposition AI</h3>
            <p>
              Large project ideas are automatically broken down into manageable
              tasks using AI planning agents.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Task Orchestration</h3>
            <p>
              Real-time coordination between contributors, tasks, and project
              goals ensures efficient collaboration.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Equity Distribution Engine</h3>
            <p>
              Transparent algorithms evaluate contributions and distribute
              rewards fairly across participants.
            </p>
          </div>
        </div>
      </section>


      {/* TECH STACK */}
      <section className={styles.sectionAlt}>
        <h2>Technology Stack</h2>

        <div className={styles.grid3}>
          <div className={styles.card}>
            <h3>Backend</h3>
            <p>FastAPI • SQLAlchemy • Uvicorn • Python AI Agents</p>
          </div>

          <div className={styles.card}>
            <h3>Frontend</h3>
            <p>React • Vite • CSS Modules • Modern UI Components</p>
          </div>

          <div className={styles.card}>
            <h3>Integrations</h3>
            <p>GitHub MCP • LLM Skill Agents • Contribution Analytics</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <h3>Join the Future of Collaborative Innovation</h3>
        <p>
          Contribute your skills, collaborate with others, and build meaningful
          ventures together.
        </p>
      </footer>

    </div>
  );
}