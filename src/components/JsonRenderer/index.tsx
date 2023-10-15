import React, { useEffect, useState, Fragment } from "react";
import styles from "./styles.module.css";

type JsonRendererProps = {
  json: File;
};

function JsonRenderer({ json }: JsonRendererProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string>();

  useEffect(() => {
    setLoading(true);
    json
      .text()
      .then((res) => {
        setText(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{json.name}</h1>
      {loading ? "LOADING" : text && <pre>{text}</pre>}
    </div>
  );
}

export default JsonRenderer;
