import React, { FunctionComponent, ReactNode } from "react";

// define name context
export const NameContext = React.createContext("item");

// define types
export interface IContentInterface {
    name: string;
    children: ReactNode
}

// main component
const Content: FunctionComponent<IContentInterface> = ({ name, children }) => {
    return (
        <NameContext.Provider value={name}>{children}</NameContext.Provider>
    );
};

export default Content;