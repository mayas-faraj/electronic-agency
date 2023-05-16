import React, { FunctionComponent, ReactNode } from "react";
import styles from "../styles/content.module.scss";

// define types
type primitive = number | string | boolean;
type keyValue = Record<string, primitive>;

export interface IContentInterface {
    name: string;
    initialValues?: keyValue[];
    children: ReactNode
}

export interface IAction {
  key: string
  value: primitive
}

// define name context
export const NameContext = React.createContext("item");

// define reducer
export const reducer = (state: keyValue[], action: IAction): keyValue[] => {
  return {
    ...state,
    [action.key]: action.value
  }
}

// main component
const Content: FunctionComponent<IContentInterface> = ({ name, children, initialValues }) => {
    return (
        <NameContext.Provider value={name}>
          <div className={styles.wrapper}>{children}</div>
        </NameContext.Provider>
    );
};

export default Content;