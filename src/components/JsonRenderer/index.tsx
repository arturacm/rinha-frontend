import React, { useEffect, useState, Fragment, useRef, ReactNode } from "react";
import styles from "./styles.module.css";
import useOnScreen from "@/utils/useOnScreen";

type JsonRendererProps = {
  json: File;
  setError: (error: string) => void;
};

function JsonRenderer({ json, setError }: JsonRendererProps) {
  const [loading, setLoading] = useState<boolean>();
  const [parsedObj, setParsedObj] = useState<Record<string, any>>();
  const [chunks, setChunks] = useState(10);
  const visibility = useRef(null);
  const isVisible = useOnScreen(visibility);
  const [endOfList, setEndOfList] = useState(false);
  const renderedPs = useRef(0);

  useEffect(() => {
    if (!isVisible) return;
    if (endOfList) return;

    const ps = document.querySelectorAll("p").length;

    if (renderedPs.current !== ps) {
      renderedPs.current = ps;
      setChunks((prev) => prev + 5);
    } else {
      if (chunks >= 15) {
        console.log("end of list");
        setEndOfList(true);
      }
    }
  }, [isVisible, endOfList, chunks]);

  useEffect(() => {
    const jsonFileReader = new FileReader();

    function readerLoadHandler(e: ProgressEvent<FileReader>) {
      const fileContent = e.target?.result as string;

      try {
        const parsed = JSON.parse(fileContent);
        setParsedObj(parsed);
      } catch (err) {
        setError(
          "Invalid JSON: there was a problem while loading the JSON file."
        );
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    jsonFileReader.addEventListener("load", readerLoadHandler);
    jsonFileReader.readAsText(json, "UTF-8");
  }, [json, setError]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{json.name}</h1>
      {loading
        ? "LOADING"
        : parsedObj && renderJson(parsedObj, "root", 0, chunks)}
      {!endOfList ? (
        <div
          ref={visibility}
          style={{ height: 2, width: 2, backgroundColor: "red" }}
        />
      ) : null}
    </div>
  );
}

function renderJson(
  json: Record<string, any> | Record<string, any>[],
  keyInheritance: string,
  chunksCounter: number,
  chunksLimit: number
): ReactNode {
  if (json === null) return null;
  if (chunksCounter > chunksLimit) return null;

  if (Array.isArray(json)) {
    return (
      <Fragment key={keyInheritance}>
        <p id={`${++chunksCounter}`}>
          <span className={styles.squareBrackets}>{"["}</span>
        </p>
        {json.map((el, index) => {
          const orderKey = `${keyInheritance}-array-${index}`;
          if (typeof el === "string") {
            return (
              <p
                id={`${++chunksCounter}`}
                className={styles.children}
                key={orderKey}
              >
                <span className={styles.arrayIndex}>{index}:</span>
                <span> &quot;{el}&quot;</span>
              </p>
            );
          }
          if (typeof el === "object" && el !== null) {
            const children = renderJson(
              el,
              orderKey,
              chunksCounter,
              chunksLimit
            );
            return children ? (
              <div className={styles.children} key={orderKey}>
                <p id={`${++chunksCounter}`}>
                  <span className={styles.arrayIndex}>{index}:</span>
                </p>

                <div className={styles.children}>{children}</div>
              </div>
            ) : null;
          }
          return (
            <p
              id={`${++chunksCounter}`}
              className={styles.children}
              key={orderKey}
            >
              <span className={styles.arrayIndex}>{index}:</span>
              <span> {`${el}`}</span>
            </p>
          );
        })}
        <p id={`${++chunksCounter}`}>
          <span className={styles.squareBrackets}>{"]"}</span>
        </p>
      </Fragment>
    );
  }

  return Object.entries(json).map(([key, value]) => {
    const orderKey = `${keyInheritance}-${key}`;
    if (typeof value === "string") {
      return (
        <p id={`${++chunksCounter}`} key={orderKey}>
          <span className={styles.key}>{key}:</span>{" "}
          <span>&quot;{value}&quot;</span>
        </p>
      );
    }

    if (Array.isArray(value)) {
      return (
        <Fragment key={orderKey}>
          <p id={`${++chunksCounter}`}>
            <span className={styles.key}>{key}:</span>{" "}
            <span className={styles.squareBrackets}>{"["}</span>
          </p>
          {value.map((el, index) => {
            const arrayOrderKey = `array-${index}${orderKey}`;
            if (typeof el === "string") {
              return (
                <p
                  id={`${++chunksCounter}`}
                  className={styles.children}
                  key={arrayOrderKey}
                >
                  <span className={styles.arrayIndex}>{index}:</span>
                  <span> &quot;{el}&quot;</span>
                </p>
              );
            }
            if (typeof el === "object" && el !== null) {
              const children = renderJson(
                el,
                orderKey,
                chunksCounter,
                chunksLimit
              );
              return children ? (
                <Fragment key={arrayOrderKey}>
                  <p id={`${++chunksCounter}`}>
                    <span className={styles.arrayIndex}>{index}:</span>
                  </p>
                  <div className={styles.children}>{children}</div>
                </Fragment>
              ) : null;
            }
            return (
              <p
                id={`${++chunksCounter}`}
                className={styles.children}
                key={arrayOrderKey}
              >
                <span className={styles.arrayIndex}>{index}:</span>
                <span> {`${el}`}</span>
              </p>
            );
          })}
          <p id={`${++chunksCounter}`}>
            <span className={styles.squareBrackets}>{"]"}</span>
          </p>
        </Fragment>
      );
    }
    if (typeof value === "object" && value !== null) {
      const children = renderJson(value, orderKey, chunksCounter, chunksLimit);

      return children ? (
        <Fragment key={orderKey}>
          <p id={`${++chunksCounter}`}>
            <span className={styles.key}>{key}:</span>
          </p>
          <div className={styles.children}>{children}</div>
        </Fragment>
      ) : null;
    }
    return (
      <p id={`${++chunksCounter}`} key={orderKey}>
        <span className={styles.key}>{key}:</span> <span>{`${value}`}</span>
      </p>
    );
  });
}

export default JsonRenderer;
