import { useAuth } from "../context/AuthContext";
import styles from "../styles/components/navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles["nav-content"]}>
        <div className={styles["nav-logo"]}>
          <img 
            src="/SyngenX.png" 
            alt="DevInsight Logo" 
            className={styles["nav-logo-img"]}
          />
          <div className={styles["nav-brand"]}>SyngenX</div>
        </div>
        
        <div className={styles["nav-links"]}>
          {user && (
            <>
              <span className={styles["nav-link"]}>{user.email}</span>
              <button onClick={logout} className={`${styles.btn} ${styles["btn-primary"]}`}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}