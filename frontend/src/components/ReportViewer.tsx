import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateReport } from "../api/generateReport";
import styles from "../styles/components/reportViewer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faMagic,
  faExclamationCircle,
  faTimes,
  faFilePdf,
  faDownload
} from "@fortawesome/free-solid-svg-icons";

export default function ReportViewer() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const blob = await generateReport(token);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("Report generation failed:", err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `DevInsight-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
  };

  return (
    <div className={styles.reportContainer}>
      {/* Report header */}
      <div className={styles.reportHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faChartBar} />
          </div>
          <div className={styles.headerText}>
            <h2 className={styles.headerTitle}>Performance Analytics</h2>
            <p className={styles.headerSubtitle}>
              Generate comprehensive reports from your connected data sources
            </p>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            onClick={handleGenerate} 
            disabled={loading || !token}
            className={`${styles.generateBtn} ${loading ? styles.loading : ''}`}
          >
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faMagic} />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon icon={faExclamationCircle} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* Report viewer */}
      {pdfUrl && (
        <div className={styles.reportViewer}>
          <div className={styles.viewerHeader}>
            <div className={styles.viewerTitle}>
              <FontAwesomeIcon icon={faFilePdf} />
              <span>Performance Report</span>
              <div className={styles.reportBadge}>
                Generated {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className={styles.viewerActions}>
              <button onClick={handleDownload} className={styles.downloadBtn}>
                <FontAwesomeIcon icon={faDownload} />
                Download
              </button>
              <button onClick={handleClose} className={styles.closeBtn}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          
          <div className={styles.pdfContainer}>
            <iframe 
              src={pdfUrl} 
              className={styles.pdfViewer}
              title="Performance Report"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Report features */}
    </div>
  );
}