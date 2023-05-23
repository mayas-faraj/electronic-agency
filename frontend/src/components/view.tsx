import React, { FunctionComponent, ReactNode } from "react";
import getServerData from "../libs/server-data";
import styles from "../styles/view.module.scss";
import { Cancel, Face, Face3, TaskAlt } from "@mui/icons-material";

// type defintion
type primitiveType = string | number | boolean;

interface IHeader {
  key: string
  title: string
  icon: ReactNode
}

interface IView {
  command: string
  headers: IHeader[];
  title?: string
}

// main component
const View: FunctionComponent<IView> = ({ command, headers, title }) => {
  const [data, setData] = React.useState<Record<string, primitiveType>>({});

  // load data on mount
  React.useEffect(() => {
    const action = async () => {
      const response = await getServerData(command);
      setData(response.data[Object.keys(response.data)[0]]);
    };
    action();
  }, [command]);

  // transform data
  const transformData = (key: string, value: primitiveType) => {
    // transform data
    if (key === "isDisabled") return value ? <Cancel color="error" /> : <TaskAlt color="success" />;
    if (key === "isMale") return value ? <Face /> : <Face3 />;
    else if (value == null) return "-";
    else if (key === "createdAt" || key === "updatedAt" || key === "lastLoginAt") return new Date(parseInt(value as string)).toLocaleString();
    else return value;
  };

  // render component
  return (
    <div className={styles.wrapper}>
      {title != null && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.data}>
        {
          headers.map(header  => (
            <div key={header.key} className={styles.row}>
              <div className={styles.cell}>{header.icon}</div>
              <div className={styles.cell}>{header.title}</div>
              <div className={styles.cell}>{transformData(header.key, data[header.key])}</div>
            </div>
          ))
        }
        </div>
    </div>
  )
};

export default View;