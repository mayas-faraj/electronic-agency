import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import styles from "../styles/page.module.scss";

// compoents props
interface IPageProps {
  title: string
  children: ReactNode
}

// main component
const Page: FunctionComponent<IPageProps> = ({ title, children }) => {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1 className={styles.title}><span className={styles.title__text}>{title}</span></h1>
        <div className={styles.content}>{children}</div>
        <div className={styles.command}>
          <Link to="/" className={styles.button}>Back</Link>
        </div>
      </div>
    </>
  )
};

export default Page;