import React from "react";
import RoleContext from "../components/role-context";
import Header from "../components/header";

const HomePage = () => {
  // read privileges
  const privileges = React.useContext(RoleContext);
  console.log(privileges);
  return <div><Header /></div>;
};

export default HomePage;
