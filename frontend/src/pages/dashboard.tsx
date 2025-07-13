import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AccountLinkCard from "../components/AccountLinkCard";
import ReportViewer from "../components/ReportViewer";
import styles from "../styles/dashboard.module.css";
import { checkLinkedAccounts } from "../api/linkAccounts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

interface LinkedAccounts {
  github: boolean;
  linear: boolean;
  zoho: boolean;
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [linked, setLinked] = useState<LinkedAccounts>({
    github: false,
    linear: false,
    zoho: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    const fetchLinks = async () => {
      try {
        const accountsData = await checkLinkedAccounts(token);
        setLinked(accountsData);
      } catch (err) {
        console.error("Failed to fetch linked accounts", err);
        setError("Failed to load linked accounts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [token, user]);

  useEffect(() => {
    const delayRedirect = setTimeout(() => {
      if (!token || !user) {
        router.push("/login");
      }
    }, 500);

    return () => clearTimeout(delayRedirect);
  }, [token, user]);

  const handleLinkGithub = async () => {
    if (!user?.id) {
      setError("User ID not available.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/login/github?user_id=${user.id}`);
      const data = await res.json();

      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        console.error("GitHub auth URL error:", data);
        setError(data.error || "GitHub auth failed.");
      }
    } catch (err) {
      console.error("Error during GitHub OAuth:", err);
      setError("GitHub linking failed.");
    }
  };

  const handleUnlink = async (provider: string) => {
    if (!user?.id || !token) {
      setError("Missing user session.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/link/unlink/${provider}?user_id=${user.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(`Failed to unlink ${provider}`);
      const updated = { ...linked, [provider]: false };
      setLinked(updated);
    } catch (err) {
      console.error("Unlinking failed", err);
      setError(`Could not unlink ${provider}.`);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Loading dashboard...</p>
            <div className={styles.loadingSubtext}>
              Preparing your analytics workspace
            </div>
          </div>
        </div>
      </>
    );
  }

  const connectedCount = Object.values(linked).filter(Boolean).length;
  const totalCount = Object.keys(linked).length;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Animated background elements */}
        <div className={styles.backgroundElements}>
          <div className={`${styles.bgOrb} ${styles.bgOrb1}`}></div>
          <div className={`${styles.bgOrb} ${styles.bgOrb2}`}></div>
          <div className={`${styles.bgOrb} ${styles.bgOrb3}`}></div>
        </div>

        {/* Floating particles */}
        <div className={styles.particles}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`}></div>
          ))}
        </div>

        {/* Main content */}
        <div className={styles.content}>
          {/* Hero section */}
          <div className={styles.hero}>
            <div className={styles.heroIcon}>
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h1 className={styles.heroTitle}>
              Connect Your <span className={styles.gradientText}>Analytics Sources</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Link your development and project management accounts to generate comprehensive 
              analytics reports and unlock powerful insights into your workflow.
            </p>
            
            {/* Connection progress indicator */}
            <div className={styles.progressIndicator}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(connectedCount / totalCount) * 100}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>
                {connectedCount} of {totalCount} sources connected
              </span>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className={styles.errorAlert}>
              <div className={styles.errorContent}>
                <div className={styles.errorIcon}>
                  <FontAwesomeIcon icon="exclamation-triangle" />
                </div>
                <div className={styles.errorText}>{error}</div>
                <button 
                  className={styles.errorDismiss}
                  onClick={() => setError(null)}
                  title="Dismiss error"
                >
                  <FontAwesomeIcon icon="times" />
                </button>
              </div>
            </div>
          )}

          {/* Account cards grid */}
          <div className={styles.cardsSection}>
            <div className={styles.cardGrid}>
              <AccountLinkCard
                name="GitHub"
                provider="github"
                linked={linked.github}
                onClick={handleLinkGithub}
                onUnlink={() => handleUnlink("github")}
                description="Connect your GitHub repositories to analyze code commits, pull requests, and development activity."
                icon={faGithub}
              />
            </div>
          </div>
          {/* Enhanced Report Viewer */}
          <div className={styles.reportSection}>
            <ReportViewer />
          </div>
        </div>
      </div>
    </>
  );
}