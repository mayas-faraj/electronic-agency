import React from "react";
import Page from "../components/page";
import Clients from "../components/content-tables/clients";

const ClientsPage = () => {
  return (
    <Page title="Registered Clients">
        <Clients />
    </Page>
  )
};

export default ClientsPage;