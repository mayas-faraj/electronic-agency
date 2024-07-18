import React from "react";
import Page from "../components/page";
import Ticket from "../components/content-forms/ticket";
import { AccessType } from "../components/content-tables/tickets";

const AddProductPage = () => {
  return (
    <Page title="Add New Ticket">
        <Ticket/>
    </Page>
  )
};

export default AddProductPage;