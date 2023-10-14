"use client";

import { ChangeEvent, useCallback, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [jsonFile, setJsonFile] = useState<File>();
  const [hasInputError, setInputError] = useState(false);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "application/json") {
      setJsonFile(file);
      setInputError(false);
      console.log(file);
    } else {
      setInputError(true);
    }
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>JSON Tree Viewer</h1>
      <p className={styles.subTitle}>
        Simple JSON Viewer that runs completely on-client. No data exchange
      </p>
      <label className={styles.loadButton} htmlFor="json-input">
        Load JSON
      </label>
      <input
        name="json-input"
        id="json-input"
        type="file"
        className={styles.jsonInput}
        onChange={handleFileInput}
      />
      {hasInputError ? (
        <span className={styles.error}>
          Invalid file. Please load a valid JSON file.
        </span>
      ) : null}
    </main>
  );
}
