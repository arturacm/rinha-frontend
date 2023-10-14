import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>JSON Tree Viewer</h1>
      <p className={styles.subTitle}>
        Simple JSON Viewer that runs completely on-client. No data exchange
      </p>
      <button className={styles.loadButton}>Load JSON</button>
      <span className={styles.error}>Invalid file. Please load a valid JSON file.</span>
    </main>
  );
}
