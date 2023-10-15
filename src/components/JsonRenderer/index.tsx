import React, { useEffect, useState, Fragment } from "react";
import styles from "./styles.module.css";

type JsonRendererProps = {
  json: File;
};

function JsonRenderer({ json }: JsonRendererProps) {
  const [loading, setLoading] = useState(false);
  const [parsedObj, setParsedObj] = useState<Record<string, any>>();

  useEffect(() => {
    setLoading(true);
    json
      .text()
      .then((res) => {
        setParsedObj(JSON.parse(res));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [json]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{json.name}</h1>
      {loading ? "LOADING" : parsedObj && renderJson(parsedObj)}
    </div>
  );
}

function renderJson(
  json: Record<string, any> | Record<string, any>[],
  keyInheritance: string = "root"
) {
  if (Array.isArray(json)) {
    return (
      <Fragment key={keyInheritance}>
        <p>
          <span className={styles.squareBrackets}>{"["}</span>
        </p>
        {json.map((el, index) => {
          const orderKey = `${keyInheritance}-array-${index}`;
          if (typeof el === "string") {
            return (
              <p className={styles.children} key={orderKey}>
                <span className={styles.arrayIndex}>{index}:</span>
                <span> &quot;{el}&quot;</span>
              </p>
            );
          }
          if (typeof el === "object") {
            return (
              <div className={styles.children} key={orderKey}>
                <span className={styles.arrayIndex}>{index}:</span>
                <div className={styles.children}>
                  {renderJson(el, orderKey)}
                </div>
              </div>
            );
          }
          return (
            <p className={styles.children} key={orderKey}>
              <span className={styles.arrayIndex}>{index}:</span>
              <span> {`${el}`}</span>
            </p>
          );
        })}
        <p>
          <span className={styles.squareBrackets}>{"]"}</span>
        </p>
      </Fragment>
    );
  }

  return Object.entries(json).map(([key, value]) => {
    const orderKey = `${keyInheritance}-${key}`;
    if (typeof value === "string") {
      return (
        <p key={orderKey}>
          <span className={styles.key}>{key}:</span> <span>&quot;{value}&quot;</span>
        </p>
      );
    }

    if (Array.isArray(value)) {
      return (
        <Fragment key={orderKey}>
          <p>
            <span className={styles.key}>{key}:</span>{" "}
            <span className={styles.squareBrackets}>{"["}</span>
          </p>
          {value.map((el, index) => {
            const arrayOrderKey = `array-${index}${orderKey}`;
            if (typeof el === "string") {
              return (
                <p className={styles.children} key={arrayOrderKey}>
                  <span className={styles.arrayIndex}>{index}:</span>
                  <span> &quot;{el}&quot;</span>
                </p>
              );
            }
            if (typeof el === "object") {
              return (
                <Fragment key={arrayOrderKey}>
                  <span className={styles.arrayIndex}>{index}:</span>
                  <div className={styles.children}>
                    {renderJson(el, orderKey)}
                  </div>
                </Fragment>
              );
            }
            return (
              <p className={styles.children} key={arrayOrderKey}>
                <span className={styles.arrayIndex}>{index}:</span>
                <span> {`${el}`}</span>
              </p>
            );
          })}
          <p>
            <span className={styles.squareBrackets}>{"]"}</span>
          </p>
        </Fragment>
      );
    }
    if (typeof value === "object") {
      return (
        <Fragment key={orderKey}>
          <p>
            <span className={styles.key}>{key}:</span>
          </p>
          <div className={styles.children}>{renderJson(value, orderKey)}</div>
        </Fragment>
      );
    }
    return (
      <p key={orderKey}>
        <span className={styles.key}>{key}:</span> <span>{`${value}`}</span>
      </p>
    );
  });
}

export default JsonRenderer;
