"use client";

import { useState } from "react";
import styles from "./page.module.css";
import FileLoader from "@/components/FileLoader";
import JsonRenderer from "@/components/JsonRenderer";

export default function Home() {
  const [jsonFile, setJsonFile] = useState<File>();

  return (
    <main className={styles.main}>
      {jsonFile ? (
        <JsonRenderer json={jsonFile} />
      ) : (
        <FileLoader setJsonFile={setJsonFile} />
      )}
    </main>
  );
}
