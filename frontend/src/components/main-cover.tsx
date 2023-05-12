import React, { type FunctionComponent } from "react";
import greeTitle from "../assets/imgs/gree-title.png";
import styles from "../styles/main-cover.module.scss";

interface MainCoverProps {
  title?: string;
  isBlinking?: boolean;
}

const MainCover: FunctionComponent<MainCoverProps> = ({ title, isBlinking }) => {
  return (
    <div className={styles.cover}>
      <img className={styles.image + (isBlinking === true ? " " + styles.blink : "")} src={greeTitle} alt="Al Ardh Al Salba"/>
      {title != null && <h1 className={styles.title}>{title}</h1>}
    </div>
  );
};

export default MainCover;
