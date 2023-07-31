import React from "react";
import Page from "../components/page";
import Admins from "../components/content-tables/admins";

const AdminsPage = () => {
  return (
    <Page title="System Backend User">
        <Admins />
    </Page>
  )
};

export default AdminsPage;