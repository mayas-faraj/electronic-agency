import React from "react";
import Page from "../components/page";
import Center from "../components/content-forms/center";
import { useParams } from "react-router-dom";

const AddCenterPage = () => {
  // get param
  const parentId = useParams()["parentId"];

  return (
    <Page title="Add New Center">
      <Center parentId={parentId !== undefined ? parseInt(parentId) : undefined} />
    </Page>
  );
};

export default AddCenterPage;
