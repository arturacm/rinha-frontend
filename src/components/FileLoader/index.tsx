import { ChangeEvent, useCallback, useState } from "react";
import styles from "./styles.module.css";

type FileLoaderProps = {
  setJsonFile: (file: File) => void;
};

function FileLoader({ setJsonFile }: FileLoaderProps) {
  const [hasInputError, setInputError] = useState(false);

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.type === "application/json") {
        setJsonFile(file);
        setInputError(false);
      } else {
        setInputError(true);
      }
    },
    [setJsonFile]
  );

  return (
    <div className={styles.container}>
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
    </div>
  );
}

export default FileLoader;
