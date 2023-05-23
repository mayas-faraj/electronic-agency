import React, { FunctionComponent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import styles from "../styles/page.module.scss";
import { ArrowBack } from "@mui/icons-material";

// compoents props
interface IPageProps {
  title: string
  children: ReactNode
}

// main component
const Page: FunctionComponent<IPageProps> = ({ title, children }) => {
  // navigation
  const navigate = useNavigate();

  // render component
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1 className={styles.title}><span className={styles.title__text}>{title}</span></h1>
        <div className={styles.content}>{children}</div>
        <div className={styles.command}>
          <a className="button" href="#!" onClick={ () => navigate(-1) }><ArrowBack />Back</a>
        </div>
      </div>
    </>
  )
};

export default Page;