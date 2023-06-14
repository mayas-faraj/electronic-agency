import React from "react";
import { useParams } from "react-router-dom";
import Page from "../components/page";
import SubCategory from "../components/content-forms/sub-category";

const AddCategoryPage = () => {
  // read param
  const categoryParam = useParams().categoryid;
  let categoryId: number | undefined = undefined;

  if (categoryParam != null) categoryId = parseInt(categoryParam);
  
  return (
    <Page title="Add New Sub-Category">
        <SubCategory categoryId={categoryId} />
    </Page>
  )
};

export default AddCategoryPage;