import React from "react";
import styles from "./CuteDogButton.module.css";

/**
 * Reusable dog button inspired by:
 * https://codepen.io/alexjmold/pen/YzWoEJV
 */
const CuteDogButton = ({
  text = "Adoptar ahora",
  mainColor = "#ffffff",
  hoverColor = "#f5f7fb",
  textColor = "#111827",
  dogColor = "#e1a46e",
  borderWidth = "4px",
  borderColor = "#374151",
  hoverTextColor = undefined,
  hoverBorderColor = undefined,
  href = undefined,
  onClick = undefined,
  className = "",
}) => {
  const colorVars = {
    "--cute-btn-bg": mainColor,
    "--cute-btn-hover-bg": hoverColor,
    "--cute-btn-text": textColor,
    "--cute-dog-color": dogColor,
    "--cute-btn-border-width": borderWidth,
    "--cute-btn-border-color": borderColor,
    "--cute-btn-hover-text": hoverTextColor || textColor,
    "--cute-btn-hover-border-color": hoverBorderColor || borderColor,
  };

  const commonProps = {
    className: styles.button,
    onClick,
  };

  return (
    <div className={`${styles.buttonContainer} ${className}`} style={colorVars}>
      <div className={styles.dog}>
        <div className={styles.tail} />
        <div className={styles.body} />
        <div className={styles.head}>
          <div className={styles.eyes}>
            <div className={styles.left} />
            <div className={styles.right} />
          </div>
          <div className={styles.nuzzle}>
            <div className={styles.mouth}>
              <div className={styles.tongue} />
            </div>
            <div className={styles.nose}>
              <div className={styles.nostrils} />
              <div className={styles.highlight} />
            </div>
          </div>
        </div>
        <div className={styles.ears}>
          <div className={styles.left} />
          <div className={styles.right} />
        </div>
      </div>

      {href ? (
        <a href={href} {...commonProps}>
          {text}
        </a>
      ) : (
        <button type="button" {...commonProps}>
          {text}
        </button>
      )}

      <div className={styles.paw} />
      <div className={`${styles.paw} ${styles.top}`} />
    </div>
  );
};

export default CuteDogButton;
