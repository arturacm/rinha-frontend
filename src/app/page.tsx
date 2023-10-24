"use client";

import { useState } from "react";
import styles from "./page.module.css";
import FileLoader from "@/components/FileLoader";
import JsonRenderer from "@/components/JsonRenderer";

export default function Home() {
  const [jsonFile, setJsonFile] = useState<File>();
  const [error, setError] = useState<string>();

  return (
    <main className={styles.main}>
      {jsonFile && !error ? (
        <JsonRenderer setError={setError} json={jsonFile} />
      ) : (
        <FileLoader
          setJsonFile={setJsonFile}
          setError={setError}
          error={error}
        />
      )}
    </main>
  );
}
